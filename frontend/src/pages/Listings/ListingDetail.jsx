import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingLayout from "../../components/listings/detail/ListingLayout";
import ListingDetailView from "../../components/listings/detail/ListingDetailView";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // === Загружаем текущего пользователя ===
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // === Загружаем объявление + добавляем просмотр в "recently" ===
  useEffect(() => {
    async function loadListing() {
      try {
        // 🔹 1. Загружаем объявление
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        const data = await res.json();
        setListing(data);

        // 🔹 2. Обновляем localStorage (recently)
        let recent = JSON.parse(localStorage.getItem("recentListings") || "[]");
        recent = [id, ...recent.filter((x) => x !== id)].slice(0, 15);
        localStorage.setItem("recentListings", JSON.stringify(recent));

        // 🔹 3. Отправляем просмотр на backend
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE}/api/recommendations/view/${id}`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // 🔹 4. Сбрасываем кеш рекомендаций
        sessionStorage.removeItem("stp_recommendations");
      } catch (e) {
        console.error("❌ Failed to load listing:", e);
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  // === Отдельная отправка статистики просмотров (не трогаем recently) ===
  useEffect(() => {
    const viewedKey = `viewed_${id}`;
    if (localStorage.getItem(viewedKey)) return;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    if (token) {
      fetch(`${API_BASE}/api/views/${id}`, { method: "POST", headers }).catch(() => {});
    } else {
      fetch(`${API_BASE}/api/listings/${id}/view-public`, { method: "POST" }).catch(() => {});
    }

    localStorage.setItem(viewedKey, "true");
  }, [id]);

  if (loading) return <ListingLayout>⏳ Завантаження...</ListingLayout>;
  if (!listing) return <ListingLayout>❌ Оголошення не знайдено</ListingLayout>;

  return (
    <ListingLayout>
      <ListingDetailView listing={listing} user={user} setListing={setListing} />
    </ListingLayout>
  );
}
