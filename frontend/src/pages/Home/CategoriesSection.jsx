import { motion } from "framer-motion";
import {
  Smartphone,
  Car,
  Home as HomeIcon,
  Shirt,
  Baby,
  Dumbbell,
  Briefcase,
  Armchair,
  Wrench,
  Flame,
  Grid,
} from "lucide-react";

export default function CategoriesSection() {
  const primary = "#0056b3";
  const categories = [
    { icon: <Smartphone size={28} strokeWidth={1.8} color={primary} />, title: "Електроніка" },
    { icon: <Car size={28} strokeWidth={1.8} color={primary} />, title: "Авто" },
    { icon: <HomeIcon size={28} strokeWidth={1.8} color={primary} />, title: "Нерухомість" },
    { icon: <Shirt size={28} strokeWidth={1.8} color={primary} />, title: "Мода" },
    { icon: <Baby size={28} strokeWidth={1.8} color={primary} />, title: "Діти" },
    { icon: <Dumbbell size={28} strokeWidth={1.8} color={primary} />, title: "Спорт" },
    { icon: <Briefcase size={28} strokeWidth={1.8} color={primary} />, title: "Робота" },
    { icon: <Armchair size={28} strokeWidth={1.8} color={primary} />, title: "Дім" },
    { icon: <Wrench size={28} strokeWidth={1.8} color={primary} />, title: "Послуги" },
    { icon: <Flame size={28} strokeWidth={1.8} color={primary} />, title: "Тренди" },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      {/* === Заголовок === */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-2xl font-semibold text-neutral-900 mb-5 text-center flex items-center justify-center gap-2"
      >
        <Grid size={24} strokeWidth={2} color={primary} />
        Категорії
      </motion.h2>

      {/* === Мягкая разделительная линия === */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "220px", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-[1.5px] bg-gradient-to-r from-transparent via-[#0056b3]/50 to-transparent mb-10 mx-auto rounded-full"
      />

      {/* === Сетка категорий === */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.22, 0.61, 0.36, 1],
                },
              },
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: "0 8px 20px rgba(0,80,180,0.15)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-[#0056b3]/50 transition-all cursor-pointer select-none"
          >
            <div className="mb-2">{cat.icon}</div>
            <p className="text-[13px] font-medium text-neutral-700">{cat.title}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
