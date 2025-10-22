import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImagePreviewModal({ images = [], index = 0, setIndex, onClose }) {
  const currentImage = images[index];
  if (!currentImage) return null;

  // === Обработка клавиш ===
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, setIndex, onClose]);

  // === Само окно ===
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px]
                 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition"
      >
        <X size={26} />
      </button>

      {/* Фото */}
      <div
        className="relative max-w-[92vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt="preview"
          className="max-h-[80vh] max-w-[92vw] object-contain rounded-lg select-none shadow-2xl"
        />

        {/* Стрелки */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-[-60px] text-white/90 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-[-60px] text-white/90 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition"
            >
              <ChevronRight size={30} />
            </button>
          </>
        )}
      </div>

      {/* Миниатюры снизу */}
      {images.length > 1 && (
        <div
          className="mt-8 flex gap-3 overflow-x-auto px-6 pb-3"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className={`w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer transition-all
                ${
                  i === index
                    ? "border-white"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              onClick={() => setIndex(i)}
            >
              <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // === ВАЖНО: рендерим модалку в body, а не внутри страницы ===
  return createPortal(modalContent, document.body);
}
