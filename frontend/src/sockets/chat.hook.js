// src/sockets/chat.hook.js
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// глобальный singleton сокета
let socketSingleton = null;
export function getSocket() {
  if (!socketSingleton) {
    socketSingleton = io(SOCKET_URL, {
      transports: ["websocket"],
      path: "/socket.io",
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });
    socketSingleton.on("connect", () =>
      console.log("✅ Socket подключен:", socketSingleton.id)
    );
    socketSingleton.on("disconnect", (reason) =>
      console.log("⚠️ Socket disconnect:", reason)
    );
  }
  return socketSingleton;
}

/**
 * Хук работы с чатом (сообщения + статусы + уведомления + typing + онлайн)
 */
export const useChatSocket = (chatId, onNewMessage, opts = {}) => {
  const {
    currentUserId,
    onMessageStatus,
    onTyping,
    onUnreadCount,
    onChatUnreadUpdate,
    onUserStatus,
  } = opts;

  const [connected, setConnected] = useState(false);
  const [usersStatus, setUsersStatus] = useState({}); // { userId: { online, lastSeen? } }
  const [typingByUser, setTypingByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimers = useRef({});
  const prevChatIdRef = useRef(null);

  const socket = getSocket();

  /** Войти в личную комнату */
  const joinUser = useCallback(
    (userId) => {
      if (!userId) return;
      socket.emit("joinUser", { userId });
      socket.emit("requestUnreadCount", { userId });
    },
    [socket]
  );

  /** Войти в чат */
  const joinChat = useCallback(
    (id) => {
      if (!id) return;
      socket.emit("joinChat", { chatId: id });
    },
    [socket]
  );

  /** Выйти из чата */
  const leaveChat = useCallback(
    (id) => {
      if (!id) return;
      socket.emit("leaveChat", { chatId: id });
    },
    [socket]
  );

  /** Отправить сообщение */
  const sendMessage = useCallback(
    ({ chatId: cId, receiverId, text }) => {
      if (!cId || !currentUserId || !text?.trim()) return;
      socket.emit("sendMessage", {
        chatId: cId,
        senderId: currentUserId,
        receiverId,
        text: text.trim(),
      });
      // сразу убираем typing у себя
      socket.emit("typing", {
        chatId: cId,
        userId: currentUserId,
        isTyping: false,
      });
    },
    [socket, currentUserId]
  );

  /** Пометить чат прочитанным */
  const markAsRead = useCallback(
    (cId) => {
      if (!cId || !currentUserId) return;
      socket.emit("markAsRead", { chatId: cId, userId: currentUserId });
    },
    [socket, currentUserId]
  );

  /** Установить typing статус */
  const setTyping = useCallback(
    (isTyping) => {
      if (!chatId || !currentUserId) return;
      socket.emit("typing", {
        chatId,
        userId: currentUserId,
        isTyping,
      });
    },
    [socket, chatId, currentUserId]
  );

  /** ----- Основной useEffect ----- */
  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleNewMessage = (msg) => onNewMessage?.(msg);

    const handleMsgStatus = (data) => onMessageStatus?.(data);

    const handleTyping = (data) => {
      const { userId, isTyping } = data;
      if (!userId) return;

      setTypingByUser((prev) => ({
        ...prev,
        [userId]: !!isTyping,
      }));
      onTyping?.(data);

      if (typingTimers.current[userId]) {
        clearTimeout(typingTimers.current[userId]);
      }
      if (isTyping) {
        typingTimers.current[userId] = setTimeout(() => {
          setTypingByUser((prev) => {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
          });
        }, 1000);
      }
    };

    const handleUnread = (count) => {
      setUnreadCount(count);
      onUnreadCount?.(count);
    };

    const handleChatUnread = ({ chatId, unreadCount }) =>
      onChatUnreadUpdate?.({ chatId, unreadCount });

    // presence
    const handlePresenceSeed = ({ onlineUserIds }) => {
      setUsersStatus((prev) => {
        const copy = { ...prev };
        onlineUserIds.forEach((id) => {
          copy[id] = { online: true };
        });
        return copy;
      });
    };

    const handleUserOnline = ({ userId }) => {
      setUsersStatus((prev) => ({
        ...prev,
        [userId]: { online: true },
      }));
      onUserStatus?.({ userId, online: true });
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      setUsersStatus((prev) => ({
        ...prev,
        [userId]: { online: false, lastSeen },
      }));
      onUserStatus?.({ userId, online: false, lastSeen });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("messageStatusUpdated", handleMsgStatus);
    socket.on("typing", handleTyping);
    socket.on("unreadCountUpdated", handleUnread);
    socket.on("chatUnreadUpdated", handleChatUnread);
    socket.on("presence:seed", handlePresenceSeed);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    if (currentUserId) joinUser(currentUserId);
    if (chatId) {
      const prev = prevChatIdRef.current;
      if (prev && prev !== chatId) leaveChat(prev);
      joinChat(chatId);
      prevChatIdRef.current = chatId;
    }

    return () => {
      if (chatId) leaveChat(chatId);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageStatusUpdated", handleMsgStatus);
      socket.off("typing", handleTyping);
      socket.off("unreadCountUpdated", handleUnread);
      socket.off("chatUnreadUpdated", handleChatUnread);
      socket.off("presence:seed", handlePresenceSeed);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chatId, currentUserId]);

  return useMemo(
    () => ({
      socketConnected: connected,
      usersStatus, // 👈 online/offline + lastSeen
      typingByUser,
      unreadCount,
      joinUser,
      joinChat,
      leaveChat,
      sendMessage,
      setTyping,
      markAsRead,
    }),
    [
      connected,
      usersStatus,
      typingByUser,
      unreadCount,
      joinUser,
      joinChat,
      leaveChat,
      sendMessage,
      setTyping,
      markAsRead,
    ]
  );
};
