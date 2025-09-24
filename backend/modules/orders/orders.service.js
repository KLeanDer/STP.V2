import prisma from "../../core/db.js";

// Создать заказ
export async function createOrder({ buyerId, listingId, city, postOffice }) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return null;

  return prisma.order.create({
    data: {
      buyerId,
      sellerId: listing.userId,
      listingId,
      city,
      postOffice,
      status: "pending",
    },
    include: {
      buyer: { select: { id: true, name: true, avatarUrl: true } },
      seller: { select: { id: true, name: true, avatarUrl: true } },
      listing: { select: { id: true, title: true, price: true } },
    },
  });
}

// Получить заказы для покупателя
export async function getOrdersByBuyer(buyerId) {
  return prisma.order.findMany({
    where: { buyerId },
    include: {
      listing: { include: { images: true } },
      seller: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Получить заказы для продавца
export async function getOrdersBySeller(sellerId) {
  return prisma.order.findMany({
    where: { sellerId },
    include: {
      listing: { include: { images: true } },
      buyer: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Обновить статус заказа
export async function updateOrderStatus(orderId, userId, status) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  // Разрешаем менять только продавцу
  if (order.sellerId !== userId) return null;

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      listing: { select: { id: true, title: true } },
    },
  });
}
