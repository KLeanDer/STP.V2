import { Info } from "lucide-react";

export default function ProfileInfo({ user, isOwnProfile = false }) {
  return (
    <div className="bg-neutral-50 border border-neutral-400 rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-3 pb-3 border-b border-neutral-300">
        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700">
          <Info size={20} />
        </span>
        Інформація
      </h2>

      {user.phone && (
        <p className="text-neutral-800">
          <span className="font-medium text-neutral-900">Телефон:</span>{" "}
          {user.phone}
        </p>
      )}

      {user.about ? (
        <p className="text-neutral-800 leading-relaxed">
          <span className="font-medium text-neutral-900">Про мене:</span>{" "}
          {user.about}
        </p>
      ) : (
        <p className="text-neutral-500 text-sm italic">Немає опису</p>
      )}

      {isOwnProfile && !user.isVerified && (
        <button className="mt-4 px-4 py-2 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition">
          Верифікувати акаунт
        </button>
      )}
    </div>
  );
}
