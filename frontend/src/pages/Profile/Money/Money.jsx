import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Money() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    async function load() {
      try {
        // пока фейковые данные для теста
        setBalance(2530.75);
        setHistory([
          {
            id: 1,
            type: "Поповнення",
            amount: 1000,
            date: "2025-09-01",
            status: "✅ Успішно",
          },
          {
            id: 2,
            type: "Вивід коштів",
            amount: -500,
            date: "2025-08-25",
            status: "✅ Успішно",
          },
          {
            id: 3,
            type: "Продаж",
            amount: 1200,
            date: "2025-08-20",
            status: "✅ Успішно",
          },
        ]);
      } catch (err) {
        console.error("❌ Failed to load money:", err);
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Баланс */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">💳 Мій баланс</h1>
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat("uk-UA", {
              style: "currency",
              currency: "UAH",
              maximumFractionDigits: 2,
            }).format(balance)}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-gray-100 transition">
            ➕ Поповнити
          </button>
          <button className="px-4 py-2 bg-white text-red-600 rounded-lg shadow hover:bg-gray-100 transition">
            ⬇️ Вивести
          </button>
        </div>
      </div>

      {/* График доходов (заглушка) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">📊 Статистика доходів</h2>
        <div className="h-40 flex items-center justify-center text-gray-400 border rounded">
          Тут буде графік (додамо Chart.js або Recharts)
        </div>
      </div>

      {/* Історія */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">🕑 Історія операцій</h2>
        <div className="space-y-3">
          {history.map((op) => (
            <div
              key={op.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{op.type}</p>
                <p className="text-xs text-gray-500">
                  {new Date(op.date).toLocaleDateString("uk-UA")}
                </p>
              </div>
              <div
                className={`font-bold ${
                  op.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {op.amount > 0 ? "+" : ""}
                {new Intl.NumberFormat("uk-UA", {
                  style: "currency",
                  currency: "UAH",
                  maximumFractionDigits: 2,
                }).format(op.amount)}
              </div>
              <span className="text-sm text-gray-500">{op.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
