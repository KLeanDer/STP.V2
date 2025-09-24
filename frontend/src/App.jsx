import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// страницы
import Home from "./pages/Home/Home";

// объявления
import CreateListing from "./pages/Listings/CreateListing";
import ListingDetail from "./pages/Listings/ListingDetail";
import EditListing from "./pages/Listings/EditListing";
import ListingOrder from "./pages/Listings/ListingOrder/ListingOrder";

// авторизация
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

// профиль (файлы в корне Profile)
import AccountLayout from "./pages/Profile/AccountLayout";
import AccountBuyer from "./pages/Profile/AccountBuyer";
import AccountSeller from "./pages/Profile/AccountSeller";
import ProfilePublic from "./pages/Profile/ProfilePublic";

// профиль → подстраницы (в папках)
import RedactProfile from "./pages/Profile/RedactProf/RedactProfile";
import Rating from "./pages/Profile/Rating/Rating";
import Money from "./pages/Profile/Money/Money";
import AccountOrderBy from "./pages/Profile/AccountOrder/AccountOrderBy";
import AccountOrderSel from "./pages/Profile/AccountOrder/AccountOrderSel";

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="page">
        <Routes>
          {/* Главная */}
          <Route path="/" element={<Home />} />

          {/* Объявления */}
          <Route path="/listings/create" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="/listings/:id/order" element={<ListingOrder />} />

          {/* Авторизация */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Публичный профиль (отдельно, чтобы не мешать личному лэйауту) */}
          <Route path="/profile/:id" element={<ProfilePublic />} />

          {/* Личный кабинет с общим лэйаутом и вложенными маршрутами */}
          <Route path="/profile" element={<AccountLayout />}>
            <Route index element={<AccountBuyer />} />               {/* /profile */}
            <Route path="buyer" element={<AccountBuyer />} />         {/* /profile/buyer */}
            <Route path="seller" element={<AccountSeller />} />       {/* /profile/seller */}
            <Route path="orders/buyer" element={<AccountOrderBy />} />
            <Route path="orders/seller" element={<AccountOrderSel />} />
            <Route path="money" element={<Money />} />
            <Route path="rating" element={<Rating />} />
            <Route path="edit" element={<RedactProfile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
