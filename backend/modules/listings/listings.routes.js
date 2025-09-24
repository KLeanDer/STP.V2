import express from "express";
import * as listingsController from "./listings.controller.js";
import { authMiddleware } from "../../core/security.js";

const router = express.Router();

// 📌 Получить все объявления (поддерживает ?userId=...&status=...)
router.get("/", listingsController.getAllListings);

// 📌 Получить объявление по ID
router.get("/:id", listingsController.getListingById);

// 📌 Создать объявление (только авторизованный пользователь)
router.post("/", authMiddleware, listingsController.createListing);

// 📌 Обновить объявление полностью (только владелец)
router.put("/:id", authMiddleware, listingsController.updateListing);

// 📌 Обновить статус (active <-> inactive, только владелец)
router.put("/:id/status", authMiddleware, listingsController.updateStatus);

export default router;
