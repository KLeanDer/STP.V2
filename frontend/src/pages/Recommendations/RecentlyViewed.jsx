import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NoImage from "../../components/common/NoImage";

export default function RecentlyViewed({ listings = [] }) {
  const navigate = useNavigate();

  if (!listings.length) {
    return (
      <div className="flex justify-center py-10">
        <NoImage text="Поки що немає переглядів" type="listing" />
      </div>
    );
  }

  const handleClick = (listingId) => {
    navigate(`/listings/${listingId}`); // 👈 только переход
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {listings.map((item, i) => (
        <motion.div
          key={item.id || i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div
            onClick={() => handleClick(item.id)}
            className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-neutral-100 hover:border-blue-400 overflow-hidden"
          >
            {item.images?.[0]?.url ? (
              <img
                src={item.images[0].url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <NoImage size="compact" />
            )}
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2 mb-1 text-neutral-800">
                {item.title}
              </h3>
              <p className="text-blue-700 font-semibold text-sm">
                {item.price ? `${item.price.toLocaleString()} грн` : "—"}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
