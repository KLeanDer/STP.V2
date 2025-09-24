import express from "express";
import * as ordersController from "./orders.controller.js";
import { authMiddleware } from "../../core/security.js";

const router = express.Router();

// ������� �����
router.post("/", authMiddleware, ordersController.createOrder);

// ������ ����������
router.get("/buyer", authMiddleware, ordersController.getBuyerOrders);

// ������ ��������
router.get("/seller", authMiddleware, ordersController.getSellerOrders);

// �������� ������ (������ ��������)
router.put("/:id/status", authMiddleware, ordersController.updateOrderStatus);

export default router;
