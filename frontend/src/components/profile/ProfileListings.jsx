import { Link } from "react-router-dom";

export default function ProfileListings({ listings, title }) {
  return (
    <div>
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}

      {listings.length === 0 ? (
        <p className="text-gray-500">Немає оголошень</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ item }) {
  const img = item.images?.[0]?.url || "https://placehold.co/600x400";
  return (
    <Link
      to={`/listings/${item.id}`}
      className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform overflow-hidden block"
    >
      <img src={img} alt={item.title} className="h-40 w-full object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold truncate">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600">
            {new Intl.NumberFormat("uk-UA", {
              style: "currency",
              currency: "UAH",
              maximumFractionDigits: 0,
            }).format(item.price)}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString("uk-UA")}
          </span>
        </div>
      </div>
    </Link>
  );
}
