import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "OTHER",
    images: [""],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (i, value) => {
    const imgs = [...form.images];
    imgs[i] = value;
    setForm({ ...form, images: imgs });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Необхідно увійти в акаунт");

      const res = await fetch(`${API_BASE}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 токен
        },
        body: JSON.stringify(form), // 👈 без userId
      });

      if (!res.ok) throw new Error("Failed to create listing");

      setSuccess("✅ Оголошення створене!");
      setForm({
        title: "",
        description: "",
        price: "",
        category: "OTHER",
        images: [""],
      });
    } catch (err) {
      setSuccess("❌ Помилка при створенні");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">📦 Додати оголошення</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Назва"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Опис"
          rows={4}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Ціна"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="OTHER">Інше</option>
          <option value="ELECTRONICS">Електроніка</option>
          <option value="CLOTHES">Одяг</option>
          <option value="AUTO">Авто</option>
        </select>

        {/* Картинки */}
        <div className="space-y-2">
          {form.images.map((url, i) => (
            <input
              key={i}
              type="url"
              value={url}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder="Посилання на зображення"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-600 hover:underline"
          >
            ➕ Додати ще фото
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-400"
        >
          {loading ? "⏳ Збереження..." : "📤 Опублікувати"}
        </button>
      </form>

      {success && (
        <p className="mt-4 text-center font-medium text-gray-700">{success}</p>
      )}
    </div>
  );
}
