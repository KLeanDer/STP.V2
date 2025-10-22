// src/components/chat/ChatList.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useChatSocket } from "../../sockets/chat.hook";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ChatList() {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Подключаем сокет (и presence)
  const { usersStatus } = useChatSocket(null, null, {
    currentUserId: currentUser?.id,
    onChatUnreadUpdate: ({ chatId, unreadCount }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount } : chat
        )
      );
    },
  });

  // Первичная загрузка чатов
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/chat/my-chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error("Ошибка загрузки чатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Завантаження...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="text-center text-gray-500">Немає активних чатів</div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">Мої чати</h2>

      <div className="space-y-2">
        {chats.map((chat) => {
          const otherUser =
            chat.buyer.id === currentUser.id ? chat.seller : chat.buyer;

          const lastMessage = chat.messages[0];
          const isActive = location.pathname === `/chat/${chat.id}`;

          const status = usersStatus[otherUser.id];
          const isOnline = status?.online;

          return (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className={`flex items-center justify-between p-3 rounded-xl border transition ${
                isActive
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-50 hover:bg-neutral-100"
              }`}
            >
              {/* Левая часть */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={otherUser.avatarUrl || "https://i.pravatar.cc/50"}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  {/* Индикатор онлайн */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isActive ? "text-white" : "text-neutral-800"
                    }`}
                  >
                    {otherUser.name}
                  </p>
                  <p
                    className={`text-sm truncate max-w-[140px] ${
                      isActive ? "text-neutral-200" : "text-neutral-500"
                    }`}
                  >
                    {lastMessage ? lastMessage.text : "Немає повідомлень"}
                  </p>
                </div>
              </div>

              {/* Правая часть */}
              <div className="flex flex-col items-end gap-1">
                {lastMessage && (
                  <span
                    className={`text-xs ${
                      isActive ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    {new Date(lastMessage.createdAt).toLocaleTimeString(
                      "uk-UA",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </span>
                )}

                {/* 🔵 Бульбашка непрочитаных */}
                {chat.unreadCount > 0 && (
                  <span className="min-w-[20px] text-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
