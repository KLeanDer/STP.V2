import express from "express";
import * as usersController from "./users.controller.js";
import { authMiddleware } from "../../core/security.js"; // 👈 правильный импорт

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser);

// ✅ новый роут (редактирование профиля, только авторизованный пользователь)
router.put("/me", authMiddleware, usersController.updateProfile);

export default router;
