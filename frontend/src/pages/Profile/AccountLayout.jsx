import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  Store,
  Wallet,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

export default function AccountLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(u));
  }, [navigate]);

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-neutral-800 text-white shadow"
        : "text-neutral-600 hover:bg-neutral-200"
    }`;

  return (
    <div className="bg-neutral-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
          {user && (
            <div className="flex flex-col items-center text-center mb-10">
              <img
                src={user?.avatarUrl || "https://i.pravatar.cc/100"}
                alt="avatar"
                className="w-20 h-20 rounded-full border border-neutral-300 shadow-sm"
              />
              <p className="mt-3 font-semibold text-neutral-800">{user?.name}</p>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          )}

          <nav className="space-y-2 flex-1">
            <NavLink to="/profile/buyer" className={linkCls}>
              <Home size={18} /> Головна
            </NavLink>
            <NavLink to="/profile/orders/buyer" className={linkCls}>
              <ShoppingCart size={18} /> Мої покупки
            </NavLink>
            <NavLink to="/profile/orders/seller" className={linkCls}>
              <Store size={18} /> Мої продажі
            </NavLink>
            <NavLink to="/profile/money" className={linkCls}>
              <Wallet size={18} /> Баланс
            </NavLink>
            <NavLink to="/profile/rating" className={linkCls}>
              <Star size={18} /> Рейтинг
            </NavLink>
            <NavLink to="/profile/edit" className={linkCls}>
              <Settings size={18} /> Налаштування
            </NavLink>
          </nav>

          <div className="pt-6 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <LogOut size={18} /> Вийти
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="bg-white rounded-2xl shadow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
