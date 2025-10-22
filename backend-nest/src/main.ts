import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Разрешаем CORS для фронта
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // 👇 Глобальный префикс для API
  app.setGlobalPrefix('api');

  // 👇 Валидация DTO
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
