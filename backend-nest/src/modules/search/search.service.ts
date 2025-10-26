import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { MeiliSearch } from 'meilisearch';
import { PrismaService } from '../../prisma/prisma.service';

interface SearchOptions {
  filters?: Record<string, unknown>;
  sort?: string[];
  limit?: number;
  offset?: number;
}

type ListingWithUser = Prisma.ListingGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        avatarUrl: true;
        phone: true;
      };
    };
  };
}>;

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly filterableAttributes = [
    'category',
    'city',
    'price',
    'mileage',
    'area',
    'condition',
    'isOriginal',
    'isVerified',
    'deliveryAvailable',
    'isPromoted',
    'status',
    'userId',
  ];

  private readonly sortableAttributes = [
    'price',
    'createdAt',
    'views',
    'favorites',
  ];

  private readonly client = new MeiliSearch({
    host: process.env.MEILI_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILI_API_KEY || 'stpsearchkey',
  });

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const index = this.client.index<Record<string, unknown>>('listings');

    try {
      await index.getRawInfo();
    } catch {
      await this.client.createIndex('listings', {
        primaryKey: 'id',
      });
    }

    await index.updateSettings({
      searchableAttributes: ['title', 'description', 'category', 'city'],
      filterableAttributes: this.filterableAttributes,
      sortableAttributes: this.sortableAttributes,
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
    const listings = await this.prisma.listing.findMany({
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
      },
    });
    const index = this.client.index<Record<string, unknown>>('listings');
    const documents = listings.map((listing) => this.serializeListing(listing));
    await index.addDocuments(documents);
  }

  /** 🔹 Поиск по запросу */
  async search(q: string, options: SearchOptions = {}) {
    const index = this.client.index<Record<string, unknown>>('listings');
    const filterQuery = this.buildFilterQuery(options.filters ?? {});

    const sort = (options.sort ?? []).filter((rule) => {
      if (typeof rule !== 'string') return false;
      const [field] = rule.split(':');
      return this.sortableAttributes.includes(field);
    });

    const searchResponse = await index.search(q || '', {
      filter: filterQuery.length ? filterQuery : undefined,
      sort: sort.length ? sort : undefined,
      limit: options.limit ?? 30,
      offset: options.offset ?? 0,
      facets: this.filterableAttributes,
    });

    const facets: Record<
      string,
      Record<string, number>
    > = searchResponse.facetDistribution ?? {};

    const totalHits =
      'totalHits' in searchResponse &&
      typeof searchResponse.totalHits === 'number'
        ? searchResponse.totalHits
        : (searchResponse.estimatedTotalHits ?? 0);

    return {
      hits: searchResponse.hits,
      total: totalHits,
      facets,
      processingTimeMs: searchResponse.processingTimeMs,
      limit: searchResponse.limit,
      offset: searchResponse.offset,
      query: searchResponse.query,
    };
  }

  private buildFilterQuery(filters: Record<string, unknown>) {
    if (!filters || typeof filters !== 'object') {
      return [];
    }

    const filterQuery: (string | string[])[] = [];

    Object.entries(filters ?? {}).forEach(([attribute, rawValue]) => {
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        return;
      }

      if (Array.isArray(rawValue)) {
        const orConditions = rawValue
          .map((value) => this.formatFilter(attribute, value))
          .filter((value): value is string => Boolean(value));

        if (orConditions.length === 1) {
          filterQuery.push(orConditions[0]);
        } else if (orConditions.length > 1) {
          filterQuery.push(orConditions);
        }
        return;
      }

      if (this.isRangeFilter(rawValue)) {
        const minNumber = this.toNumber(rawValue.min);
        const maxNumber = this.toNumber(rawValue.max);

        if (minNumber !== undefined) {
          filterQuery.push(`${attribute} >= ${minNumber}`);
        }
        if (maxNumber !== undefined) {
          filterQuery.push(`${attribute} <= ${maxNumber}`);
        }
        return;
      }

      const condition = this.formatFilter(attribute, rawValue);
      if (condition) {
        filterQuery.push(condition);
      }
    });

    return filterQuery;
  }

  private isRangeFilter(
    value: unknown,
  ): value is { min?: unknown; max?: unknown } {
    return (
      typeof value === 'object' &&
      value !== null &&
      ('min' in value || 'max' in value)
    );
  }

  private formatFilter(attribute: string, value: unknown): string | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (typeof value === 'boolean') {
      return `${attribute} = ${value}`;
    }

    if (typeof value === 'number') {
      return `${attribute} = ${value}`;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;

      if (trimmed.toLowerCase() === 'true') {
        return `${attribute} = true`;
      }
      if (trimmed.toLowerCase() === 'false') {
        return `${attribute} = false`;
      }

      const maybeNumber = Number(trimmed);
      if (!Number.isNaN(maybeNumber)) {
        return `${attribute} = ${maybeNumber}`;
      }

      const sanitizedValue = trimmed.replace(/"/g, '\\"');
      return `${attribute} = "${sanitizedValue}"`;
    }

    return null;
  }

  private toNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private serializeListing(listing: ListingWithUser) {
    const { user, createdAt, updatedAt, ...rest } = listing;

    return {
      ...rest,
      createdAt:
        createdAt instanceof Date ? createdAt.toISOString() : createdAt,
      updatedAt:
        updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
      userId: user?.id ?? listing.userId,
      userName: user?.name ?? null,
      userEmail: user?.email ?? null,
      userAvatarUrl: user?.avatarUrl ?? null,
      userPhone: user?.phone ?? null,
    };
  }
}