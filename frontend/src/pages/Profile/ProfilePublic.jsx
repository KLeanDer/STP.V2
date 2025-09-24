import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileListings from "../../components/profile/ProfileListings";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProfilePublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`${API_BASE}/api/listings?userId=${id}`)
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []));

    fetch(`${API_BASE}/api/reviews?userId=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []));
  }, [id]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          ⏳ Завантаження профілю...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <ProfileHeader user={user} />

      {/* Список объявлений */}
      <ProfileListings title="📦 Оголошення користувача" listings={listings} />

      {/* Отзывы */}
      <section>
        <h2 className="text-lg font-semibold mb-3">⭐ Відгуки</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Немає відгуків</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="bg-white shadow rounded-lg p-3 border border-gray-200"
              >
                <p className="font-medium">{r.authorName}</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("uk-UA")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
