// src/pages/Chat/Chat.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatHeader from "../../components/chat/ChatHeader";
import { useChatSocket } from "../../sockets/chat.hook";
import { apiFetch } from "../../api/api";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (_) {
      return null;
    }
  })();

  // если не авторизован → редирект
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // сброс при смене чата
  useEffect(() => {
    setMessages([]);
    setReceiverId(null);
    setChat(null);
  }, [chatId]);

  // загрузка инфы о чате
  useEffect(() => {
    if (!chatId) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    (async () => {
      try {
        const data = await apiFetch(`/chat/${chatId}`);
        if (!data) return;

        setChat(data);
        setMessages(Array.isArray(data?.messages) ? data.messages : []);

        if (data?.buyerId && data?.sellerId && currentUser?.id) {
          setReceiverId(
            data.buyerId === currentUser.id ? data.sellerId : data.buyerId
          );
        }
      } catch (err) {
        console.error("Ошибка загрузки чата:", err);
        navigate("/chat");
      }
    })();
  }, [chatId, navigate, currentUser?.id]);

  // сокет
  const { sendMessage, setTyping, usersStatus, typingByUser, markAsRead } =
    useChatSocket(
      chatId,
      (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      },
      { currentUserId: currentUser?.id }
    );

  // кто собеседник?
  const peerUser =
    chat && currentUser?.id
      ? chat.buyerId === currentUser.id
        ? chat.seller
        : chat.buyer
      : null;

  const peerStatus = peerUser ? usersStatus[peerUser.id] : undefined;

  // помечаем непрочитанные сообщения как прочитанные
  useEffect(() => {
    if (!chatId || !messages.length || !currentUser?.id) return;
    if (typeof markAsRead !== "function") return; // ✅ защита

    markAsRead(chatId); // 👈 теперь помечаем весь чат сразу
  }, [messages, chatId, currentUser?.id, markAsRead]);

  // отправка сообщения
  const handleSend = (text) => {
    if (!text?.trim()) return;
    if (!currentUser?.id) return navigate("/login");
    if (!receiverId) return console.error("❌ Нет receiverId");

    sendMessage({
      chatId,
      senderId: currentUser.id,
      receiverId,
      text: text.trim(),
    });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <ChatHeader
        peerUser={peerUser}
        listing={chat?.listing}
        status={peerStatus}
        typing={typingByUser}
        onBack={() => navigate("/chat")}
      />
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        onTyping={(is) => setTyping(is)}
        typingUsers={typingByUser}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
