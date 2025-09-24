import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ Failed to load listings:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = listings.filter(
    (item) =>
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.description?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          🏠 Маркетплейс STP
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Купуй та продавай легко, швидко і безпечно 🚀
        </p>

        {/* Поиск */}
        <div className="flex justify-center max-w-xl mx-auto">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Що ви шукаєте?"
            className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-500 transition">
            Пошук
          </button>
        </div>
      </section>

      {/* Фильтры */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-3">
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <option>Всі категорії</option>
            <option>Електроніка</option>
            <option>Одяг</option>
            <option>Авто</option>
          </select>
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <option>За новизною</option>
            <option>Ціна ↑</option>
            <option>Ціна ↓</option>
          </select>
        </div>
        <span className="text-gray-500 text-sm">
          Знайдено: {filtered.length}
        </span>
      </section>

      {/* Список */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 h-64"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg font-medium">Нічого не знайдено</p>
          <p className="text-sm text-gray-400">
            Спробуйте змінити фільтри або пошуковий запит
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ item }) {
  const img = item.images?.[0]?.url || "https://placehold.co/600x400";
  return (
    <Link
      to={`/listings/${item.id}`}
      className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform overflow-hidden block"
    >
      <div className="relative">
        <img src={img} alt={item.title} className="h-48 w-full object-cover" />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
          {item.category || "Інше"}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold truncate">{item.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold">
            {new Intl.NumberFormat("uk-UA", {
              style: "currency",
              currency: "UAH",
              maximumFractionDigits: 0,
            }).format(item.price)}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString("uk-UA")}
          </span>
        </div>
      </div>
    </Link>
  );
}
