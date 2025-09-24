import express from "express";
import dotenv from "dotenv";
import { securityMiddlewares } from "./core/security.js";
import { errorHandler } from "./core/errorHandler.js";

// роуты модулей
import usersRoutes from "./modules/users/users.routes.js";
import listingsRoutes from "./modules/listings/listings.routes.js";
import messagesRoutes from "./modules/chat/chat.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js"; // ✅ новые заказы

dotenv.config();
const app = express();

// парсим JSON
app.use(express.json());

// базовая безопасность (helmet, cors, rateLimiter и т.д.)
app.use(...securityMiddlewares);

// тестовый эндпоинт
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// модули API
app.use("/api/users", usersRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes); // ✅

/**
 * Обработка ошибок (всегда в самом конце)
 */
app.use(errorHandler);

export default app;
