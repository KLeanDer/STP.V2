// src/modules/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [NotificationsService, NotificationsGateway, PrismaService],
  exports: [NotificationsService, NotificationsGateway], // чтобы юзать в чате и заказах
})
export class NotificationsModule {}
