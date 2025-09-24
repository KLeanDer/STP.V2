import express from "express";
import * as ordersController from "./orders.controller.js";
import { authMiddleware } from "../../core/security.js";

const router = express.Router();

// Создать заказ
router.post("/", authMiddleware, ordersController.createOrder);

// Заказы покупателя
router.get("/buyer", authMiddleware, ordersController.getBuyerOrders);

// Заказы продавца
router.get("/seller", authMiddleware, ordersController.getSellerOrders);

// Обновить статус (только продавец)
router.put("/:id/status", authMiddleware, ordersController.updateOrderStatus);

export default router;
