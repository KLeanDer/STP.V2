import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, History } from "lucide-react";
import { Link } from "react-router-dom";
import NoImage from "../../components/common/NoImage"; // 👈 заглушка

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Recommendations() {
  const [listings, setListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // === Загружаем рекомендации ===
  useEffect(() => {
    async function load() {
      try {
        const recent = JSON.parse(localStorage.getItem("recentListings") || "[]");
        const queryStr = recent.length ? `?recentIds=${recent.join(",")}` : "";
        const res = await fetch(`${API_BASE}/api/listings/recommendations${queryStr}`);
        const data = await res.json();

        let merged = [
          ...(data?.basedOnViews || []),
          ...(data?.popular || []),
          ...(data?.trendingWeek || []),
        ];

        if (!merged.length) {
          const exploreRes = await fetch(`${API_BASE}/api/listings/explore?page=1&limit=20`);
          const exploreData = await exploreRes.json();
          merged = exploreData.listings || [];
        }

        const unique = merged.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        setListings(unique);

        if (recent.length) {
          const recRes = await fetch(`${API_BASE}/api/listings?ids=${recent.join(",")}`);
          const recData = await recRes.json();
          setRecentListings(Array.isArray(recData) ? recData : []);
        }
      } catch (err) {
        console.error("❌ Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // === Подгрузка при скролле ===
  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !loadingMore
      ) {
        setLoadingMore(true);
        try {
          const res = await fetch(
            `${API_BASE}/api/listings/explore?page=${page + 1}&limit=20`
          );
          const data = await res.json();

          if (data?.listings?.length) {
            setListings((prev) => [...prev, ...data.listings]);
            setPage((prev) => prev + 1);
            setHasMore(data.hasMore);
          } else {
            setHasMore(false);
          }
        } catch (err) {
          console.error("⚠️ Error loading more:", err);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingMore]);

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#f5f5f5] to-[#ededed] text-neutral-900 relative overflow-hidden">
      {/* === STP BACKGROUND === */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1
          className="text-[26rem] font-extrabold text-[#e0e0e0]/30 blur-[6px] rotate-[-25deg] tracking-tighter"
          style={{ userSelect: "none", lineHeight: "0.7" }}
        >
          STP
        </h1>
      </div>

      {/* === HEADER === */}
      <section className="relative z-10 pt-20 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-[#0056b3] drop-shadow-sm"
        >
          Рекомендації для тебе
        </motion.h1>
        <p className="text-neutral-600 mt-3 max-w-md mx-auto">
          На основі твоїх дій, переглядів і категорій, що тебе цікавлять.
        </p>

        {/* === SEARCH BAR === */}
        <div className="relative w-[90%] sm:w-[80%] md:w-[700px] mx-auto mt-8">
          <Search
            size={20}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук серед рекомендацій..."
            className="w-full py-3 pl-14 pr-5 text-[16px] rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-[#0056b3]/40 focus:outline-none transition-all shadow-md hover:shadow-lg"
          />
        </div>
      </section>

      {/* === MAIN SECTION === */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {/* === RECENTLY VIEWED === */}
        {recentListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-6 justify-center">
              <History size={22} strokeWidth={2} color="#0056b3" />
              <h2 className="text-2xl font-semibold text-neutral-900">
                Нещодавно переглянуті
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {recentListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/listings/${item.id}`}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="relative h-36 overflow-hidden">
                    {item.images?.[0]?.url ? (
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <NoImage ratioClassName="h-36" size="compact" rounded={false} />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-medium text-neutral-800 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[#0056b3] font-semibold text-sm">
                      {item.price?.toLocaleString("uk-UA")} ₴
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* === MAIN LIST === */}
        {loading ? (
          <p className="text-center text-neutral-500">Завантаження...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-neutral-500">Нічого не знайдено 😔</p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8"
          >
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl border border-neutral-200 shadow-md hover:shadow-2xl transition-all overflow-hidden cursor-pointer group"
              >
                <Link to={`/listings/${item.id}`}>
                  <div className="relative h-52 overflow-hidden">
                    {item.image || item.images?.[0]?.url ? (
                      <img
                        src={item.image || item.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <NoImage ratioClassName="h-52" size="compact" rounded={false} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-neutral-800">
                      {item.title}
                    </h3>
                    <p className="text-[#0056b3] font-bold">
                      {item.price?.toLocaleString("uk-UA")} ₴
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {loadingMore && (
          <p className="text-center text-neutral-500 mt-8">Завантаження ще...</p>
        )}

        {/* === AI Hint === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-[#0056b3]/10 shadow-[0_0_30px_rgba(0,86,179,0.08)] text-center"
        >
          <Sparkles
            size={26}
            strokeWidth={2}
            color="#0056b3"
            className="mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold text-[#0056b3] mb-2">
            Порада від STP AI
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Ми підбираємо товари, що відповідають твоїм інтересам. 
            Чим більше ти користуєшся STP — тим точнішими стають рекомендації 💡
          </p>
        </motion.div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-neutral-200 py-5 text-center text-[12px] text-neutral-500 bg-white/80 backdrop-blur-sm relative z-10">
        © {new Date().getFullYear()} STP — створено з довірою та стилем.
      </footer>
    </main>
  );
}
