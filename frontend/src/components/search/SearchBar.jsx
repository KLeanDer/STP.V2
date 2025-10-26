import { useState, useEffect } from "react";

export default function SearchBar({
  onSearch,
  initialQuery = "",
  placeholder = "🔍 Пошук товарів...",
  autoFocus = false,
  delay = 400,
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (typeof onSearch !== "function") return;
    const handle = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => clearTimeout(handle);
  }, [query, onSearch, delay]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full p-3 rounded-2xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
