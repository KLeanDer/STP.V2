import { useState } from "react";
import { categories } from "@data/categories/categories.js"; // ✅ правильный импорт
import FiltersButton from "./FiltersButton";

// временная заглушка, если FiltersContext пока не создан
const defaultFiltersContext = {
  filters: {},
  setFilters: () => {},
};

// если контекст фильтров отсутствует — не ломаем компонент
let useFilters;
try {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useFilters = require("@context/FiltersContext").useFilters;
} catch {
  useFilters = () => defaultFiltersContext;
}

export default function FiltersPanel() {
  const { filters, setFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters || {});
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    setFilters(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    setFilters({});
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">Фільтри</h2>
        <FiltersButton open={open} setOpen={setOpen} />
      </div>

      <div className="grid gap-3">
        {/* === Категорія === */}
        <div>
          <label className="block text-sm font-medium mb-1">Категорія</label>
          <select
            className="w-full border rounded-lg p-2 bg-white"
            value={localFilters.category || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, category: e.target.value })
            }
          >
            <option value="">Усі категорії</option>
            {categories.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {c.sub?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* === Ціна === */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Від"
            className="w-full border rounded-lg p-2"
            value={localFilters.priceMin || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, priceMin: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="До"
            className="w-full border rounded-lg p-2"
            value={localFilters.priceMax || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, priceMax: e.target.value })
            }
          />
        </div>

        {/* === Місто === */}
        <div>
          <input
            type="text"
            placeholder="Місто"
            className="w-full border rounded-lg p-2"
            value={localFilters.city || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, city: e.target.value })
            }
          />
        </div>

        {/* === Доставка === */}
        <div className="flex items-center gap-2">
          <input
            id="delivery"
            type="checkbox"
            checked={localFilters.deliveryAvailable || false}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                deliveryAvailable: e.target.checked,
              })
            }
          />
          <label htmlFor="delivery" className="text-sm">
            З доставкою
          </label>
        </div>

        {/* === Кнопки === */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApply}
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:bg-neutral-800 transition"
          >
            Застосувати
          </button>
          <button
            onClick={handleReset}
            className="w-full border border-neutral-300 rounded-lg py-2 font-medium hover:bg-neutral-100 transition"
          >
            Очистити
          </button>
        </div>
      </div>
    </div>
  );
}
