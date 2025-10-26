import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import SearchBar from "../../components/search/SearchBar";
import FilterSidebar from "../../components/search/FilterSidebar";
import SearchResults from "../../components/search/SearchResults";
import { searchListings } from "../../api/search.api";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "", label: "За релевантністю" },
  { value: "price:asc", label: "Ціна: від найнижчої" },
  { value: "price:desc", label: "Ціна: від найвищої" },
  { value: "createdAt:desc", label: "Нові спочатку" },
  { value: "createdAt:asc", label: "Старі спочатку" },
  { value: "views:desc", label: "Найпопулярніші" },
  { value: "favorites:desc", label: "В обраних" },
];

function sanitizeFilters(input) {
  if (!input || typeof input !== "object") return {};
  const sortedKeys = Object.keys(input).sort();
  const result = {};

  for (const key of sortedKeys) {
    const value = input[key];

    if (Array.isArray(value)) {
      const cleaned = value
        .map((item) => {
          if (item === null || item === undefined || item === "") return null;
          if (typeof item === "boolean") return item ? "true" : "false";
          const str = String(item).trim();
          return str ? str : null;
        })
        .filter((item) => item !== null);

      if (cleaned.length) {
        const unique = Array.from(new Set(cleaned));
        unique.sort((a, b) => a.localeCompare(b, "uk", { numeric: true, sensitivity: "base" }));
        result[key] = unique;
      }
      continue;
    }

    if (value && typeof value === "object") {
      const next = {};
      if (value.min !== undefined && value.min !== null && value.min !== "") {
        const minNumber = Number(value.min);
        next.min = Number.isNaN(minNumber) ? Number(value.min) : minNumber;
      }
      if (value.max !== undefined && value.max !== null && value.max !== "") {
        const maxNumber = Number(value.max);
        next.max = Number.isNaN(maxNumber) ? Number(value.max) : maxNumber;
      }
      if (Object.keys(next).length) {
        result[key] = next;
      }
      continue;
    }

    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "boolean") {
        result[key] = value ? "true" : "false";
      } else {
        const str = String(value).trim();
        if (str) result[key] = str;
      }
    }
  }

  return result;
}

function parseFiltersParam(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return sanitizeFilters(parsed);
  } catch {
    return {};
  }
}

function areFiltersEqual(left, right) {
  return JSON.stringify(sanitizeFilters(left)) === JSON.stringify(sanitizeFilters(right));
}

function countActiveFilters(filters) {
  return Object.entries(filters).reduce((acc, [_, value]) => {
    if (Array.isArray(value)) {
      return acc + value.length;
    }
    if (value && typeof value === "object") {
      return acc + (value.min !== undefined || value.max !== undefined ? 1 : 0);
    }
    return acc + 1;
  }, 0);
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState({});
  const [processingTime, setProcessingTime] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const hydratedRef = useRef(false);

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    const sortParam = searchParams.get("sort") || "";
    const filtersParam = parseFiltersParam(searchParams.get("filters"));

    setQuery((prev) => (prev === qParam ? prev : qParam));
    setSortKey((prev) => (prev === sortParam ? prev : sortParam));
    setFilters((prev) => (areFiltersEqual(prev, filtersParam) ? prev : filtersParam));

    hydratedRef.current = true;
  }, [searchParamsString, searchParams]);

  const filtersString = useMemo(() => {
    return Object.keys(filters).length ? JSON.stringify(filters) : "";
  }, [filters]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("q", query);
    if (filtersString) nextParams.set("filters", filtersString);
    if (sortKey) nextParams.set("sort", sortKey);

    const nextString = nextParams.toString();
    if (nextString !== searchParamsString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [query, filtersString, sortKey, setSearchParams, searchParamsString]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    setOffset(0);
  }, [query, filtersString, sortKey]);

  useEffect(() => {
    if (!hydratedRef.current) return;

    let cancelled = false;
    const isFirstPage = offset === 0;
    const normalizedFilters = sanitizeFilters(filters);

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    searchListings(query, {
      filters: normalizedFilters,
      sort: sortKey ? [sortKey] : [],
      limit: PAGE_SIZE,
      offset,
    })
      .then((data) => {
        if (cancelled) return;
        const hits = Array.isArray(data?.hits) ? data.hits : [];
        setResults((prev) => (isFirstPage ? hits : [...prev, ...hits]));
        setTotal(typeof data?.total === "number" ? data.total : hits.length);
        setFacets(data?.facets ?? {});
        setProcessingTime(data?.processingTimeMs);
        const pageOffset = typeof data?.offset === "number" ? data.offset : offset;
        const pageLimit = typeof data?.limit === "number" ? data.limit : PAGE_SIZE;
        const reached = pageOffset + hits.length >= (typeof data?.total === "number" ? data.total : hits.length);
        setHasMore(!reached);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err?.message || "Не вдалося виконати пошук";
        setError(message);
        if (isFirstPage) {
          setResults([]);
          setTotal(0);
          setFacets({});
          setHasMore(false);
        }
      })
      .finally(() => {
        if (cancelled) return;
        if (isFirstPage) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, filters, sortKey, offset]);

  useEffect(() => {
    if (!isFiltersOpen) {
      document.body.style.overflow = "";
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFiltersOpen]);

  const handleQueryChange = useCallback((value) => {
    setQuery((prev) => (prev === value ? prev : value));
  }, []);

  const handleFilterChange = useCallback((attribute, value) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === null || value === "") {
        delete next[attribute];
      } else if (Array.isArray(value)) {
        next[attribute] = value;
      } else if (typeof value === "object") {
        next[attribute] = value;
      } else {
        next[attribute] = value;
      }
      const sanitized = sanitizeFilters(next);
      return areFiltersEqual(prev, sanitized) ? prev : sanitized;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleLoadMore = useCallback(() => {
    setOffset((prev) => prev + PAGE_SIZE);
  }, []);

  const activeFiltersCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <SearchBar
            initialQuery={query}
            onSearch={handleQueryChange}
            placeholder="Знайти оголошення..."
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Filter size={18} />
              <span>
                Активні фільтри: {activeFiltersCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="search-sort" className="text-sm text-neutral-500">
                Сортування
              </label>
              <select
                id="search-sort"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value)}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value || "default"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-100 lg:hidden"
                onClick={() => setIsFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} /> Фільтри
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                facets={facets}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>

            <div className="min-w-0 space-y-4">
              {error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <SearchResults
                results={results}
                total={total}
                processingTimeMs={processingTime}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                facets={facets}
                query={query}
              />
            </div>
          </div>
        </div>
      </div>

      {isFiltersOpen ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/40 backdrop-blur-sm lg:hidden">
          <div
            className="absolute inset-0"
            role="presentation"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="relative z-10 mt-auto max-h-[85vh] overflow-hidden">
            <FilterSidebar
              filters={filters}
              facets={facets}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onClose={() => setIsFiltersOpen(false)}
              isMobile
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
