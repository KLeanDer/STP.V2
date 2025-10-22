import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private client = new MeiliSearch({
    host: process.env.MEILI_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILI_API_KEY || 'stpsearchkey',
  });

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    let index;
    try {
      index = await this.client.getIndex('listings');
    } catch {
      index = await this.client.createIndex('listings', { primaryKey: 'id' });
    }

    await index.updateSettings({
      searchableAttributes: ['title', 'description', 'category', 'city'],
      filterableAttributes: ['category', 'price', 'city'],
      sortableAttributes: ['price', 'createdAt'],
      typoTolerance: { enabled: true },
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'exactness',
        'desc(createdAt)',
      ],
    });
  }

  /** 🔹 Добавление всех объявлений в индекс */
  async reindexAll() {
    const listings = await this.prisma.listing.findMany();
    const index = await this.client.getIndex('listings');
    await index.addDocuments(listings);
  }

  /** 🔹 Поиск по запросу */
  async search(q: string, filters?: Record<string, string>) {
    const index = await this.client.getIndex('listings');
    const filterQuery: string[] = [];

    if (filters?.category) filterQuery.push(`category = "${filters.category}"`);
    if (filters?.city) filterQuery.push(`city = "${filters.city}"`);
    if (filters?.priceMin && filters?.priceMax)
      filterQuery.push(
        `price >= ${filters.priceMin} AND price <= ${filters.priceMax}`
      );

    const { hits } = await index.search(q || '', {
      filter: filterQuery.length ? filterQuery : undefined,
      limit: 30,
    });

    return hits;
  }
}
