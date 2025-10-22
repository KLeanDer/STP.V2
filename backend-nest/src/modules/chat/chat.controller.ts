// src/modules/chat/chat.controller.ts
import { Controller, Get, Post, Param, Req, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Создать новый чат между покупателем и продавцом
   * POST /api/chat/create
   * body: { sellerId: string, listingId: string }
   */
  @Post('create')
  createChat(
    @Req() req: any,
    @Body() body: { sellerId: string; listingId: string },
  ) {
    const buyerId = req.user.userId;
    return this.chatService.createChat(buyerId, body.sellerId, body.listingId);
  }

  /**
   * Получить список всех чатов пользователя
   * GET /api/chat/my-chats
   */
  @Get('my-chats')
  getMyChats(@Req() req: any) {
    const userId = req.user.userId;
    return this.chatService.getUserChats(userId);
  }

  /**
   * Получить все сообщения конкретного чата
   * GET /api/chat/:chatId/messages
   */
  @Get(':chatId/messages')
  getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(chatId);
  }

  /**
   * Получить чат + участников + объявление + все сообщения
   * GET /api/chat/:chatId
   */
  @Get(':chatId')
  getChat(@Param('chatId') chatId: string) {
    return this.chatService.getChatWithMessages(chatId);
  }
}
