import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto, ListingAttributeValueDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  private readonly listingInclude = {
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
    category: true,
    subcategory: true,
    attributes: {
      include: {
        attribute: true,
      },
    },
  } as const;

  private async validateCategoryAndAttributes(
    categoryId: string,
    subcategoryId?: string | null,
    attributes?: ListingAttributeValueDto[],
  ) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let subcategory: { id: string; categoryId: string; attributes: { attributeDefinitionId: string }[] } | null = null;

    if (subcategoryId) {
      const fetchedSubcategory = await this.prisma.subcategory.findUnique({
        where: { id: subcategoryId },
        include: { attributes: { select: { attributeDefinitionId: true } } },
      });

      if (!fetchedSubcategory) {
        throw new NotFoundException('Subcategory not found');
      }

      if (fetchedSubcategory.categoryId !== categoryId) {
        throw new BadRequestException('Subcategory does not belong to selected category');
      }

      subcategory = fetchedSubcategory;
    } else if (attributes?.length) {
      throw new BadRequestException('Subcategory must be provided when attributes are specified');
    }

    if (attributes?.length && subcategory) {
      const attributeIds = attributes.map((attr) => attr.attributeDefinitionId);
      const uniqueAttributeIds = Array.from(new Set(attributeIds));

      if (uniqueAttributeIds.length !== attributeIds.length) {
        throw new BadRequestException('Duplicate attribute definitions provided');
      }

      const allowedAttributeIds = new Set(
        subcategory.attributes.map((relation) => relation.attributeDefinitionId),
      );

      const invalidAttributes = uniqueAttributeIds.filter((id) => !allowedAttributeIds.has(id));
      if (invalidAttributes.length > 0) {
        throw new BadRequestException('Attributes are not available for the selected subcategory');
      }
    }

    return { category, subcategory };
  }

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
      include: this.listingInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // === Конкретное объявление ===
  async getListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: this.listingInclude,
    });

    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  // === Создать объявление ===
  async createListing(userId: string, dto: CreateListingDto) {
    const { categoryId, subcategoryId, attributes, images, price, ...rest } = dto;

    await this.validateCategoryAndAttributes(categoryId, subcategoryId, attributes);

    return this.prisma.listing.create({
      data: {
        ...rest,
        price: Number(price),
        userId,
        status: 'active',
        views: 0,
        categoryId,
        subcategoryId: subcategoryId ?? undefined,
        images: {
          create: Array.isArray(images)
            ? images
                .filter((url) => url && url.trim() !== '')
                .map((url) => ({ url }))
            : [],
        },
        attributes: attributes?.length
          ? {
              create: attributes.map((attr) => ({
                attributeDefinitionId: attr.attributeDefinitionId,
                value: attr.value,
              })),
            }
          : undefined,
      },
      include: this.listingInclude,
    });
  }

  // === Обновить объявление ===
  async updateListing(listingId: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.userId !== userId) return null;

    const categoryId = dto.categoryId ?? listing.categoryId;
    const subcategoryId =
      dto.subcategoryId !== undefined ? dto.subcategoryId : listing.subcategoryId;

    await this.validateCategoryAndAttributes(categoryId, subcategoryId, dto.attributes);

    const data: any = {
      categoryId,
      subcategoryId: subcategoryId ?? null,
    };

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = Number(dto.price);
    if (dto.contactName !== undefined) data.contactName = dto.contactName;
    if (dto.contactPhone !== undefined) data.contactPhone = dto.contactPhone;

    if (dto.images !== undefined) {
      data.images = {
        deleteMany: {},
        create: dto.images
          .filter((url) => url && url.trim() !== '')
          .map((url) => ({ url })),
      };
    }

    if (dto.attributes !== undefined) {
      data.attributes = {
        deleteMany: {},
        create: dto.attributes.map((attr) => ({
          attributeDefinitionId: attr.attributeDefinitionId,
          value: attr.value,
        })),
      };
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data,
      include: this.listingInclude,
    });
  }

  // === Изменить статус ===
  async updateStatus(listingId: string, userId: string, status: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.userId !== userId) return null;

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status },
      include: this.listingInclude,
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
    let subcategoryIds: string[] = [];
    let categoryIds: string[] = [];

    if (ids.length > 0) {
      const recent = await this.prisma.listing.findMany({
        where: { id: { in: ids }, status: 'active' },
        select: { subcategoryId: true, categoryId: true },
      });
      subcategoryIds = [
        ...new Set(recent.map((r) => r.subcategoryId).filter((id): id is string => Boolean(id))),
      ];
      categoryIds = [...new Set(recent.map((r) => r.categoryId).filter(Boolean))];
    }

    // === Якщо немає категорій — просто повертаємо випадкові активні оголошення ===
    if (subcategoryIds.length === 0 && categoryIds.length === 0) {
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
      where: {
        status: 'active',
        ...(subcategoryIds.length
          ? { subcategoryId: { in: subcategoryIds } }
          : { categoryId: { in: categoryIds } }),
      },
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
    const base = await this.prisma.listing.findUnique({
      where: { id },
      select: { subcategoryId: true, categoryId: true },
    });
    if (!base) return [];

    return this.prisma.listing.findMany({
      where: {
        status: 'active',
        id: { not: id },
        ...(base.subcategoryId ? { subcategoryId: base.subcategoryId } : { categoryId: base.categoryId }),
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 12,
      include: { images: { select: { url: true } }, category: true, subcategory: true },
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
        category: true,
        subcategory: true,
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

  // === 🌳 Дерево категорий ===
  async getCategoryTree() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        subcategories: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  // === 📋 Атрибуты подкатегории ===
  async getAttributesBySubcategory(subcategoryId: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        attributes: {
          orderBy: { order: 'asc' },
          include: {
            attribute: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory.attributes.map(({ attribute, order }) => ({
      id: attribute.id,
      name: attribute.name,
      key: attribute.key,
      type: attribute.type,
      metadata: attribute.metadata,
      order,
    }));
  }
}