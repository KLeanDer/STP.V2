import { useEffect, useState, useRef } from "react";
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import FooterSection from "./FooterSection";
import SocialLine from "../../components/common/SocialLine";
import SearchBarGlobal from "../../components/layout/SearchBarGlobal";
import BackgroundWrapper from "../../components/layout/BackgroundWrapper";
import RecommendationsCompact from "../../components/recommendations/RecommendationsCompact";

export default function Home() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const heroRef = useRef(null);

  // === Управление скроллом ===
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navType =
      window.performance.getEntriesByType("navigation")[0]?.type || "";

    if (navType === "reload") {
      window.scrollTo(0, 0);
    } else {
      window.history.scrollRestoration = "auto";
    }
  }, []);

  // === Показ верхнего поиска при скролле ===
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

  return (
    <BackgroundWrapper>
      <div className="flex flex-col min-h-screen overflow-x-hidden text-neutral-900 transition-colors duration-300">
        <main className="flex-grow relative">
          {/* === Фиксированный поиск === */}
          <SearchBarGlobal visible={showSearchBar} />

          {/* === Соцсети справа (высокая фиксация) === */}
          <div className="fixed right-[clamp(8px,2vw,40px)] top-[20%] z-40 space-y-3">
            <SocialLine />
          </div>

          {/* === Hero + рекомендации === */}
          <div
            ref={heroRef}
            className="relative flex justify-center items-start mt-10 
                       w-full max-w-[90rem] mx-auto px-[clamp(12px,3vw,64px)]"
          >
            {/* Левая колонка — блок рекомендаций (≥1850px) */}
            <div
              className="absolute top-0 hidden 2xl-plus:block"
              style={{
                left: "clamp(-180px,-10vw,-240px)",
                transform: "translateX(-60px)",
              }}
            >
              <RecommendationsCompact large />
            </div>

            {/* Центральная часть */}
            <div className="flex justify-center w-full max-w-[1200px] px-[clamp(8px,2vw,24px)]">
              <HeroSection />
            </div>
          </div>

          {/* === Остальные секции === */}
          <div className="mt-[clamp(32px,5vw,80px)] px-[clamp(12px,3vw,64px)]">
            <CategoriesSection />
          </div>
        </main>

        {/* === Футер === */}
        <FooterSection />
      </div>
    </BackgroundWrapper>
  );
}
