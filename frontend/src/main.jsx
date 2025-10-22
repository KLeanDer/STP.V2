import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Tailwind
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ подключаем контекст

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 🔹 Оборачиваем всё приложение в AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
