// core/security.js
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import jwt from "jsonwebtoken";

export const securityMiddlewares = [
  helmet(),
  cors(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

// 👇 Добавляем authMiddleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // 👈 кладём id пользователя в req
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
