import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 400); // 🔹 задержка для "живого" поиска
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Пошук товарів..."
        className="w-full p-3 rounded-2xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
