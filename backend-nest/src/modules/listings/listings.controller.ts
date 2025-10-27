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
  async getAll(@Query() query: Record<string, string | string[] | undefined>) {
    const {
      userId,
      status,
      categoryId,
      subcategoryId,
      priceMin,
      priceMax,
      city,
      deliveryAvailable,
      search,
      ids,
      limit,
      page,
    } = query;

    const parseNumber = (value?: string | string[]) => {
      if (Array.isArray(value)) return undefined;
      if (value === undefined || value === null || value.trim() === '') return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const parseBoolean = (value?: string | string[]) => {
      if (Array.isArray(value)) return undefined;
      if (value === undefined) return undefined;
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes'].includes(normalized)) return true;
      if (['false', '0', 'no'].includes(normalized)) return false;
      return undefined;
    };

    const parseIds = (value?: string | string[]) => {
      if (!value) return undefined;
      const raw = Array.isArray(value) ? value : value.split(',');
      const cleaned = raw.map((id) => id.trim()).filter((id) => id.length > 0);
      return cleaned.length ? cleaned : undefined;
    };

    const limitNum = parseNumber(limit);
    const pageNum = parseNumber(page);

    return this.listingsService.getAllListings(
      {
        userId: typeof userId === 'string' ? userId : undefined,
        status: typeof status === 'string' ? status : undefined,
        categoryId: typeof categoryId === 'string' ? categoryId : undefined,
        subcategoryId: typeof subcategoryId === 'string' ? subcategoryId : undefined,
        priceMin: parseNumber(priceMin),
        priceMax: parseNumber(priceMax),
        city: typeof city === 'string' ? city.trim() : undefined,
        deliveryAvailable: parseBoolean(deliveryAvailable),
        search: typeof search === 'string' ? search.trim() : undefined,
        ids: parseIds(ids),
      },
      {
        limit: limitNum && limitNum > 0 ? Math.min(limitNum, 100) : undefined,
        skip:
          limitNum && limitNum > 0
            ? Math.max((pageNum && pageNum > 0 ? pageNum : 1) - 1, 0) * limitNum
            : undefined,
      },
    );
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
