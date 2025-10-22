// src/modules/chat/dto/send-message.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'chatId обязателен' })
  @IsString({ message: 'chatId должен быть строкой' })
  chatId: string;

  @IsNotEmpty({ message: 'receiverId обязателен' })
  @IsString({ message: 'receiverId должен быть строкой' })
  receiverId: string;

  @IsNotEmpty({ message: 'Текст сообщения обязателен' })
  @IsString({ message: 'Текст сообщения должен быть строкой' })
  text: string;
}
