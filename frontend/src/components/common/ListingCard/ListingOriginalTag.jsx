import { Info } from "lucide-react";

export default function ListingOriginalTag({ isOriginal }) {
  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => {
        const tip = e.currentTarget.querySelector(".tooltip");
        if (tip) {
          tip.style.opacity = "1";
          tip.style.visibility = "visible";
        }
      }}
      onMouseLeave={(e) => {
        const tip = e.currentTarget.querySelector(".tooltip");
        if (tip) {
          tip.style.opacity = "0";
          tip.style.visibility = "hidden";
        }
      }}
    >
      <span className="relative px-2 py-[2px] rounded-md bg-neutral-50 border border-neutral-200 text-neutral-700 text-[11.5px] font-medium whitespace-nowrap truncate max-w-[110px]">
        {isOriginal ? "Оригінал" : "Репліка"}
      </span>

      {isOriginal && (
        <div
          className="tooltip fixed z-50 opacity-0 invisible left-1/2 -translate-x-1/2 mt-2
                      w-[230px] text-[12px] text-neutral-700 bg-white border border-neutral-200
                      shadow-md rounded-lg p-2 transition-opacity duration-150"
        >
          <div className="flex items-start gap-1.5">
            <Info size={14} className="text-neutral-500 mt-[1px]" />
            <span>
              Це уточнення надав продавець. Завжди перевіряйте інформацію перед покупкою.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
