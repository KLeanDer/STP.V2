import { motion } from "framer-motion";
import { Sparkles, Cpu, ShoppingBag } from "lucide-react";

export default function ListingRightPanel({ related = [] }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full lg:w-[340px] shrink-0 bg-white/80 backdrop-blur-lg border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl p-6 h-fit self-start sticky top-24"
    >
      {/* === Схожі товари === */}
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-[#0056b3]">
        <ShoppingBag size={20} />
        Схожі товари
      </h2>

      {related.length > 0 ? (
        <div className="flex flex-col gap-4">
          {related.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-[#f9f9f9] rounded-2xl p-3 hover:shadow-md transition cursor-pointer"
            >
              <img
                src={item.image || "https://placehold.co/80x80"}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex flex-col">
                <p className="font-medium text-sm text-neutral-800 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-[#0056b3] font-bold text-sm">
                  {item.price?.toLocaleString("uk-UA")} ₴
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Поки що немає схожих товарів</p>
      )}

      <hr className="my-6 border-neutral-200" />

      {/* === AI порада === */}
      <div className="bg-[#f3f7ff] border border-[#0056b3]/20 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#0056b3] mb-2 flex items-center gap-1.5">
          <Cpu size={14} />
          Порада STP AI
        </h3>
        <p className="text-sm text-neutral-600 leading-snug">
          “Користувачі, які переглядали цей товар, часто купували також інші
          товари з категорії <b>Електроніка</b>.”
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <button className="px-6 py-2 rounded-full bg-[#0056b3] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#00449b] transition-all shadow-[0_0_15px_rgba(0,86,179,0.25)]">
          <Sparkles size={16} /> Дивитись усі
        </button>
      </div>
    </motion.aside>
  );
}
