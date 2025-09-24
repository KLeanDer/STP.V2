import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Rating() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState({ average: 0, total: 0, breakdown: {} });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    async function load() {
      try {
        // здесь позже подключим реальный эндпоинт API
        const res = await fetch(`${API_BASE}/api/rating`);
        if (res.ok) {
          const data = await res.json();
          setRating(data.rating);
          setReviews(data.reviews);
        } else {
          // для теста — фейковые данные
          setRating({
            average: 4.6,
            total: 128,
            breakdown: { 5: 90, 4: 25, 3: 8, 2: 3, 1: 2 },
          });
          setReviews([
            {
              id: 1,
              author: "Олександр",
              stars: 5,
              text: "Все чудово, швидка відправка 🚀",
              date: "2025-09-01",
            },
            {
              id: 2,
              author: "Марина",
              stars: 4,
              text: "Товар норм, але упаковка могла бути кращою.",
              date: "2025-08-20",
            },
          ]);
        }
      } catch (err) {
        console.error("❌ Failed to load rating:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-10">⏳ Завантаження...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">⭐ Мій рейтинг</h1>
        <span className="text-yellow-500 text-3xl font-semibold">
          {rating.average.toFixed(1)}
        </span>
        <span className="text-gray-500">({rating.total} відгуків)</span>
      </div>

      {/* Диаграмма по звёздам */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = rating.breakdown[star] || 0;
          const percent = rating.total ? (count / rating.total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-6">{star}★</span>
              <div className="flex-1 bg-gray-200 rounded h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-3"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="w-10 text-sm text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Отзывы */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📋 Останні відгуки</h2>
        {reviews.length === 0 && (
          <p className="text-gray-500">Відгуків ще немає.</p>
        )}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{r.author}</p>
              <span className="text-xs text-gray-400">
                {new Date(r.date).toLocaleDateString("uk-UA")}
              </span>
            </div>
            <div className="text-yellow-500">
              {"★".repeat(r.stars)}{" "}
              <span className="text-gray-400">
                {"☆".repeat(5 - r.stars)}
              </span>
            </div>
            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
