// src/modules/chat/chat.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async assertParticipant(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true, buyerId: true, sellerId: true },
    });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    if (chat.buyerId !== userId && chat.sellerId !== userId) {
      throw new ForbiddenException('Нет доступа к чату');
    }

    return chat;
  }

  /**
   * Создать чат или вернуть существующий.
   * Уникальность: buyerId + sellerId + listingId.
   */
  async createChat(buyerId: string, sellerId: string, listingId: string) {
    if (!buyerId || !sellerId || !listingId) {
      throw new ForbiddenException(
        'buyerId, sellerId и listingId обязательны',
      );
    }

    const existing = await this.prisma.chat.findFirst({
      where: { buyerId, sellerId, listingId },
      include: {
        listing: { include: { images: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    if (existing) return existing;

    return this.prisma.chat.create({
      data: { buyerId, sellerId, listingId },
      include: {
        listing: { include: { images: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  /**
   * Список чатов пользователя (с последним сообщением и превью объявления)
   * + количество непрочитанных сообщений по каждому чату
   */
  async getUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        listing: { include: { images: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await this.getChatUnreadCount(chat.id, userId);
        return { ...chat, unreadCount };
      }),
    );
  }

  /**
   * Чат + участники + все сообщения
   */
  async getChatWithMessages(chatId: string, userId: string) {
    await this.assertParticipant(chatId, userId);

    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        listing: { include: { images: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, avatarUrl: true } },
            receiver: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    return chat;
  }

  /**
   * Сообщения чата
   */
  async getMessages(chatId: string, userId: string) {
    await this.assertParticipant(chatId, userId);

    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  /**
   * Сохранить сообщение
   */
  async saveMessage(senderId: string, dto: SendMessageDto) {
    if (!dto.chatId) throw new Error('chatId обязателен');
    if (!dto.receiverId) throw new Error('receiverId обязателен');

    const chat = await this.assertParticipant(dto.chatId, senderId);

    const receiverId =
      chat.buyerId === senderId ? chat.sellerId : chat.buyerId;

    if (!receiverId) {
      throw new ForbiddenException('Не удалось определить получателя');
    }

    if (dto.receiverId !== receiverId) {
      throw new ForbiddenException('Получатель не соответствует чату');
    }

    return this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        senderId,
        receiverId,
        text: dto.text,
        status: 'SENT',
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  /**
   * Обновить статус сообщения
   */
  async updateMessageStatus(
    messageId: string,
    status: 'SENT' | 'DELIVERED' | 'READ',
    userId: string,
  ) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, chatId: true, senderId: true, receiverId: true },
    });

    if (!message) {
      throw new NotFoundException('Сообщение не найдено');
    }

    await this.assertParticipant(message.chatId, userId);

    const isSender = message.senderId === userId;
    const isReceiver = message.receiverId === userId;

    if (status === 'SENT' && !isSender) {
      throw new ForbiddenException('Только отправитель может подтвердить отправку');
    }

    if (status !== 'SENT' && !isReceiver) {
      throw new ForbiddenException('Только получатель может обновлять статус сообщения');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        status,
        isRead: status === 'READ',
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  /**
   * Общий счётчик непрочитанных сообщений пользователя
   */
  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: { receiverId: userId, isRead: false },
    });
  }

  /**
   * Кол-во непрочитанных сообщений в конкретном чате
   */
  async getChatUnreadCount(chatId: string, userId: string) {
    return this.prisma.message.count({
      where: { chatId, receiverId: userId, isRead: false },
    });
  }

  /**
   * Кол-во непрочитанных по всем чатам (группировкой)
   */
  async getUnreadCountByChat(userId: string) {
    const result = await this.prisma.message.groupBy({
      by: ['chatId'],
      where: { receiverId: userId, isRead: false },
      _count: { _all: true },
    });
    return result.map((r) => ({ chatId: r.chatId, count: r._count._all }));
  }

  /**
   * Пометить все сообщения в чате как прочитанные
   */
  async markChatAsRead(chatId: string, userId: string) {
    await this.assertParticipant(chatId, userId);

    await this.prisma.message.updateMany({
      where: { chatId, receiverId: userId, isRead: false },
      data: { isRead: true, status: 'READ' },
    });
  }
}
