import { Controller, Get, Post, Param, Req, UseGuards, Optional } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly service: RecommendationsService) {}

  // 🔹 сохраняем факт просмотра (если есть юзер — сохраняем, если нет — просто логируем)
  @Post('view/:listingId')
  async addView(@Req() req, @Param('listingId') listingId: string) {
    const userId = req.user?.id || null;
    return this.service.addView(userId, listingId);
  }

  // 🔹 недавно просмотренные (только авторизованные)
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async recent(@Req() req) {
    return this.service.getRecentlyViewed(req.user.id);
  }

  // 🔹 умные рекомендации (гости + юзеры)
  @Get('smart')
  async smart(@Req() req) {
    const userId = req.user?.id || null;
    return this.service.getSmartRecommendations(userId);
  }
}
