import { MapPin, Box as BoxIcon, Heart } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ListingOriginalTag from "./ListingOriginalTag";

function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const time = d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  const monthNames = [
    "січня","лютого","березня","квітня","травня","червня",
    "липня","серпня","вересня","жовтня","листопада","грудня"
  ];
  return `${time} · ${d.getDate()} ${monthNames[d.getMonth()]}`;
}

function translateCondition(value) {
  switch (value) {
    case "new": return "Новий";
    case "used_like_new": return "Б/в як новий";
    case "used_minor": return "Б/в з незначними нюансами";
    case "used_with_issues": return "Б/в з нюансами";
    default: return "Невідомий стан";
  }
}

function Photo({ src, title }) {
  return (
    <div className="relative w-full h-full bg-neutral-100 overflow-hidden rounded-xl">
      {src ? (
        <img src={src} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
          <BoxIcon size={32} className="mb-1 text-[#3b82f6]" />
          <span className="text-[13px]">Немає фото</span>
        </div>
      )}
    </div>
  );
}

function useTwoLineEllipsis(text) {
  const ref = useRef(null);
  const [clamped, setClamped] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clamp = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      const maxH = lh * 2.05;
      if (el.scrollHeight > maxH) {
        let t = text;
        while (t.length > 0 && el.scrollHeight > maxH) {
          t = t.slice(0, -1);
          el.textContent = t + "…";
        }
        setClamped(t + "…");
      } else setClamped(text);
    };
    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [text]);

  return { ref, clamped };
}

export default function ListingCardVertical({
  title = "Назва оголошення",
  price,
  city = "Київ",
  condition = "new",
  isOriginal = true,
  createdAt,
  image,
  onClick,
}) {
  const formattedDate = formatDateTime(createdAt);
  const translatedCondition = translateCondition(condition);
  const { ref, clamped } = useTwoLineEllipsis(title);

  const chipBase =
    "relative px-2 py-[2px] rounded-md bg-neutral-50 border border-neutral-200 text-neutral-700 text-[11.5px] font-medium whitespace-nowrap truncate";

  const conditionTag = (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <span className={`${chipBase} max-w-[160px]`} title={translatedCondition}>
        {translatedCondition}
      </span>
    </div>
  );

  return (
    <div
      onClick={onClick}
      className="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-[2px] w-[275px]"
    >
      <div className="p-3 pb-0">
        <div className="w-full aspect-[4/3]">
          <Photo src={image} title={title} />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 min-h-[148px]">
        <div className="flex items-start justify-between">
          <h3
            ref={ref}
            className="font-medium text-neutral-900 text-[15px] leading-snug break-words overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              maxHeight: "2.7em",
            }}
          >
            {clamped}
          </h3>
          <LikeButton />
        </div>

        {/* Ціна — як на картинці, але з "грн" */}
        <div className="text-[17px] font-bold text-neutral-900 tracking-tight leading-none mt-[2px]">
          {price ? `${price.toLocaleString("uk-UA")} грн` : "—"}
        </div>

        <div className="flex items-center gap-2 mt-1 flex-nowrap overflow-hidden">
          {conditionTag}
          <ListingOriginalTag isOriginal={isOriginal} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[12.5px]">
            <MapPin size={13} />
            <span>{city}</span>
          </div>
          <div className="text-neutral-400 text-[12px]">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}

function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setLiked((p) => !p);
      }}
      className="p-1 rounded-md hover:bg-neutral-100 transition ml-2 shrink-0"
      aria-label="Вподобати"
      title={liked ? "Прибрати з вподобаних" : "Додати в уподобання"}
    >
      <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-neutral-500"} />
    </button>
  );
}
