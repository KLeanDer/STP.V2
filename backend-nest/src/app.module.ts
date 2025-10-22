import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

// --- основные модули ---
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { PresenceModule } from './modules/presence/presence.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { ViewsModule } from './modules/views/views.module';

/**
 * 🧠 Главный модуль приложения STP.V2
 * Подключает все модули и глобальные сервисы.
 */
@Module({
  imports: [
    // ✅ Планировщик (используется в RecommendationsService для cron-задачи)
    ScheduleModule.forRoot(),

    // ✅ Модули системы
    AuthModule,
    UsersModule,
    ListingsModule,
    OrdersModule,
    ChatModule,
    NotificationsModule,
    UploadsModule,
    PresenceModule,
    RecommendationsModule, // модуль рекомендаций (просмотры + рекомендации)
    ViewsModule, // если используется для статистики просмотров
  ],
})
export class AppModule {}
