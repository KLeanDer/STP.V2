import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Chats() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/chat/my-chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setChats);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Мої чати</h2>
      <div className="space-y-2">
        {chats.map((chat) => {
          const lastMessage = chat.messages[0];
          const otherUser =
            chat.buyer.id === JSON.parse(localStorage.getItem("user")).id
              ? chat.seller
              : chat.buyer;

          return (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="block p-3 border rounded hover:bg-neutral-100 transition"
            >
              <div className="font-medium">{otherUser.name}</div>
              {lastMessage && (
                <div className="text-sm text-gray-500 truncate">
                  {lastMessage.text}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
