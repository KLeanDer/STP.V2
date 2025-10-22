// src/modules/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создать уведомление
   */
  async createNotification(userId: string, type: string, content: string) {
    return this.prisma.notification.create({
      data: { userId, type, content },
    });
  }

  /**
   * Получить список уведомлений пользователя
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Отметить уведомление как прочитанное
   */
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
