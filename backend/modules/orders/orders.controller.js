import * as ordersService from "./orders.service.js";

// Создать заказ
export async function createOrder(req, res, next) {
  try {
    const { listingId, city, postOffice } = req.body;
    const buyerId = req.userId;

    if (!listingId || !city || !postOffice) {
      return res.status(400).json({ error: "listingId, city, postOffice required" });
    }

    const order = await ordersService.createOrder({ buyerId, listingId, city, postOffice });
    if (!order) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// Получить заказы покупателя
export async function getBuyerOrders(req, res, next) {
  try {
    const buyerId = req.userId;
    const orders = await ordersService.getOrdersByBuyer(buyerId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// Получить заказы продавца
export async function getSellerOrders(req, res, next) {
  try {
    const sellerId = req.userId;
    const orders = await ordersService.getOrdersBySeller(sellerId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// Обновить статус
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    if (!["pending", "confirmed", "shipped", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await ordersService.updateOrderStatus(id, userId, status);
    if (!updated) {
      return res.status(404).json({ error: "Order not found or forbidden" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
