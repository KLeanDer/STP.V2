const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function searchListings(
  query = "",
  { filters = {}, sort = [], limit, offset } = {}
) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (filters && Object.keys(filters).length) {
    params.set("filters", JSON.stringify(filters));
  }
  if (sort && sort.length) {
    params.set("sort", JSON.stringify(sort));
  }
  if (typeof limit === "number") {
    params.set("limit", String(limit));
  }
  if (typeof offset === "number") {
    params.set("offset", String(offset));
  }

  const queryString = params.toString();
  const res = await fetch(
    `${API_BASE}/api/search${queryString ? `?${queryString}` : ""}`
  );

  if (!res.ok) {
    throw new Error(`Search request failed with status ${res.status}`);
  }

  return res.json();
}