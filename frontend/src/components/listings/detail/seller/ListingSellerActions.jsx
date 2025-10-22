import { Edit3, XCircle, CheckCircle2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListingSellerActions({ listing, setListing, onEdit }) {
  async function toggleStatus() {
    const action = listing.status === "active" ? "деактивувати" : "активувати";
    if (!window.confirm(`Ви впевнені, що хочете ${action} це оголошення?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Необхідно увійти");

      const res = await fetch(`${API_BASE}/api/listings/${listing.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: listing.status === "active" ? "inactive" : "active",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setListing(data);
        alert(
          data.status === "inactive"
            ? "🔴 Оголошення деактивовано."
            : "🟢 Оголошення знову активне."
        );
      } else {
        alert(data.error || "Помилка");
      }
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition"
      >
        <Edit3 size={16} /> Редагувати
      </button>

      <button
        onClick={toggleStatus}
        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm transition ${
          listing.status === "active"
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-green-600 text-white hover:bg-green-500"
        }`}
      >
        {listing.status === "active" ? (
          <>
            <XCircle size={16} /> Деактивувати
          </>
        ) : (
          <>
            <CheckCircle2 size={16} /> Активувати
          </>
        )}
      </button>
    </div>
  );
}
