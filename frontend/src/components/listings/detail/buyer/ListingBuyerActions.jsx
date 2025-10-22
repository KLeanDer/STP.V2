import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, ShoppingBag } from "lucide-react";

export default function ListingBuyerActions({ listing }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        to={`/chat/start?sellerId=${listing.user.id}&listingId=${listing.id}`}
        className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#0056b3] text-white text-sm hover:bg-[#00449b] transition"
      >
        <MessageCircle size={16} /> Написати продавцю
      </Link>
      <button
        onClick={() => navigate(`/listings/${listing.id}/order`)}
        className="flex items-center gap-2 px-6 py-2 rounded-full bg-green-600 text-white text-sm hover:bg-green-500 transition"
      >
        <ShoppingBag size={16} /> Замовити
      </button>
    </div>
  );
}
