import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/layout/Navbar";

// страницы
import Home from "./pages/Home/Home";
import Recommendations from "./pages/Recommendations"; // ✅ новый путь
import SearchPage from "./pages/Search";

// объявления
import CreateListing from "./pages/Listings/CreateListing/CreateListing";
import ListingDetail from "./pages/Listings/ListingDetail";
import EditListing from "./pages/Listings/EditListing";
import ListingOrder from "./pages/Listings/listingOrder/ListingOrder";

// авторизация
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

// профиль
import AccountLayout from "./pages/Profile/AccountLayout";
import AccountBuyer from "./pages/Profile/AccountBuyer";
import AccountSeller from "./pages/Profile/AccountSeller";
import ProfilePublic from "./pages/Profile/ProfilePublic";

// профиль → подстраницы
import RedactProfile from "./pages/Profile/RedactProf/RedactProfile";
import Rating from "./pages/Profile/Rating/Rating";
import Money from "./pages/Profile/Money/Money";
import AccountOrderBy from "./pages/Profile/AccountOrder/AccountOrderBy";
import AccountOrderSel from "./pages/Profile/AccountOrder/AccountOrderSel";

// чат
import ChatLayout from "./pages/Chat/ChatLayout";
import ChatsPlaceholder from "./pages/Chat/ChatsPlaceholder";
import Chat from "./pages/Chat/Chat";
import ChatStart from "./pages/Chat/ChatStart";

// сокеты
import { useNotificationsSocket } from "./sockets/notifications.hook";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // слушаем уведомления
  useNotificationsSocket(user?.id, (notif) => {
    setNotifications((prev) => [notif, ...prev]);
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar notifications={notifications} />

      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* 🧠 Рекомендации */}
        <Route path="/recommendations" element={<Recommendations />} /> {/* ✅ добавлено */}
        <Route path="/search" element={<SearchPage />} />

        {/* Объявления */}
        <Route path="/listings/create" element={<CreateListing />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/listings/:id/edit" element={<EditListing />} />
        <Route path="/listings/:id/order" element={<ListingOrder />} />

        {/* Авторизация */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Публичный профиль */}
        <Route path="/profile/:id" element={<ProfilePublic />} />

        {/* Личный кабинет */}
        <Route path="/profile" element={<AccountLayout />}>
          <Route index element={<AccountBuyer />} />
          <Route path="buyer" element={<AccountBuyer />} />
          <Route path="seller" element={<AccountSeller />} />
          <Route path="orders/buyer" element={<AccountOrderBy />} />
          <Route path="orders/seller" element={<AccountOrderSel />} />
          <Route path="money" element={<Money />} />
          <Route path="rating" element={<Rating />} />
          <Route path="edit" element={<RedactProfile />} />
        </Route>

        {/* Чат */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route index element={<ChatsPlaceholder />} />
          <Route path=":chatId" element={<Chat />} />
          <Route path="start" element={<ChatStart />} />
        </Route>
      </Routes>

      {/* 🔔 Простейший вывод уведомлений */}
      {user && notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded p-3 w-64">
          <h3 className="font-semibold text-sm mb-2">Новые уведомления</h3>
          <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
            {notifications.slice(0, 5).map((n, i) => (
              <li key={i} className="border-b pb-1">
                <span className="font-medium">{n.type}</span>: {n.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
