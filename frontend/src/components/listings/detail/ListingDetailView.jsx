import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingRightPanel from "./ListingRightPanel";
import {
  ListingHeader,
  ListingDescription,
  ListingImage,
  ListingSellerInfo,
  ListingSellerActions,
  ListingBuyerInfo,
  ListingBuyerActions,
} from "./index";
import NoImage from "../../common/NoImage"; // 👈 добавляем компонент заглушки

export default function ListingDetailView({ listing, user, setListing }) {
  const navigate = useNavigate();
  const isOwner = user && listing.user && user.id === listing.user.id;
  const hasImage = listing.images && listing.images.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Назад */}
      <motion.button
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#0056b3] hover:underline mb-8 font-medium"
      >
        <ArrowLeft size={18} /> Назад
      </motion.button>

      {/* Две колонки */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT: контент */}
        <div className="flex-1 min-w-0">
          {hasImage ? (
            <ListingImage src={listing.images[0].url} alt={listing.title} />
          ) : (
            <NoImage text="Немає фото" ratioClassName="aspect-[16/9]" />
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-md mt-10 p-8 rounded-3xl border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <ListingHeader
              title={listing.title}
              price={listing.price}
              views={listing.views}
            />

            <ListingDescription description={listing.description} />

            {listing.user && (
              <>
                {isOwner ? (
                  <>
                    <ListingSellerInfo seller={listing.user} />
                    <ListingSellerActions
                      listing={listing}
                      setListing={setListing}
                      onEdit={() => navigate(`/listings/${listing.id}/edit`)}
                    />
                  </>
                ) : (
                  <>
                    <ListingBuyerInfo seller={listing.user} />
                    <ListingBuyerActions listing={listing} />
                  </>
                )}
              </>
            )}

            <p className="mt-10 text-xs text-neutral-400 text-right">
              Опубліковано:{" "}
              {new Date(listing.createdAt).toLocaleDateString("uk-UA")}
            </p>
          </motion.div>
        </div>

        {/* RIGHT: панель */}
        <div className="w-full lg:w-[360px] min-w-[300px] shrink-0">
          <ListingRightPanel related={listing.related || []} />
        </div>
      </div>
    </section>
  );
}
