// src/components/chat/ChatAdCard.jsx
import { Link } from "react-router-dom";

export default function ChatAdCard({ listing }) {
  if (!listing) return null;

  const cover = listing.images?.[0] || "/placeholder.jpg";

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3 hover:shadow-md transition"
    >
      {/* Фото */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={cover}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Информация */}
      <div className="flex flex-col overflow-hidden">
        <span className="truncate font-medium text-gray-900 hover:text-blue-600">
          {listing.title}
        </span>

        <span className="text-sm text-gray-500">
          {listing.location || "Регіон не вказано"}
        </span>

        <span className="mt-1 text-lg font-bold text-green-600">
          {listing.price} ₴
        </span>
      </div>

      {/* Кнопка справа */}
      <div className="ml-auto">
        <span className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 transition">
          Переглянути
        </span>
      </div>
    </Link>
  );
}
