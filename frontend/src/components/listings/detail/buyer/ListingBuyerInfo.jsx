import { Link } from "react-router-dom";

export default function ListingBuyerInfo({ seller }) {
  return (
    <div className="flex items-center gap-4 mb-6 bg-[#f9fafc] p-4 rounded-2xl border border-neutral-200">
      <img
        src={seller.avatarUrl || "https://i.pravatar.cc/100"}
        alt={seller.name}
        className="w-16 h-16 rounded-full border border-neutral-300 object-cover"
      />
      <div>
        <p className="font-semibold text-lg">{seller.name}</p>
        <Link
          to={`/profile/${seller.id}`}
          className="text-[#0056b3] text-sm hover:underline"
        >
          Переглянути профіль продавця
        </Link>
      </div>
    </div>
  );
}
