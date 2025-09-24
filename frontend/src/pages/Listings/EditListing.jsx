import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "OTHER",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Загружаем существующее объявление
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            price: data.price || "",
            category: data.category || "OTHER",
          });
        } else {
          setMsg("❌ " + (data.error || "Не вдалося завантажити оголошення"));
        }
      } catch (err) {
        setMsg("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не вдалося оновити");

      setMsg("✅ Оголошення оновлено!");
      setTimeout(() => navigate(`/listings/${id}`), 1000);
    } catch (err) {
      setMsg("❌ " + err.message);
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">✏️ Редагувати оголошення</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Заголовок"
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Опис"
          className="w-full border rounded-lg px-4 py-2"
          rows="4"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Ціна (UAH)"
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="OTHER">Інше</option>
          <option value="ELECTRONICS">Електроніка</option>
          <option value="CLOTHES">Одяг</option>
          <option value="CARS">Авто</option>
        </select>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
        >
          💾 Зберегти зміни
        </button>
      </form>

      {msg && <p className="mt-4 text-center">{msg}</p>}
    </div>
  );
}
