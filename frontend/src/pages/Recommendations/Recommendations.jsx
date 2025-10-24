import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ListingCardVertical from "../../components/common/ListingCard/ListingCardVertical";
import ListingCardHorizontal from "../../components/common/ListingCard/ListingCardHorizontal";
import NoImage from "../../components/common/NoImage";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function Recommendations({ listings = [] }) {
  const navigate = useNavigate();
  const [layout, setLayout] = useState("vertical"); // "vertical" | "horizontal"

  if (!listings.length) {
    return (
      <div className="flex justify-center py-10">
        <NoImage text="Немає товарів для відображення" type="listing" />
      </div>
    );
  }

  const handleOpen = (id) => navigate(`/listings/${id}`);

  return (
    <div className="space-y-6">
      {/* Перемикач формату */}
      <div className="flex justify-end pr-2">
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl p-1">
          <button
            onClick={() => setLayout("vertical")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              layout === "vertical"
                ? "bg-white shadow-sm border border-neutral-200 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <LayoutGrid size={16} /> Сітка
          </button>
          <button
            onClick={() => setLayout("horizontal")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              layout === "horizontal"
                ? "bg-white shadow-sm border border-neutral-200 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <LayoutList size={16} /> Список
          </button>
        </div>
      </div>

      {/* Карточки */}
      <div
        className={
          layout === "vertical"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5"
            : "flex flex-col gap-4"
        }
      >
        {listings.map((item, i) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            {layout === "vertical" ? (
              <ListingCardVertical
                title={item.title}
                price={item.price}
                city={item.city}
                condition={item.condition}
                isOriginal={item.isOriginal}
                createdAt={item.createdAt}
                image={item.images?.[0]?.url}
                onClick={() => handleOpen(item.id)}
              />
            ) : (
              <ListingCardHorizontal
                title={item.title}
                price={item.price}
                city={item.city}
                condition={item.condition}
                isOriginal={item.isOriginal}
                createdAt={item.createdAt}
                image={item.images?.[0]?.url}
                onClick={() => handleOpen(item.id)}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
