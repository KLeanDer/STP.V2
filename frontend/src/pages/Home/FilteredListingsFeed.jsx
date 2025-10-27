import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFilters } from "@context/FiltersContext";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { getAllListings } from "@/api/listings";
import ListingCardVertical from "@components/common/ListingCard/ListingCardVertical";

const LIMIT = 24;

export default function FilteredListingsFeed() {
  const navigate = useNavigate();
  const { filters, resetFilters } = useFilters();
  const { categories } = useCategoryTree();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getAllListings({ ...filters, limit: LIMIT }, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setListings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err);
        setListings([]);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [filters]);

  const categoryLookup = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      map.set(category.id, category.name);
      (category.subcategories ?? []).forEach((sub) => {
        map.set(sub.id, sub.name);
      });
    });
    return map;
  }, [categories]);

  const summaryChips = useMemo(() => {
    const chips = [];

    if (filters.categoryId) {
      chips.push({ key: "category", label: categoryLookup.get(filters.categoryId) || "Обрана категорія" });
    }
    if (filters.subcategoryId) {
      chips.push({ key: "subcategory", label: categoryLookup.get(filters.subcategoryId) || "Обрана підкатегорія" });
    }
    if (filters.city) {
      chips.push({ key: "city", label: `Місто: ${filters.city}` });
    }
    if (typeof filters.priceMin === "number" && Number.isFinite(filters.priceMin)) {
      chips.push({
        key: "priceMin",
        label: `Від ${filters.priceMin.toLocaleString("uk-UA")} ₴`,
      });
    }
    if (typeof filters.priceMax === "number" && Number.isFinite(filters.priceMax)) {
      chips.push({
        key: "priceMax",
        label: `До ${filters.priceMax.toLocaleString("uk-UA")} ₴`,
      });
    }
    if (filters.deliveryAvailable) {
      chips.push({ key: "delivery", label: "Тільки з доставкою" });
    }

    return chips;
  }, [filters, categoryLookup]);

  const hasActiveFilters = summaryChips.length > 0;

  return (
    <section className="mt-[clamp(32px,5vw,80px)] px-[clamp(12px,3vw,64px)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            {hasActiveFilters ? "Знайдені товари" : "Останні оголошення"}
          </h2>
          <p className="text-sm text-neutral-500">
            {hasActiveFilters
              ? "Результати з урахуванням вибраних фільтрів."
              : "Показуємо свіжі пропозиції з маркетплейсу STP."}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Очистити всі
          </button>
        )}
      </div>

      {hasActiveFilters && summaryChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {summaryChips.map((chip) => (
            <span
              key={chip.key}
              className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-sm text-neutral-700"
            >
              {chip.label}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-neutral-500">Завантаження...</div>
      ) : error ? (
        <div className="py-10 text-center text-rose-500">
          Не вдалося завантажити оголошення. Спробуйте трохи пізніше.
        </div>
      ) : listings.length === 0 ? (
        <div className="py-10 text-center text-neutral-500">
          {hasActiveFilters
            ? "Нічого не знайдено за обраними фільтрами."
            : "Поки що немає опублікованих оголошень."}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {listings.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              <ListingCardVertical
                title={item.title}
                price={item.price}
                city={item.city}
                condition={item.condition}
                isOriginal={item.isOriginal}
                createdAt={item.createdAt}
                image={item.images?.[0]?.url}
                onClick={() => navigate(`/listings/${item.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
