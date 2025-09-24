const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" };
}

// ѕолучить все объ€влени€
export async function getAllListings() {
  const res = await fetch(`${API_BASE}/api/listings`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

// ѕолучить одно объ€вление по ID
export async function getListingById(id) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

// —оздать объ€вление
export async function createListing(data) {
  const res = await fetch(`${API_BASE}/api/listings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

// ќбновить объ€вление
export async function updateListing(id, data) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

// ”далить объ€вление
export async function deleteListing(id) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
}
