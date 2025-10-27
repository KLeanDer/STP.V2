import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBarMain from "../../components/common/SearchBarMain";
import { Filter } from "lucide-react";

export default function HeroSection({ onOpenFilters }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 overflow-hidden z-10">
      {/* Фон */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,86,179,0.06),transparent_70%)]"
      />

      {/* Заголовок */}
      <motion.h1
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8"
      >
        <span className="text-black">STP</span>{" "}
        <span className="bg-gradient-to-r from-[#0056b3] to-[#0088cc] text-transparent bg-clip-text">
          Marketplace
        </span>
      </motion.h1>

      {/* Разделительная линия */}
      <motion.div
        initial={mounted ? { width: 0, opacity: 0 } : false}
        animate={{ width: "220px", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.05, opacity: 1 }}
        className="h-[1.5px] bg-gradient-to-r from-transparent via-[#0056b3]/50 to-transparent mb-10 transition-all duration-300"
      />

      {/* Поиск + кнопка фільтрів */}
      <motion.div
        initial={mounted ? { opacity: 0, y: 15 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mb-10 flex items-center justify-center gap-3 w-full max-w-[800px]"
      >
        <div className="flex-grow">
          <SearchBarMain />
        </div>

        {/* Кнопка фильтров */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-300 rounded-full shadow-sm hover:bg-neutral-100 transition"
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Фільтри</span>
        </button>
      </motion.div>

      {/* Кнопки */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center gap-3 mt-4"
      >
        <Link
          to="/recommendations"
          className="px-7 py-2.5 rounded-full bg-[#0056b3] text-white text-sm font-semibold hover:bg-[#00449b] transition-all shadow-[0_0_18px_rgba(0,70,160,0.25)]"
        >
          Рекомендації
        </Link>
        <Link
          to="/listings/create"
          className="px-7 py-2.5 rounded-full border border-[#0056b3]/40 text-[#0056b3] hover:bg-[#0056b3]/10 text-sm font-medium transition-all"
        >
          + Створити
        </Link>
      </motion.div>
    </section>
  );
}
