import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AccountLayout() {
  const location = useLocation();
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

  // удобный Хелпер для активных ссылок
  const linkCls = ({ isActive }) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
      isActive
        ? "bg-blue-50 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="bg-white border rounded-xl shadow-sm p-4 h-fit sticky top-20">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.avatarUrl || "https://i.pravatar.cc/80"}
            alt="avatar"
            className="w-12 h-12 rounded-full border"
          />
        </div>

        <nav className="space-y-1">
          <NavLink to="/profile/buyer" className={linkCls}>🏠 Головна</NavLink>
          <div className="mt-3 text-xs font-semibold text-gray-500 px-1">Замовлення</div>
          <NavLink to="/profile/orders/buyer" className={linkCls}>🛒 Мої покупки</NavLink>
          <NavLink to="/profile/orders/seller" className={linkCls}>💰 Мої продажі</NavLink>

          <div className="mt-3 text-xs font-semibold text-gray-500 px-1">Профіль</div>
          <NavLink to="/profile/money" className={linkCls}>💼 Баланс</NavLink>
          <NavLink to="/profile/rating" className={linkCls}>⭐ Рейтинг</NavLink>
          <NavLink to="/profile/edit" className={linkCls}>⚙️ Налаштування</NavLink>
        </nav>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="w-full text-left text-sm px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
          >
            ⏏ Вийти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
    </div>
  );
}
