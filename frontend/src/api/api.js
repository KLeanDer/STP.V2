// frontend/src/api/api.js

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errorText;
    try {
      errorText = await res.text();
    } catch (_) {
      errorText = res.statusText;
    }
    throw new Error(`Ошибка сервера: ${res.status} ${errorText}`);
  }

  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}
