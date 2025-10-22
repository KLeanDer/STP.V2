// src/sockets/notifications.hook.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Хук для работы с уведомлениями через WebSocket
 * @param {string} userId - текущий пользователь
 * @param {Function} onNotification - коллбэк для новых уведомлений
 */
export const useNotificationsSocket = (userId, onNotification) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // создаём подключение
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      path: "/socket.io",
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // когда соединение установлено → присоединяемся к комнате userId
    socket.on("connect", () => {
      console.log(`🔔 Socket подключен для уведомлений: ${socket.id}`);
      socket.emit("joinRoom", { roomId: userId }); // 👈 предполагаем join по userId
    });

    // слушаем уведомления
    socket.on("notification", (notification) => {
      console.log("📩 Новое уведомление:", notification);
      if (onNotification) {
        onNotification(notification);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket отключен (уведомления)");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onNotification]);

  return socketRef.current;
};
