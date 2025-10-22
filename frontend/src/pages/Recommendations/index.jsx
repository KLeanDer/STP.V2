import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RecentlyViewed from "./RecentlyViewed";
import Recommendations from "./Recommendations";
import { Sparkles, Clock } from "lucide-react";
import NoImage from "../../components/common/NoImage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function RecommendationsSection() {
  const [recent, setRecent] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [recentRes, recommendRes] = await Promise.all([
        fetch(`${API_BASE}/api/recommendations/recent`, { headers }),
        fetch(`${API_BASE}/api/recommendations/smart`, { headers }),
      ]);

      const recentData = recentRes.ok ? await recentRes.json() : [];
      const recommendData = recommendRes.ok ? await recommendRes.json() : [];

      setRecent(recentData || []);
      setRecommend(recommendData || []);
    } catch (err) {
      console.error("❌ Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // 🧩 автообновление recent после клика в RecentlyViewed
  const handleRecentUpdate = (updater) => {
    setRecent((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  if (loading)
    return (
      <div className="p-6 text-center text-neutral-500">Завантаження...</div>
    );

  return (
    <div className="flex flex-col gap-10 py-8">
      {/* === Нещодавно переглянуті === */}
      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-600" />
            <h2 className="text-lg font-semibold text-neutral-800">
              Ви дивились
            </h2>
          </div>
          <RecentlyViewed listings={recent} onUpdate={handleRecentUpdate} />
        </motion.section>
      )}

      {/* === Рекомендації === */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-blue-600" />
          <h2 className="text-lg font-semibold text-neutral-800">
            Рекомендації для вас
          </h2>
        </div>

        {recommend.length > 0 ? (
          <Recommendations listings={recommend} />
        ) : (
          <div className="flex justify-center py-10">
            <NoImage text="Поки що немає рекомендацій" type="listing" />
          </div>
        )}
      </motion.section>
    </div>
  );
}
