import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  // === Все объявления ===
  async getAllListings(filters?: { userId?: string; status?: string }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status && ['active', 'inactive'].includes(filters.status)) {
      where.status = filters.status;
    } else if (!filters?.userId) {
      where.status = 'active';
    }

    return this.prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            phone: true,
          },
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // === Конкретное объявление ===
  async getListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            phone: true,
          },
        },
        images: true,
      },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  // === Создать объявление ===
  async createListing(userId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        price: Number(dto.price),
        userId,
        status: 'active',
        views: 0,
        images: {
          create: Array.isArray(dto.images)
            ? dto.images
                .filter((url) => url && url.trim() !== '')
                .map((url) => ({ url }))
            : [],
        },
      },
      include: { user: true, images: true },
    });
  }

  // === Обновить объявление ===
  async updateListing(listingId: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.userId !== userId) return null;

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        ...dto,
        price: dto.price ? Number(dto.price) : listing.price,
        images: dto.images
          ? {
              deleteMany: {},
              create: dto.images
                .filter((url) => url && url.trim() !== '')
                .map((url) => ({ url })),
            }
          : undefined,
      },
      include: { user: true, images: true },
    });
  }

  // === Изменить статус ===
  async updateStatus(listingId: string, userId: string, status: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.userId !== userId) return null;

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status },
      include: { user: true, images: true },
    });
  }

  // === Счётчик просмотров ===
  async incrementViews(listingId: string, userId?: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');

    const alreadyViewed = userId
      ? await this.prisma.listingView.findFirst({
          where: { listingId, userId },
        })
      : null;

    if (!alreadyViewed) {
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { views: { increment: 1 } },
      });

      if (userId) {
        await this.prisma.listingView.create({
          data: { listingId, userId },
        });
      }
    }

    return { success: true };
  }

  // === Популярные объявления ===
  async getPopularListings() {
    return this.prisma.listing.findMany({
      where: { status: 'active' },
      orderBy: [
        { views: 'desc' },
        { favorites: 'desc' },
        { ordersCount: 'desc' },
      ],
      take: 24,
      include: { images: { select: { url: true } } },
    });
  }

  // === 💡 Комбинированные рекомендации (з fallback) ===
  async getRecommendations(recentIds?: string) {
    const ids = recentIds ? recentIds.split(',').filter(Boolean) : [];
    let categories: string[] = [];

    if (ids.length > 0) {
      const recent = await this.prisma.listing.findMany({
        where: { id: { in: ids }, status: 'active' },
        select: { category: true },
      });
      categories = [...new Set(recent.map((r) => r.category))];
    }

    // === Якщо немає категорій — просто повертаємо випадкові активні оголошення ===
    if (categories.length === 0) {
      const random = await this.prisma.listing.findMany({
        where: { status: 'active' },
        take: 24,
        orderBy: { createdAt: 'desc' },
        include: { images: { select: { url: true } } },
      });

      return {
        basedOnViews: [],
        popular: random.sort(() => Math.random() - 0.5),
        trendingWeek: [],
      };
    }

    const basedOnViews = await this.prisma.listing.findMany({
      where: { category: { in: categories }, status: 'active' },
      orderBy: [{ views: 'desc' }],
      take: 24,
      include: { images: { select: { url: true } } },
    });

    const popular = await this.prisma.listing.findMany({
      where: { status: 'active' },
      orderBy: [
        { views: 'desc' },
        { favorites: 'desc' },
        { ordersCount: 'desc' },
      ],
      take: 24,
      include: { images: { select: { url: true } } },
    });

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trendingWeek = await this.prisma.listing.findMany({
      where: { status: 'active', createdAt: { gte: weekAgo } },
      orderBy: [{ views: 'desc' }],
      take: 16,
      include: { images: { select: { url: true } } },
    });

    return { basedOnViews, popular, trendingWeek };
  }

  // === 🧩 Похожие объявления ===
  async getRelated(id: string) {
    const base = await this.prisma.listing.findUnique({ where: { id } });
    if (!base) return [];

    return this.prisma.listing.findMany({
      where: {
        category: base.category,
        status: 'active',
        id: { not: id },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 12,
      include: { images: { select: { url: true } } },
    });
  }

  // === ⚡ Тренды недели ===
  async getTrendingWeek() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.prisma.listing.findMany({
      where: { status: 'active', createdAt: { gte: weekAgo } },
      orderBy: [{ views: 'desc' }],
      take: 24,
      include: { images: { select: { url: true } } },
    });
  }

  // === 🌍 Explore — умная лента с пагинацией ===
  async getExploreListings(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.listing.count({
      where: { status: 'active' },
    });

    const listings = await this.prisma.listing.findMany({
      where: { status: 'active' },
      include: {
        images: true,
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const shuffled = listings.sort(() => Math.random() - 0.5);

    return {
      total,
      page,
      limit,
      listings: shuffled,
      hasMore: skip + listings.length < total,
    };
  }
}
