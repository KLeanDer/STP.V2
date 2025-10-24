import { MapPin, Box as BoxIcon } from "lucide-react";
import ListingOriginalTag from "./ListingOriginalTag";

export default function ListingCardHorizontal({
  title = "Назва оголошення",
  description = "",
  price,
  city = "Київ",
  condition = "new",
  isOriginal = true,
  createdAt,
  image,
  onClick,
}) {
  const monthNames = ["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
  const d = new Date(createdAt);
  const formattedDate = `${d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} · ${d.getDate()} ${monthNames[d.getMonth()]}`;

  const translateCondition = (v) =>
    v === "new" ? "Новий" :
    v === "used_like_new" ? "Б/в як новий" :
    v === "used_minor" ? "Б/в з незначними нюансами" :
    v === "used_with_issues" ? "Б/в з нюансами" : "Невідомий стан";

  const chip =
    "px-2 py-[2px] rounded-md bg-neutral-50 border border-neutral-200 text-neutral-700 text-[11.5px] font-medium whitespace-nowrap truncate";

  return (
    <div onClick={onClick} className="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 p-3 sm:p-4 hover:-translate-y-[2px]">
      <div className="w-40 h-40 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
        {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : (
          <div className="flex flex-col items-center justify-center w-full h-full text-neutral-400">
            <BoxIcon size={32} className="mb-1 text-[#3b82f6]" />
            <span className="text-[13px]">Немає фото</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="min-w-0">
          <h3 className="font-semibold text-neutral-900 text-[15.5px] leading-tight mb-1 line-clamp-1">{title}</h3>
          <div className="text-[17px] font-medium text-neutral-900 mb-2">
            {price ? `${price.toLocaleString("uk-UA")} ₴` : "—"}
          </div>
          <div className="flex items-center gap-2 mb-2 flex-nowrap overflow-hidden">
            <span className={chip}>{translateCondition(condition)}</span>
            <ListingOriginalTag isOriginal={isOriginal} />
          </div>
          {description && (
            <p className="text-[13px] text-neutral-600 line-clamp-2 leading-snug">{description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[12.5px]">
            <MapPin size={13} /><span>{city}</span>
          </div>
          <div className="text-neutral-400 text-[12px]">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}
