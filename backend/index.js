import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";

// Загружаем переменные окружения
dotenv.config();

// Создаём HTTP-сервер на базе Express
const server = http.createServer(app);

// Настраиваем Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // на проде лучше ограничить доменом фронта
    methods: ["GET", "POST"],
  },
});

// Подключение сокетов
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Запуск сервера
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
