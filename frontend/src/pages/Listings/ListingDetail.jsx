import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // грузим юзера из localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // грузим объявление
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("❌ Failed to load listing:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // переключение статуса active <-> inactive
  const toggleStatus = async () => {
    const action = listing.status === "active" ? "деактивувати" : "активувати";

    if (!window.confirm(`Ви впевнені, що хочете ${action} це оголошення?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Необхідно увійти");

      const res = await fetch(`${API_BASE}/api/listings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: listing.status === "active" ? "inactive" : "active",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setListing(data);
        alert(
          data.status === "inactive"
            ? "✅ Оголошення перенесено в неактивні. Воно більше не показується на майданчику."
            : "✅ Оголошення знову активне і відображається на майданчику."
        );
      } else {
        alert(data.error || "Помилка");
      }
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        ⏳ Завантаження...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">
        ❌ Оголошення не знайдено
      </div>
    );
  }

  const img = listing.images?.[0]?.url || "https://placehold.co/800x500";
  const isOwner = user && listing.user && user.id === listing.user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Фото */}
      <div className="rounded-lg overflow-hidden border shadow">
        <img
          src={img}
          alt={listing.title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Заголовок + цена */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        <span className="text-2xl font-extrabold text-blue-600">
          {new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
          }).format(listing.price)}
        </span>
      </div>

      {/* Описание */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📄 Опис</h2>
        <p className="text-gray-700">{listing.description}</p>
      </div>

      {/* Продавец + действия */}
      {listing.user && (
        <div className="border-t pt-4 space-y-3">
          <h2 className="text-lg font-semibold">👤 Продавець</h2>
          <div className="flex items-center gap-3">
            <img
              src={listing.user.avatarUrl || "https://i.pravatar.cc/60"}
              alt={listing.user.name}
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <p className="font-medium">{listing.user.name}</p>
              <Link
                to={`/profile/${listing.user.id}`}
                className="text-blue-600 text-sm hover:underline"
              >
                Переглянути профіль
              </Link>
            </div>
          </div>

          {/* Действия */}
          {isOwner ? (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/listings/${listing.id}/edit`)}
                className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition"
              >
                ✏️ Редагувати
              </button>

              <button
                onClick={toggleStatus}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
              >
                {listing.status === "active"
                  ? "🔴 Деактивувати"
                  : "🟢 Активувати"}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/chat?to=${listing.user.id}`)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 transition"
              >
                💬 Написати продавцю
              </button>

              <button
                onClick={() => navigate(`/listings/${listing.id}/order`)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-500 transition"
              >
                🛒 Замовити
              </button>
            </div>
          )}
        </div>
      )}

      {/* Дата */}
      <p className="text-xs text-gray-400">
        Опубліковано:{" "}
        {new Date(listing.createdAt).toLocaleDateString("uk-UA")}
      </p>
    </div>
  );
}
