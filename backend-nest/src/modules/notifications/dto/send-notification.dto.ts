import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // кому отправляем

  @IsNotEmpty()
  @IsString()
  message: string;
}
