import { useEffect, useMemo, useState } from "react";
import FiltersButton from "./FiltersButton";
import { useFilters } from "@context/FiltersContext";
import { useCategoryTree } from "@/hooks/useCategoryTree";

const initialLocalState = {
  categoryId: "",
  subcategoryId: "",
  priceMin: "",
  priceMax: "",
  city: "",
  deliveryAvailable: false,
};

function normalizeFromFilters(filters) {
  return {
    categoryId: filters.categoryId ?? "",
    subcategoryId: filters.subcategoryId ?? "",
    priceMin:
      typeof filters.priceMin === "number" && Number.isFinite(filters.priceMin)
        ? String(filters.priceMin)
        : "",
    priceMax:
      typeof filters.priceMax === "number" && Number.isFinite(filters.priceMax)
        ? String(filters.priceMax)
        : "",
    city: filters.city ?? "",
    deliveryAvailable: Boolean(filters.deliveryAvailable),
  };
}

export default function FiltersPanel() {
  const { filters, setFilters, resetFilters } = useFilters();
  const { categories, loading, error } = useCategoryTree();
  const [localFilters, setLocalFilters] = useState(() =>
    normalizeFromFilters(filters || {}),
  );
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setLocalFilters(normalizeFromFilters(filters || {}));
  }, [filters]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === localFilters.categoryId),
    [categories, localFilters.categoryId],
  );

  const subcategories = selectedCategory?.subcategories ?? [];

  const handleApply = () => {
    const priceMinValue = localFilters.priceMin.trim();
    const priceMaxValue = localFilters.priceMax.trim();

    const parsedMin = priceMinValue === "" ? undefined : Number(priceMinValue);
    const parsedMax = priceMaxValue === "" ? undefined : Number(priceMaxValue);

    const nextFilters = {
      categoryId: localFilters.categoryId || undefined,
      subcategoryId: localFilters.subcategoryId || undefined,
      priceMin:
        parsedMin !== undefined && Number.isFinite(parsedMin) ? parsedMin : undefined,
      priceMax:
        parsedMax !== undefined && Number.isFinite(parsedMax) ? parsedMax : undefined,
      city: localFilters.city.trim() || undefined,
      deliveryAvailable: localFilters.deliveryAvailable ? true : undefined,
    };

    if (
      typeof nextFilters.priceMin === "number" &&
      typeof nextFilters.priceMax === "number" &&
      nextFilters.priceMin > nextFilters.priceMax
    ) {
      const min = nextFilters.priceMax;
      nextFilters.priceMax = nextFilters.priceMin;
      nextFilters.priceMin = min;
    }

    setFilters(nextFilters);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(initialLocalState);
    resetFilters();
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-medium">Фільтри</h2>
          {error && (
            <p className="text-xs text-rose-500 mt-1">
              Не вдалося завантажити категорії. Спробуйте пізніше.
            </p>
          )}
        </div>
        <FiltersButton open={open} setOpen={setOpen} />
      </div>

      {open && (
        <div className="grid gap-3">
          {/* === Категорія === */}
          <div>
            <label className="block text-sm font-medium mb-1">Категорія</label>
            <select
              className="w-full border rounded-lg p-2 bg-white"
              value={localFilters.categoryId}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                  subcategoryId: "",
                }))
              }
              disabled={loading}
            >
              <option value="">Усі категорії</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* === Підкатегорія === */}
          {subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Підкатегорія</label>
              <select
                className="w-full border rounded-lg p-2 bg-white"
                value={localFilters.subcategoryId}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    subcategoryId: e.target.value,
                  }))
                }
              >
                <option value="">Усі підкатегорії</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* === Ціна === */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Від"
              className="w-full border rounded-lg p-2"
              value={localFilters.priceMin}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, priceMin: e.target.value }))
              }
              min="0"
            />
            <input
              type="number"
              placeholder="До"
              className="w-full border rounded-lg p-2"
              value={localFilters.priceMax}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, priceMax: e.target.value }))
              }
              min="0"
            />
          </div>

          {/* === Місто === */}
          <div>
            <input
              type="text"
              placeholder="Місто"
              className="w-full border rounded-lg p-2"
              value={localFilters.city}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>

          {/* === Доставка === */}
          <div className="flex items-center gap-2">
            <input
              id="delivery"
              type="checkbox"
              checked={localFilters.deliveryAvailable}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  deliveryAvailable: e.target.checked,
                }))
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
      )}
    </div>
  );
}
