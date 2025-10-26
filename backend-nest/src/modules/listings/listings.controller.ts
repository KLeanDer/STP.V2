import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // === 🗂 Все объявления ===
  @Get()
  async getAll(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.listingsService.getAllListings({ userId, status });
  }

  // === 🌍 Explore — умная лента с пагинацией (ДОЛЖНА быть выше :id!) ===
  @Get('explore')
  async getExplore(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.listingsService.getExploreListings(pageNum, limitNum);
  }

  // === 💡 Рекомендации ===
  @Get('recommendations')
  async getRecommendations(@Query('recentIds') recentIds?: string) {
    return this.listingsService.getRecommendations(recentIds);
  }

  // === 🔥 Популярные объявления ===
  @Get('popular/all')
  async getPopular() {
    return this.listingsService.getPopularListings();
  }

  // === 🌳 Дерево категорий ===
  @Get('categories/tree')
  async getCategoryTree() {
    return this.listingsService.getCategoryTree();
  }

  // === 📋 Атрибуты подкатегории ===
  @Get('subcategories/:id/attributes')
  async getSubcategoryAttributes(@Param('id') id: string) {
    return this.listingsService.getAttributesBySubcategory(id);
  }

  // === ⚡ Тренды недели ===
  @Get('trending/week')
  async getTrendingWeek() {
    return this.listingsService.getTrendingWeek();
  }

  // === 🧩 Похожие объявления ===
  @Get('related/:id')
  async getRelated(@Param('id') id: string) {
    return this.listingsService.getRelated(id);
  }

  // === 📄 Конкретное объявление ===
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.listingsService.getListingById(id);
  }

  // === 👁 Добавление просмотров (авторизованный пользователь) ===
  @UseGuards(JwtAuthGuard)
  @Post(':id/view')
  async addView(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.listingsService.incrementViews(id, userId);
  }

  // === 👁 Добавление просмотров (гость) ===
  @Post(':id/view-public')
  async addPublicView(@Param('id') id: string) {
    return this.listingsService.incrementViews(id);
  }

  // === ➕ Создать объявление ===
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateListingDto) {
    return this.listingsService.createListing(req.user.userId, dto);
  }

  // === ✏️ Обновить объявление ===
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.updateListing(id, req.user.userId, dto);
  }

  // === 🔄 Изменить статус (active / inactive) ===
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('status') status: string,
  ) {
    return this.listingsService.updateStatus(id, req.user.userId, status);
  }
}
