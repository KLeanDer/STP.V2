import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // грузим юзера из localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Логотип */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-blue-600 hover:text-blue-700 transition"
          >
            STP
          </Link>

          {/* Поиск (десктоп) */}
          <div className="hidden md:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="Пошук оголошень..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Навигация */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinkBase to="/">Головна</NavLinkBase>
            <NavLinkBase to="/listings/create">+ Додати</NavLinkBase>
            <NavLinkBase to="/chat">Чати</NavLinkBase>

            {user ? (
              <>
                <NavLinkBase to="/profile/buyer">Профіль</NavLinkBase>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || "https://i.pravatar.cc/40"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Вийти
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <NavLink
                  to="/login"
                  className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                >
                  Увійти
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
                >
                  Реєстрація
                </NavLink>
              </div>
            )}
          </div>

          {/* Бургер */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Мобільне меню */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-sm">
          <input
            type="text"
            placeholder="Пошук..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <NavLinkBase to="/">Головна</NavLinkBase>
          <NavLinkBase to="/listings/create">+ Додати</NavLinkBase>
          <NavLinkBase to="/chat">Чати</NavLinkBase>

          {user ? (
            <>
              <NavLinkBase to="/profile/buyer">Профіль</NavLinkBase>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <img
                  src={user.avatarUrl || "https://i.pravatar.cc/40"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={logout}
                  className="ml-auto text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Вийти
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <NavLink
                to="/login"
                className="flex-1 text-center text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                Увійти
              </NavLink>
              <NavLink
                to="/register"
                className="flex-1 text-center text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
              >
                Реєстрація
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// Tailwind helper для NavLink
function NavLinkBase({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition ${
          isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
