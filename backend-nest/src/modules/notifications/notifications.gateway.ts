// src/modules/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Отправить уведомление конкретному пользователю
   */
  sendNotification(userId: string, notification: any) {
    // предполагаем, что фронт при connect делает socket.join(userId)
    this.server.to(userId).emit('notification', notification);
  }
}
