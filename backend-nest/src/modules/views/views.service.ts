import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ViewsService {
  constructor(private prisma: PrismaService) {}

  async addView(userId: string | null, listingId: string) {
    await this.prisma.listingView.create({
      data: { userId, listingId },
    });
  }

  async getUserViews(userId: string) {
    const views = await this.prisma.listingView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      distinct: ['listingId'],
      take: 20,
    });

    const listingIds = views.map((v) => v.listingId);
    const listings = await this.prisma.listing.findMany({
      where: { id: { in: listingIds } },
      include: { images: true },
    });

    // упорядочим как в истории
    const pos = new Map(listingIds.map((id, i) => [id, i]));
    return listings.sort(
      (a, b) => (pos.get(a.id) ?? 9999) - (pos.get(b.id) ?? 9999),
    );
  }
}
