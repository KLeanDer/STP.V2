const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function searchListings(query = "", filters = {}) {
  const params = new URLSearchParams({ q: query, ...filters });
  const res = await fetch(`${API_BASE}/api/search?${params.toString()}`);
  return res.json();
}
