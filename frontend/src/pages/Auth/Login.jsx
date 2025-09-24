import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      // Сохраняем токен
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg("✅ Успішний вхід!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">🔑 Вхід</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? "⏳ Входимо..." : "🚀 Увійти"}
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-gray-700">{msg}</p>}
    </div>
  );
}
