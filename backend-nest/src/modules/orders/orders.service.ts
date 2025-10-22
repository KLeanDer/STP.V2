import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(buyerId: string, dto: CreateOrderDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId } });
    if (!listing) return null;

    return this.prisma.order.create({
      data: {
        buyerId,
        sellerId: listing.userId,
        listingId: dto.listingId,
        city: dto.city,
        postOffice: dto.postOffice,
        comment: dto.comment ?? null,
        status: 'pending',
      },
      include: {
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        listing: { select: { id: true, title: true, price: true } },
      },
    });
  }

  async getOrdersByBuyer(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        listing: { include: { images: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrdersBySeller(sellerId: string) {
    return this.prisma.order.findMany({
      where: { sellerId },
      include: {
        listing: { include: { images: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, userId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;

    if (order.sellerId !== userId) return null;

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true } },
      },
    });
  }
}
