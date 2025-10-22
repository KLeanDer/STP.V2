import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { Listing } from '@prisma/client';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);
  constructor(private prisma: PrismaService) {}

  /**
   * Добавление просмотра
   * - Создаёт запись в ListingView
   * - Для авторизованного держит только 15 последних
   * - Повторный просмотр поднимает вверх
   * - Сразу возвращает обновлённые "recently"
   */
  async addView(userId: string | null, listingId: string) {
    await this.prisma.listingView.create({
      data: { userId, listingId },
    });

    if (userId) {
      const views = await this.prisma.listingView.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      // оставляем только 15 последних
      if (views.length > 15) {
        const toDelete = views.slice(15).map((v) => v.id);
        await this.prisma.listingView.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // 🔹 сразу возвращаем обновлённые recent
      const recent = await this.getRecentlyViewed(userId);
      return { success: true, recent };
    }

    return { success: true };
  }

  /**
   * Недавно просмотренные (макс. 15, без дублей)
   */
  async getRecentlyViewed(userId: string) {
    const raw = await this.prisma.listingView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        listing: { include: { images: true } },
      },
    });

    const seen = new Set<string>();
    const uniqueOrdered: Listing[] = [];

    for (const v of raw) {
      if (v.listing && !seen.has(v.listingId)) {
        seen.add(v.listingId);
        uniqueOrdered.push(v.listing);
      }
      if (uniqueOrdered.length >= 15) break;
    }

    return uniqueOrdered;
  }

  /**
   * Умные рекомендации "как Avito"
   * — по категориям пользователя и популярности.
   */
  async getSmartRecommendations(userId: string | null) {
    let topCategories: string[] = [];

    if (userId) {
      const recentViews = await this.prisma.listingView.findMany({
        where: { userId },
        include: {
          listing: { select: { category: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const freq: Record<string, number> = {};
      for (const v of recentViews) {
        const c = v.listing?.category?.toLowerCase?.();
        if (c) freq[c] = (freq[c] ?? 0) + 1;
      }

      topCategories = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([c]) => c);
    }

    if (!topCategories.length) {
      const popular = await this.prisma.listing.findMany({
        where: { status: 'active' },
        include: { images: true },
        orderBy: [
          { views: 'desc' },
          { favorites: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 20,
      });
      return popular;
    }

    const categoryListings = await this.prisma.listing.findMany({
      where: { status: 'active', category: { in: topCategories } },
      include: { images: true },
      orderBy: [
        { views: 'desc' },
        { favorites: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 40,
    });

    const randomListings = await this.prisma.listing.findMany({
      where: { status: 'active' },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
      skip: Math.floor(Math.random() * 30),
      take: 20,
    });

    const combined = [...categoryListings, ...randomListings];
    const unique = combined.filter(
      (l, i, arr) => arr.findIndex((x) => x.id === l.id) === i,
    );

    const sorted = unique.sort((a, b) => {
      const aCat = topCategories.includes(a.category.toLowerCase()) ? 1 : 0;
      const bCat = topCategories.includes(b.category.toLowerCase()) ? 1 : 0;
      if (aCat !== bCat) return bCat - aCat;
      return b.views - a.views;
    });

    return sorted.slice(0, 20);
  }

  /** Уборка истории просмотров */
  @Cron('0 2 * * *', { timeZone: 'Europe/Kiev' })
  async cleanOldViews() {
    const users = await this.prisma.user.findMany({ select: { id: true } });

    for (const u of users) {
      const views = await this.prisma.listingView.findMany({
        where: { userId: u.id },
        orderBy: { createdAt: 'desc' },
      });

      if (views.length > 15) {
        const toDelete = views.slice(15).map((v) => v.id);
        await this.prisma.listingView.deleteMany({
          where: { id: { in: toDelete } },
        });
      }
    }

    this.logger.log('🕑 Cleaned old listing views (kept last 15 per user)');
  }
}
