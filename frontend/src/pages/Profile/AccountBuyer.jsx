import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  UserCircle,
  Clock,
  CheckCircle,
  Edit3,
} from "lucide-react";
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

    fetch(`${API_BASE}/api/listings?userId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <UserCircle size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-700">
          Увійдіть, щоб переглянути свій профіль
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-20 h-20 rounded-full border border-neutral-300 shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">{user?.name}</h2>
            <p className="text-neutral-500">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/profile/edit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition"
        >
          <Edit3 size={16} /> Редагувати
        </Link>
      </div>

      {/* Info */}
      <ProfileInfo user={user} isOwnProfile />

      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Link
          to="/profile/orders/buyer"
          className="flex flex-col items-center justify-center gap-2 p-6 bg-white border rounded-xl shadow-sm hover:bg-neutral-100 transition"
        >
          <ShoppingCart size={24} className="text-neutral-800" />
          <span className="font-medium text-neutral-800">Мої покупки</span>
        </Link>
        <Link
          to="/profile/orders/seller"
          className="flex flex-col items-center justify-center gap-2 p-6 bg-white border rounded-xl shadow-sm hover:bg-neutral-100 transition"
        >
          <Store size={24} className="text-neutral-800" />
          <span className="font-medium text-neutral-800">Мої продажі</span>
        </Link>
      </div>

      {/* Listings */}
      <div className="space-y-12">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-4">
            <CheckCircle size={20} className="text-green-600" />
            Активні оголошення
          </h3>
          <ProfileListings listings={listings.filter((l) => l.status === "active")} />
        </div>

        <div className="border-t pt-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-4">
            <Clock size={20} className="text-gray-500" />
            Неактивні оголошення
          </h3>
          <ProfileListings listings={listings.filter((l) => l.status === "inactive")} />
        </div>
      </div>
    </div>
  );
}
