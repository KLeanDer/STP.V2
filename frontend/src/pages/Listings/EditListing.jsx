import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryTree } from "@/hooks/useCategoryTree";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategoryTree();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
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
            price:
              typeof data.price === "number" && Number.isFinite(data.price)
                ? String(data.price)
                : "",
            categoryId: data.category?.id || "",
            subcategoryId: data.subcategory?.id || "",
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
      const priceNumber = Number(form.price);
      if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
        setMsg("❌ Вкажіть коректну ціну");
        return;
      }
      if (!form.categoryId) {
        setMsg("❌ Оберіть категорію");
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: priceNumber,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || undefined,
      };

      const res = await fetch(`${API_BASE}/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
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

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Категорія
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                  subcategoryId: "",
                }))
              }
              className="w-full border rounded-lg px-4 py-2"
              disabled={categoriesLoading}
            >
              <option value="">Оберіть категорію</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesError && !categoriesLoading && (
              <p className="text-sm text-rose-500 mt-1">
                Не вдалося завантажити категорії. Спробуйте пізніше.
              </p>
            )}
          </div>

          {form.categoryId && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Підкатегорія
              </label>
              <select
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    subcategoryId: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-4 py-2"
                disabled={categoriesLoading}
              >
                <option value="">Усі підкатегорії</option>
                {categories
                  .find((category) => category.id === form.categoryId)
                  ?.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

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
