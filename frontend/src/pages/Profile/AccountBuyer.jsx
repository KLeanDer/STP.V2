import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileListings from "../../components/profile/ProfileListings";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AccountBuyer() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!token || !u) return;

    const parsed = JSON.parse(u);
    setUser(parsed);

    // Все объявления пользователя
    fetch(`${API_BASE}/api/listings?userId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          🔑 Увійдіть, щоб переглянути свій профіль
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Заголовок + кнопка редактировать */}
      <div className="flex justify-between items-center">
        <ProfileHeader user={user} />
        <Link
          to="/profile/edit"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        >
          ✏️ Редагувати профіль
        </Link>
      </div>

      <ProfileInfo user={user} isOwnProfile />

      {/* Кнопки на заказы */}
      <div className="flex gap-4">
        <Link
          to="/profile/orders/buyer"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm shadow hover:bg-blue-500 transition"
        >
          🛒 Мої покупки
        </Link>
        <Link
          to="/profile/orders/seller"
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm shadow hover:bg-green-500 transition"
        >
          💰 Мої продажі
        </Link>
      </div>

      {/* Объявления */}
      <div className="space-y-10">
        <ProfileListings
          title="✅ Активні оголошення"
          listings={listings.filter((l) => l.status === "active")}
        />
        <ProfileListings
          title="🕑 Неактивні оголошення"
          listings={listings.filter((l) => l.status === "inactive")}
        />
      </div>
    </div>
  );
}
