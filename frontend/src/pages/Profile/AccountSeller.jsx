import { useEffect, useState } from "react";
import AccountLayout from "./AccountLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AccountSeller() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!token || !u) return;

    const parsed = JSON.parse(u);
    setUser(parsed);

    // грузим только активные/мои объявления
    fetch(`${API_BASE}/api/listings?userId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          🔑 Увійдіть, щоб переглянути профіль продавця
        </h2>
      </div>
    );
  }

  return <AccountLayout user={user} listings={listings} />;
}
