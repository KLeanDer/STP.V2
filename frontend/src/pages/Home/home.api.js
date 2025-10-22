const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchPopularListings() {
  const res = await fetch(`${API_BASE}/api/listings/popular/all`);
  if (!res.ok) throw new Error("Failed to fetch popular listings");
  return res.json();
}
