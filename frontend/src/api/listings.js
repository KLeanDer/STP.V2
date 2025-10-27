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

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry === undefined || entry === null) return;
        const stringified = String(entry);
        if (stringified.trim() === '') return;
        searchParams.append(key, stringified);
      });
      return;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return;
      searchParams.set(key, trimmed);
      return;
    }

    if (typeof value === "boolean") {
      searchParams.set(key, value ? "true" : "false");
      return;
    }

    if (typeof value === "number") {
      if (Number.isFinite(value)) {
        searchParams.set(key, value.toString());
      }
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

let categoryTreeCache = null;
let categoryTreePromise = null;

export function invalidateCategoryTreeCache() {
  categoryTreeCache = null;
  categoryTreePromise = null;
}

export async function fetchCategoryTree(forceRefresh = false) {
  if (!forceRefresh && categoryTreeCache) {
    return categoryTreeCache;
  }

  if (!forceRefresh && categoryTreePromise) {
    return categoryTreePromise;
  }

  const request = fetch(`${API_BASE}/api/listings/categories/tree`, {
    headers: authHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load categories");
      }
      return res.json();
    })
    .then((data) => {
      categoryTreeCache = Array.isArray(data) ? data : [];
      categoryTreePromise = null;
      return categoryTreeCache;
    })
    .catch((error) => {
      categoryTreePromise = null;
      throw error;
    });

  if (!forceRefresh) {
    categoryTreePromise = request;
  }

  return request;
}

export async function getAllListings(params = {}, options = {}) {
  const query = buildQuery(params);
  const url = query ? `${API_BASE}/api/listings?${query}` : `${API_BASE}/api/listings`;

  const res = await fetch(url, {
    headers: authHeaders(),
    signal: options.signal,
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function getListingById(id) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export async function createListing(data) {
  const res = await fetch(`${API_BASE}/api/listings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

export async function updateListing(id, data) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

export async function deleteListing(id) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
}
