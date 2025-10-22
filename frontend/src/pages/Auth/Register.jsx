import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ добавляем контекст

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ берём функцию login из контекста

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // ✅ через контекст обновляем user в Navbar без перезагрузки
      login(data.user, data.token);

      // ✅ редирект на главную
      navigate("/");

      setMsg("✅ Реєстрація успішна!");
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">📝 Реєстрація</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ім’я"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Телефон (необов'язково)"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Пароль"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
        >
          {loading ? "⏳ Створюємо..." : "🚀 Зареєструватися"}
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-gray-700">{msg}</p>}
    </div>
  );
}
