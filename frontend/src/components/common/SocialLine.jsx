import { motion } from "framer-motion";
import { Send, Youtube, Music2 } from "lucide-react";

export default function SocialLine() {
  const socials = [
    {
      name: "Telegram",
      color: "#0088cc",
      icon: <Send size={17} strokeWidth={1.8} />,
      link: "#",
    },
    {
      name: "YouTube",
      color: "#ff0000",
      icon: <Youtube size={18} strokeWidth={1.8} />,
      link: "#",
    },
    {
      name: "TikTok",
      color: "#000000",
      icon: <Music2 size={17} strokeWidth={1.8} />,
      link: "#",
    },
  ];

  return (
    <div
      className="fixed top-[35vh] right-6 z-40 flex flex-col items-center select-none"
      style={{ willChange: "transform" }}
    >
      {/* Заголовок */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[13px] font-semibold tracking-[2px] uppercase mb-4 text-center"
      >
        <span className="text-[#0056b3]">соцмережі</span>{" "}
        <span className="text-black font-extrabold">STP</span>
      </motion.h3>

      {/* Соцмережі */}
      <div className="flex flex-col items-center gap-3">
        {socials.map((s, i) => (
          <motion.a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
            whileHover={{ scale: 1.06, y: -2 }}
            style={{
              backgroundColor: s.color,
              width: "160px",
            }}
            className="flex items-center justify-center gap-2 text-white py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            {s.icon}
            <span className="text-sm font-semibold">{s.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
