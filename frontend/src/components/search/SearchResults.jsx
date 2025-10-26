import { Loader2, Search as SearchIcon } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ListingCardVertical from "../common/ListingCard/ListingCardVertical";

function extractImage(hit) {
  if (!hit) return undefined;
  if (hit.image) return hit.image;
  if (hit.coverImage) return hit.coverImage;
  if (hit.previewImageUrl) return hit.previewImageUrl;
  if (hit.thumbnailUrl) return hit.thumbnailUrl;
  if (Array.isArray(hit.images) && hit.images.length) {
    const first = hit.images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return first.url || first.imageUrl || first.src;
    }
  }
  if (Array.isArray(hit.photos) && hit.photos.length) {
    const first = hit.photos[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return first.url || first.imageUrl || first.src;
    }
  }
  return undefined;
}

export default function SearchResults({
  results = [],
  total = 0,
  processingTimeMs,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  facets = {},
  query = "",
}) {
  const navigate = useNavigate();
  const formattedTotal = useMemo(
    () => total.toLocaleString("uk-UA"),
    [total]
  );

  const showSkeleton = loading && !results.length;
  const hasNoResults = !loading && results.length === 0;

  const topCategories = useMemo(() => {
    const facet = facets?.category;
    if (!facet) return [];
    return Object.entries(facet)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([value, count]) => ({ value, count }));
  }, [facets]);

  const topCities = useMemo(() => {
    const facet = facets?.city;
    if (!facet) return [];
    return Object.entries(facet)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([value, count]) => ({ value, count }));
  }, [facets]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {formattedTotal} результатів
            {query ? (
              <span className="text-neutral-500"> для "{query}"</span>
            ) : null}
          </h1>
          {typeof processingTimeMs === "number" ? (
            <p className="text-sm text-neutral-500">
              Пошук зайняв {processingTimeMs} мс
            </p>
          ) : null}
        </div>
      </header>

      {showSkeleton ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[320px] rounded-3xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="h-1/2 animate-pulse rounded-t-3xl bg-neutral-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!showSkeleton && !hasNoResults ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((hit) => (
            <ListingCardVertical
              key={hit.id}
              title={hit.title}
              price={hit.price}
              city={hit.city}
              condition={hit.condition}
              isOriginal={hit.isOriginal}
              createdAt={hit.createdAt}
              image={extractImage(hit)}
              onClick={() => navigate(`/listings/${hit.id}`)}
            />
          ))}
        </div>
      ) : null}

      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <SearchIcon size={32} className="mb-4 text-neutral-400" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Ми не знайшли оголошення за вашим запитом
          </h2>
          <p className="max-w-xl text-sm text-neutral-500">
            Спробуйте змінити ключові слова або послабити фільтри. Нижче — популярні варіанти, які шукають інші користувачі.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[...topCategories, ...topCities].map((item, index) => (
              <span
                key={`${item.value}-${index}`}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-sm text-neutral-600"
              >
                {item.value} · {item.count.toLocaleString("uk-UA")}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {hasMore ? (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {loadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {loadingMore ? "Завантажуємо..." : "Показати ще"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
