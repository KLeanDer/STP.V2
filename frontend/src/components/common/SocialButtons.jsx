import { motion } from "framer-motion";

export default function SocialLine() {
  return (
    <div className="hidden lg:flex flex-col items-center fixed top-1/4 right-6 z-40 select-none">
      {/* Верхняя линия */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "6rem" }}
        transition={{ duration: 0.8 }}
        className="w-[2px] bg-[#0056b3]/50 rounded-full mb-3"
      />

      {/* Текстовые ссылки */}
      <div className="flex flex-col gap-4 text-sm font-medium text-neutral-600 tracking-wide">
        <a
          href="#"
          className="hover:text-[#0056b3] transition-all rotate-90 origin-right"
          style={{ marginRight: "-1.8rem" }}
        >
          наш Telegram
        </a>
        <a
          href="#"
          className="hover:text-[#0056b3] transition-all rotate-90 origin-right"
          style={{ marginRight: "-1.8rem" }}
        >
          наш YouTube
        </a>
        <a
          href="#"
          className="hover:text-[#0056b3] transition-all rotate-90 origin-right"
          style={{ marginRight: "-1.8rem" }}
        >
          наш TikTok
        </a>
      </div>

      {/* Нижняя линия */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "6rem" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-[2px] bg-[#0056b3]/50 rounded-full mt-3"
      />
    </div>
  );
}
