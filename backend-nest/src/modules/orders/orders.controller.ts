import { Controller, Post, Get, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const buyerId = req.user.userId;
    const order = await this.ordersService.createOrder(buyerId, dto);
    if (!order) {
      return { error: 'Listing not found' };
    }
    return order;
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer')
  async getBuyerOrders(@Req() req: any) {
    return this.ordersService.getOrdersByBuyer(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('seller')
  async getSellerOrders(@Req() req: any) {
    return this.ordersService.getOrdersBySeller(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Req() req: any, @Body('status') status: string) {
    if (!['pending', 'confirmed', 'shipped', 'completed', 'cancelled'].includes(status)) {
      return { error: 'Invalid status' };
    }
    const updated = await this.ordersService.updateOrderStatus(id, req.user.userId, status);
    if (!updated) {
      return { error: 'Order not found or forbidden' };
    }
    return updated;
  }
}
