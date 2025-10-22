import { Eye } from "lucide-react";

export default function ListingHeader({ title, price, views }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <span className="text-3xl font-extrabold text-[#0056b3] drop-shadow-sm">
          {new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
          }).format(price)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Eye size={18} /> {views ?? 0} переглядів
      </div>
    </div>
  );
}
