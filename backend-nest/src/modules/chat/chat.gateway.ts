// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // userId -> множество socketId (вкладки/устройства)
  private onlineUsers: Map<string, Set<string>> = new Map();
  // userId -> таймер отложенного offline
  private offlineTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly chatService: ChatService) {}

  /** Личная комната пользователя */
  @SubscribeMessage('joinUser')
  async joinUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = data?.userId;
    if (!userId) {
      client.emit('error', { message: 'userId обязателен для joinUser' });
      return;
    }

    // привязываем userId к сокету (удобно для disconnect)
    client.data.userId = userId;
    client.join(userId);

    // если был таймер оффлайна → отменяем (юзер вернулся)
    if (this.offlineTimers.has(userId)) {
      clearTimeout(this.offlineTimers.get(userId)!);
      this.offlineTimers.delete(userId);
    }

    // добавляем сокет в множество
    const set = this.onlineUsers.get(userId) ?? new Set<string>();
    const wasEmpty = set.size === 0;
    set.add(client.id);
    this.onlineUsers.set(userId, set);

    // если это ПЕРВОЕ подключение для userId → уведомим всех
    if (wasEmpty) {
      this.server.emit('userOnline', { userId, online: true });
    }

    // новый клиент получает seed — список всех онлайн-юзеров
    const allOnline = Array.from(this.onlineUsers.keys());
    client.emit('presence:seed', { onlineUserIds: allOnline });

    // общий счётчик
    const total = await this.chatService.getUnreadCount(userId);
    this.server.to(userId).emit('unreadCountUpdated', total);

    // счётчики по чатам
    const perChat = await this.chatService.getUnreadCountByChat(userId);
    perChat.forEach((c) =>
      this.server.to(userId).emit('chatUnreadUpdated', {
        chatId: c.chatId,
        unreadCount: c.count,
      }),
    );

    console.log(
      `✅ joinUser ${userId} sockets=${this.onlineUsers.get(userId)?.size}`,
    );
  }

  /** Запросить актуальный счётчик непрочитанных */
  @SubscribeMessage('requestUnreadCount')
  async requestUnreadCount(@MessageBody() data: { userId: string }) {
    const userId = data?.userId;
    if (!userId) return;

    const total = await this.chatService.getUnreadCount(userId);
    this.server.to(userId).emit('unreadCountUpdated', total);

    const perChat = await this.chatService.getUnreadCountByChat(userId);
    perChat.forEach((c) =>
      this.server.to(userId).emit('chatUnreadUpdated', {
        chatId: c.chatId,
        unreadCount: c.count,
      }),
    );
  }

  /** Подключиться к комнате чата */
  @SubscribeMessage('joinChat')
  async joinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.chatId) {
      client.emit('error', { message: 'chatId обязателен для joinChat' });
      return;
    }
    client.join(data.chatId);
    console.log(`✅ ${client.id} joinChat ${data.chatId}`);
  }

  /** Выйти из комнаты чата */
  @SubscribeMessage('leaveChat')
  async leaveChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.chatId) return;
    client.leave(data.chatId);
    console.log(`↩️ ${client.id} leaveChat ${data.chatId}`);
  }

  /** Отправка сообщения */
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: SendMessageDto & { senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!data.chatId || !data.senderId || !data.receiverId || !data.text) {
        client.emit('error', {
          message: 'chatId, senderId, receiverId и text обязательны',
        });
        return;
      }

      const message = await this.chatService.saveMessage(data.senderId, data);

      // всем в чате
      this.server.to(data.chatId).emit('newMessage', message);

      // обновим общий + чатовый счётчик для получателя
      const total = await this.chatService.getUnreadCount(data.receiverId);
      const perChat = await this.chatService.getChatUnreadCount(
        data.chatId,
        data.receiverId,
      );

      this.server.to(data.receiverId).emit('unreadCountUpdated', total);
      this.server.to(data.receiverId).emit('chatUnreadUpdated', {
        chatId: data.chatId,
        unreadCount: perChat,
      });

      // подтверждение отправителю
      client.emit('messageSent', message);

      // как только сообщение отправлено → гасим индикатор typing
      this.server.to(data.chatId).emit('typing', {
        chatId: data.chatId,
        userId: data.senderId,
        isTyping: false,
      });
    } catch (error) {
      console.error('❌ sendMessage error', error);
      client.emit('error', { message: 'Не удалось отправить сообщение' });
    }
  }

  /** Обновление статуса */
  @SubscribeMessage('updateStatus')
  async handleStatusUpdate(
    @MessageBody() data: { messageId: string; status: MessageStatus },
  ) {
    if (!data?.messageId || !data?.status) return;
    try {
      const updated = await this.chatService.updateMessageStatus(
        data.messageId,
        data.status,
      );
      this.server.emit('messageStatusUpdated', updated);
    } catch (error) {
      console.error('❌ updateStatus error', error);
    }
  }

  /** Пометить чат прочитанным */
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { chatId: string; userId: string },
  ) {
    try {
      await this.chatService.markChatAsRead(data.chatId, data.userId);

      const total = await this.chatService.getUnreadCount(data.userId);

      this.server.to(data.userId).emit('unreadCountUpdated', total);
      this.server.to(data.userId).emit('chatUnreadUpdated', {
        chatId: data.chatId,
        unreadCount: 0,
      });

      console.log(
        `👁 read chat=${data.chatId} user=${data.userId} → unread=0 (total=${total})`,
      );
    } catch (error) {
      console.error('❌ markAsRead error', error);
    }
  }

  /** Индикатор "печатает" */
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chatId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.chatId || !data?.userId) return;

    client.to(data.chatId).emit('typing', {
      chatId: data.chatId,
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  /** Отключение клиента → оффлайн с задержкой 5 сек (если это ПОСЛЕДНИЙ сокет юзера) */
  async handleDisconnect(client: Socket) {
    const userId: string | undefined = client.data?.userId;
    if (!userId) return;

    const set = this.onlineUsers.get(userId);
    if (!set) return;

    set.delete(client.id);

    if (set.size === 0) {
      // никто не остался — поставим таймер
      const timer = setTimeout(() => {
        const current = this.onlineUsers.get(userId);
        if (!current || current.size === 0) {
          this.onlineUsers.delete(userId);
          this.server.emit('userOffline', {
            userId,
            online: false,
            lastSeen: new Date().toISOString(),
          });
          console.log(`⚪ User ${userId} offline`);
        }
        this.offlineTimers.delete(userId);
      }, 5000);

      this.offlineTimers.set(userId, timer);
    } else {
      // ещё есть активные сокеты — оффлайн не шлём
      this.onlineUsers.set(userId, set);
    }
  }
}
