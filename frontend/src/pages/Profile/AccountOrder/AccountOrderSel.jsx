import { useEffect, useState } from "react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileListings from "../../../components/profile/ProfileListings";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AccountOrderSel() {
  const [user, setUser] = useState(null);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!token || !u) return;

    const parsed = JSON.parse(u);
    setUser(parsed);

    fetch(`${API_BASE}/api/orders/seller`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSales(Array.isArray(data) ? data : []));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          🔑 Увійдіть, щоб переглянути продажі
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <ProfileHeader user={user} />

      <h1 className="text-2xl font-bold text-green-700 border-b pb-2">
        💰 Мої продажі
      </h1>

      {sales.length > 0 ? (
        <ProfileListings listings={sales} />
      ) : (
        <p className="text-gray-500 text-center">У вас ще немає продажів</p>
      )}
    </div>
  );
}
