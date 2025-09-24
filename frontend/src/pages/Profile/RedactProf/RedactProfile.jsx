import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RedactProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    about: "",
    avatarUrl: "",
    telegram: "",
    instagram: "",
    website: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загружаем юзера из localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(u);
    setForm({
      name: parsed.name || "",
      phone: parsed.phone || "",
      about: parsed.about || "",
      avatarUrl: parsed.avatarUrl || "",
      telegram: parsed.telegram || "",
      instagram: parsed.instagram || "",
      website: parsed.website || "",
    });
    setPreview(parsed.avatarUrl || "");
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, avatarUrl: url });
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Необхідно увійти");

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        alert("✅ Профіль оновлено!");
        navigate("/profile/buyer");
      } else {
        alert(data.error || "Помилка при збереженні");
      }
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        ⏳ Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Заголовок */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        ✏️ Редагування профілю
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        {/* Аватар */}
        <div className="flex items-center gap-6">
          <img
            src={preview || "https://i.pravatar.cc/100"}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full border shadow object-cover"
          />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL аватарки
            </label>
            <input
              type="text"
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={handleAvatarChange}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Имя */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ім’я
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Телефон */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+380..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Про себя */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Про себе
          </label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
            placeholder="Кілька слів про вас..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Соцсети */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram
            </label>
            <input
              type="text"
              name="telegram"
              value={form.telegram}
              onChange={handleChange}
              placeholder="@username"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="@username"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            ❌ Скасувати
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-500 shadow"
          >
            💾 Зберегти зміни
          </button>
        </div>
      </form>
    </div>
  );
}
