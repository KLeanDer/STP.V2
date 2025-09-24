import { useEffect, useState } from "react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileListings from "../../../components/profile/ProfileListings";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AccountOrderBy() {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!token || !u) return;

    const parsed = JSON.parse(u);
    setUser(parsed);

    fetch(`${API_BASE}/api/orders/buyer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPurchases(Array.isArray(data) ? data : []));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          🔑 Увійдіть, щоб переглянути покупки
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <ProfileHeader user={user} />

      <h1 className="text-2xl font-bold text-blue-700 border-b pb-2">
        🛒 Мої покупки
      </h1>

      {purchases.length > 0 ? (
        <ProfileListings listings={purchases} />
      ) : (
        <p className="text-gray-500 text-center">У вас ще немає покупок</p>
      )}
    </div>
  );
}
