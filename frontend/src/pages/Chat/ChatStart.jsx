import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../api/api";

export default function ChatStart() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const sellerId = search.get("sellerId");
    const listingId = search.get("listingId");
    const token = localStorage.getItem("token");

    if (!sellerId || !listingId) {
      setError("Не переданы sellerId или listingId");
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch("/chat/create", {
          method: "POST",
          body: JSON.stringify({ sellerId, listingId }),
        });

        if (!data?.id) throw new Error("Сервер не вернул chat.id");

        navigate(`/chat/${data.id}`, { replace: true });
      } catch (e) {
        console.error("❌ Ошибка создания чата:", e);
        setError(e.message || "Не удалось создать чат");
      }
    })();
  }, [search, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Создание чата...
    </div>
  );
}
