import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function SearchBarMain({ compact = false }) {
  const [region, setRegion] = useState("Всі регіони");
  const [query, setQuery] = useState("");

  return (
    <div
      className={`flex items-center gap-3 ${
        compact ? "w-full" : "w-[90%] sm:w-[75%] md:w-[700px]"
      }`}
    >
      {/* === Кнопка регіону === */}
      <button
        className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all whitespace-nowrap border border-neutral-200 bg-white/80 backdrop-blur-md hover:bg-neutral-100
          ${compact ? "text-sm" : "text-[15px]"}
        `}
      >
        <MapPin size={18} strokeWidth={1.8} />
        <span className="font-medium">{region}</span>
      </button>

      {/* === Поле пошуку === */}
      <div className="relative flex-1">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Що шукаєш сьогодні?"
          className={`w-full rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#0056b3]/40 focus:outline-none transition-all
            ${compact ? "h-[48px] pl-11 pr-4 text-[15px]" : "h-[56px] pl-12 pr-4 text-[17px]"}
          `}
        />
      </div>
    </div>
  );
}
