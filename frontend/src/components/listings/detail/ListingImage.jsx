import { motion } from "framer-motion";

export default function ListingImage({ src, alt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl overflow-hidden border border-neutral-200 shadow-md"
    >
      <img src={src} alt={alt} className="w-full h-[440px] object-cover" />
    </motion.div>
  );
}
