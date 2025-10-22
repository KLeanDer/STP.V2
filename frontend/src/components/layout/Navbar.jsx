import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChatSocket } from "../../sockets/chat.hook";
import { LogOut, MessageSquare, Plus, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useChatSocket(null, null, { currentUserId: user?.id });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-neutral-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 relative">
        {/* --- ЛОГО --- */}
        <Link to="/" className="absolute left-6 group select-none flex items-center gap-1.5">
          <span className="text-[22px] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-700 to-black group-hover:opacity-80 transition-all duration-300">
            STP
          </span>
          <span className="text-[10px] font-semibold text-neutral-500 uppercase translate-y-[3px] tracking-[0.2em] group-hover:text-neutral-700 transition-all duration-300">
            beta
          </span>
        </Link>

        {/* --- НАВИГАЦИЯ ПО ЦЕНТРУ --- */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavItem to="/">Головна</NavItem>
          <NavItem to="/listings/create" icon={<Plus size={16} />}>
            Додати
          </NavItem>

          {/* --- Чати с уведомлением --- */}
          <div className="relative">
            <NavItem to="/chat" icon={<MessageSquare size={16} />}>
              Чати
            </NavItem>

            {unreadCount > 0 && (
              <span
                className="
                  absolute -top-2 -right-4 
                  bg-red-500 text-white text-[10px] 
                  font-semibold rounded-full 
                  px-[6px] py-[2px] 
                  shadow-sm animate-pulse
                "
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {user && <NavItem to="/profile/buyer" icon={<User size={16} />}>Профіль</NavItem>}
        </div>

        {/* --- ПРАВАЯ ЧАСТЬ --- */}
        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <button
                onClick={() => navigate("/profile/buyer")}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <img
                  src={user.avatarUrl || "https://i.pravatar.cc/100"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-neutral-300 shadow-sm"
                />
                <span className="text-sm font-medium text-neutral-800">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-500 hover:text-red-500 flex items-center gap-1 transition"
              >
                <LogOut size={14} /> Вийти
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
              >
                Реєстрація
              </Link>
            </div>
          )}

          {/* --- БУРГЕР (мобилка) --- */}
          <button
            className="md:hidden text-3xl text-neutral-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* --- МОБИЛЬНОЕ МЕНЮ --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-6 py-4 space-y-3 shadow-sm">
          <NavItem to="/">Головна</NavItem>
          <NavItem to="/listings/create" icon={<Plus size={16} />}>
            Додати
          </NavItem>
          <NavItem to="/chat" icon={<MessageSquare size={16} />}>
            Чати
          </NavItem>
          {user && <NavItem to="/profile/buyer" icon={<User size={16} />}>Профіль</NavItem>}

          {user ? (
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-500 hover:text-red-500 transition"
              >
                Вийти
              </button>
              <span className="text-sm font-medium text-neutral-700">{user.name}</span>
            </div>
          ) : (
            <div className="flex gap-3 pt-3 border-t border-neutral-200">
              <Link
                to="/login"
                className="flex-1 text-center text-sm px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center text-sm px-3 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 text-[15px] font-medium tracking-tight transition relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-black after:transition-all ${
          isActive
            ? "text-black after:w-full"
            : "text-neutral-600 hover:text-black after:w-0 hover:after:w-full"
        }`
      }
    >
      {icon && <span className="text-neutral-500">{icon}</span>}
      {children}
    </NavLink>
  );
}
