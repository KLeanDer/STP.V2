import { motion } from "framer-motion";
import SearchBarMain from "../common/SearchBarMain";

export default function SearchBarGlobal({ visible }) {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-[64px] left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm px-4 py-3 flex justify-center"
    >
      <div className="max-w-6xl w-full">
        <SearchBarMain compact />
      </div>
    </motion.div>
  );
}
