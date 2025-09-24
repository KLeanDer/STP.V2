import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListingOrder() {
  const { id } = useParams(); // id объявления
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    city: "",
    postOffice: "",
    comment: "",
  });

  // загрузка объявления
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("❌ Failed to load listing:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // отправка заказа
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Необхідно увійти");

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: id,
          city: orderForm.city.trim(),
          postOffice: orderForm.postOffice.trim(), // 👈 теперь совпадает с бэком
          comment: orderForm.comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Замовлення створене!");
        navigate("/profile/buyer");
      } else {
        alert(data.error || "Помилка при створенні замовлення");
      }
    } catch (err) {
      console.error("❌ Failed to create order:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        ⏳ Завантаження...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-600">
        ❌ Оголошення не знайдено
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">
        🛒 Оформлення замовлення:{" "}
        <span className="text-blue-600">{listing.title}</span>
      </h1>
      <p className="text-lg">
        Ціна:{" "}
        <span className="text-blue-600 font-semibold">
          {new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
          }).format(listing.price)}
        </span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md border"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Місто доставки
          </label>
          <input
            type="text"
            value={orderForm.city}
            onChange={(e) =>
              setOrderForm({ ...orderForm, city: e.target.value })
            }
            required
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Відділення Нової Пошти
          </label>
          <input
            type="text"
            value={orderForm.postOffice}
            onChange={(e) =>
              setOrderForm({ ...orderForm, postOffice: e.target.value })
            }
            required
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Коментар (необов'язково)
          </label>
          <textarea
            value={orderForm.comment}
            onChange={(e) =>
              setOrderForm({ ...orderForm, comment: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition"
          >
            ❌ Скасувати
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-500 transition"
          >
            ✅ Підтвердити замовлення
          </button>
        </div>
      </form>
    </div>
  );
}
