import { useEffect, useState, useRef } from "react";
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import FooterSection from "./FooterSection";
import SocialLine from "@components/common/SocialLine";
import SearchBarGlobal from "@components/layout/SearchBarGlobal";
import BackgroundWrapper from "@components/layout/BackgroundWrapper";
import RecommendationsCompact from "@components/recommendations/RecommendationsCompact";
import FiltersPanel from "@components/common/Filters/FiltersPanel.jsx";
import { Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [filtersHover, setFiltersHover] = useState(false);
  const [filtersPinned, setFiltersPinned] = useState(false);
  const heroRef = useRef(null);

  // === Контроль прокрутки ===
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const navType = window.performance.getEntriesByType("navigation")[0]?.type || "";
    if (navType === "reload") window.scrollTo(0, 0);
    else window.history.scrollRestoration = "auto";
  }, []);

  // === Показ верхнего поиска ===
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!heroRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const heroBottom = heroRef.current.getBoundingClientRect().bottom;
          setShowSearchBar(heroBottom <= 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === Закрытие по клику вне панели ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target.closest("#filters-panel") ||
        e.target.closest("#filters-button")
      )
        return;
      setFiltersHover(false);
      setFiltersPinned(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <BackgroundWrapper>
      <div className="flex flex-col min-h-screen overflow-x-hidden text-neutral-900 transition-colors duration-300">
        <main className="flex-grow relative">
          {/* === Верхняя панель === */}
          <div className="flex justify-center items-center gap-3 fixed top-0 left-0 right-0 z-[60] px-[clamp(12px,3vw,64px)]">
            <SearchBarGlobal visible={showSearchBar} />
            <div
              id="filters-button"
              onMouseEnter={() => !filtersPinned && setFiltersHover(true)}
              onMouseLeave={() => !filtersPinned && setFiltersHover(false)}
            >
              <button
                onClick={() => setFiltersPinned((v) => !v)}
                className="relative flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-neutral-300 rounded-full shadow-md hover:bg-neutral-100 transition"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Фільтри</span>
              </button>
            </div>
          </div>

          {/* === Соцсети справа === */}
          <div className="fixed right-[clamp(8px,2vw,40px)] top-[20%] z-30 space-y-3">
            <SocialLine />
          </div>

          {/* === Hero + рекомендации === */}
          <div
            ref={heroRef}
            className="relative flex justify-center items-start mt-10 
                       w-full max-w-[90rem] mx-auto px-[clamp(12px,3vw,64px)]"
          >
            <div
              className="absolute top-0 hidden 2xl-plus:block"
              style={{
                left: "clamp(-180px,-10vw,-240px)",
                transform: "translateX(-60px)",
              }}
            >
              <RecommendationsCompact large />
            </div>
            <div className="flex justify-center w-full max-w-[1200px] px-[clamp(8px,2vw,24px)]">
              <HeroSection />
            </div>
          </div>

          {/* === Категории === */}
          <div className="mt-[clamp(32px,5vw,80px)] px-[clamp(12px,3vw,64px)]">
            <CategoriesSection />
          </div>
        </main>

        {/* === Футер === */}
        <FooterSection />
      </div>

      {/* === Панель фильтров (справа) === */}
      <AnimatePresence>
        {(filtersHover || filtersPinned) && (
          <motion.div
            id="filters-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-2xl border-l border-neutral-200 z-[70] rounded-l-2xl p-5"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Фільтри</h2>
              <button
                onClick={() => {
                  setFiltersHover(false);
                  setFiltersPinned(false);
                }}
                className="text-sm text-neutral-500 hover:text-neutral-800"
              >
                ✕
              </button>
            </div>
            <FiltersPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </BackgroundWrapper>
  );
}
