import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ViewsService } from './views.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  // ✅ Добавляем просмотр (авторизованный пользователь)
  @UseGuards(JwtAuthGuard)
  @Post(':listingId')
  async addView(@Req() req, @Param('listingId') listingId: string) {
    await this.viewsService.addView(req.user.id, listingId);
    return { success: true };
  }

  // ✅ Получаем список последних просмотров пользователя
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserViews(@Req() req) {
    return await this.viewsService.getUserViews(req.user.id);
  }
}
