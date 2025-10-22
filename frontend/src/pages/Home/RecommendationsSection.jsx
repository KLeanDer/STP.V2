import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import NoImage from "../../components/common/NoImage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RecommendationsSection() {
  const accent = "#a58b5e";
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // === ⏰ Проверяем, не устарел ли кэш ===
  useEffect(() => {
    const cached = sessionStorage.getItem("stp_recommendations");
    const lastUpdate = sessionStorage.getItem("stp_recommendations_time");

    const isExpired =
      !lastUpdate || Date.now() - parseInt(lastUpdate) > 1000 * 60 * 60; // >1 час

    if (cached && !isExpired) {
      setRecommendations(JSON.parse(cached).slice(0, 8));
      setLoading(false);
    } else {
      loadRecommendations();
    }
  }, []);

  // === 🔥 Основная загрузка рекомендаций ===
  const loadRecommendations = async () => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentListings") || "[]");
      const queryStr = recent.length ? `?recentIds=${recent.join(",")}` : "";

      const res = await fetch(`${API_BASE}/api/recommendations${queryStr}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const sliced = data.slice(0, 8);
        setRecommendations(sliced);
        sessionStorage.setItem("stp_recommendations", JSON.stringify(sliced));
        sessionStorage.setItem("stp_recommendations_time", Date.now().toString());
      }
    } catch (err) {
      console.error("❌ Помилка завантаження рекомендацій:", err);
    } finally {
      setLoading(false);
    }
  };

  // === Обновление при просмотре нового объявления ===
  useEffect(() => {
    const listener = () => {
      sessionStorage.removeItem("stp_recommendations");
      sessionStorage.removeItem("stp_recommendations_time");
      loadRecommendations();
    };

    window.addEventListener("stp:newView", listener);
    return () => window.removeEventListener("stp:newView", listener);
  }, []);

  const handleCardClick = (id) => navigate(`/listings/${id}`);

  return (
    <motion.section
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8
                 bg-gradient-to-b from-[#f4f1eb]/80 to-[#f0ede7]/80 
                 backdrop-blur-[1px] border-t border-neutral-300/50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      {/* === Заголовок === */}
      <h2 className="text-3xl font-semibold text-neutral-800 mb-5 text-center flex items-center justify-center gap-2">
        <Sparkles size={26} strokeWidth={2} color={accent} />
        Рекомендації для тебе
      </h2>

      {/* === Разделитель === */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "260px", opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="h-[2px] bg-gradient-to-r from-transparent via-[#a58b5e]/60 to-transparent mb-14 mx-auto rounded-full"
      />

      {/* === Контент === */}
      {loading ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white/70 rounded-2xl border border-neutral-200 shadow-sm animate-pulse overflow-hidden backdrop-blur-sm"
            >
              <div className="h-44 bg-neutral-200/50"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-200/70 w-3/4 rounded"></div>
                <div className="h-4 bg-neutral-200/70 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {recommendations.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 180, damping: 15 }}
              onClick={() => handleCardClick(item.id)}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-neutral-200 shadow-sm 
                         hover:shadow-lg hover:border-[#a58b5e]/50 
                         overflow-hidden transition-all cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                {item.images?.[0]?.url ? (
                  <img
                    loading="lazy"
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <NoImage ratioClassName="h-44" size="compact" rounded={false} />
                )}
              </div>

              <div className="p-4 text-center">
                <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[#8b7a56] font-bold text-base">
                  {item.price?.toLocaleString("uk-UA")} ₴
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500">Поки що немає оголошень</p>
      )}

      {/* === Кнопка перехода === */}
      <div className="flex justify-center mt-16">
        <Link
          to="/recommendations"
          className="px-10 py-3 rounded-full bg-[#a58b5e] text-white text-lg font-semibold 
                     hover:bg-[#8d764b] transition-all shadow-[0_0_25px_rgba(165,139,94,0.25)]"
        >
          Відкрити всі рекомендації →
        </Link>
      </div>
    </motion.section>
  );
}
