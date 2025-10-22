import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoImage from "../../components/common/NoImage";
import { MapPin, Clock, Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RecommendationsCompact() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("popularListingsCompact");
    if (cached) {
      setItems(JSON.parse(cached).slice(0, 4));
      setLoading(false);
    } else {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/listings/popular/all`);
          const data = await res.json();
          if (Array.isArray(data)) {
            const sliced = data.slice(0, 4);
            setItems(sliced);
            sessionStorage.setItem(
              "popularListingsCompact",
              JSON.stringify(sliced)
            );
          }
        } catch (err) {
          console.error("❌ Помилка завантаження:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const handleClick = (id) => navigate(`/listings/${id}`);

  // 🔹 Формат дати
  const formatDate = (dateString) => {
    if (!dateString) return "сьогодні";
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffH = diffMs / (1000 * 60 * 60);

    if (diffH < 1) return "щойно";
    if (diffH < 24) return `${Math.floor(diffH)} год тому`;
    const days = Math.floor(diffH / 24);
    return days === 1 ? "вчора" : `${days} дн. тому`;
  };

  return (
    <div
      className="absolute hidden xl:flex flex-col justify-between
                 top-[40px] left-[55px] translate-x-[-20px]
                 bg-white border border-neutral-200/80 rounded-2xl
                 shadow-[0_4px_25px_rgba(0,0,0,0.05)]
                 p-5 w-[400px] min-h-[540px] overflow-hidden transition-all duration-300"
    >
      {/* === Заголовок === */}
      <div className="relative flex items-center justify-center gap-2 mb-4">
        <Sparkles size={18} className="text-[#1a73e8]" />
        <h3 className="text-[19px] font-semibold text-neutral-900 tracking-tight">
          Рекомендовані товари
        </h3>
      </div>

      {/* === Сетка карточек === */}
      <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[190px] bg-neutral-200/30 rounded-lg animate-pulse"
            />
          ))}

        {!loading &&
          items.map((item) => {
            const city = item.city || "Київ";
            const condition = item.condition || "Нове";
            const time = formatDate(item.createdAt);

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="group flex flex-col justify-between bg-white rounded-xl border border-neutral-200
                           hover:border-[#1a73e8]/60 hover:shadow-[0_4px_18px_rgba(26,115,232,0.15)]
                           transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Фото */}
                <div className="relative w-full h-[140px] overflow-hidden bg-neutral-100">
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <NoImage size="medium" rounded />
                  )}

                  {/* Состояние (нове / б/в) */}
                  <span
                    className={`absolute top-2 left-2 text-[11px] font-medium px-2 py-[2px] rounded-md text-white ${
                      condition.toLowerCase().includes("нов")
                        ? "bg-green-600/90"
                        : "bg-neutral-700/90"
                    }`}
                  >
                    {condition}
                  </span>
                </div>

                {/* Контент */}
                <div className="p-2.5">
                  <h4 className="text-[14px] font-semibold text-neutral-900 line-clamp-2 leading-snug hover:text-[#1a73e8] transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-[15px] text-[#1a73e8] font-bold mt-1">
                    {item.price?.toLocaleString("uk-UA")} ₴
                  </p>

                  {/* Город + время */}
                  <div className="flex items-center justify-between text-[12px] text-neutral-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* === Кнопка === */}
      <div className="mt-5 text-center relative z-10">
        <Link
          to="/recommendations"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold 
                     rounded-lg bg-[#1a73e8] text-white hover:bg-[#155ac8]
                     shadow-[0_2px_10px_rgba(26,115,232,0.25)] transition-all duration-300"
        >
          Переглянути всі →
        </Link>
      </div>
    </div>
  );
}
