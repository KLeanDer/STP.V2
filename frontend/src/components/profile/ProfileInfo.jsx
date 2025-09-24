export default function ProfileInfo({ user, isOwnProfile = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <h2 className="text-lg font-semibold">ℹ️ Інформація</h2>

      {user.phone && (
        <p>
          <span className="font-medium">Телефон:</span> {user.phone}
        </p>
      )}
      {user.about ? (
        <p>
          <span className="font-medium">Про мене:</span> {user.about}
        </p>
      ) : (
        <p className="text-gray-500 text-sm">Немає опису</p>
      )}

      {isOwnProfile && !user.isVerified && (
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
          Верифікувати акаунт
        </button>
      )}
    </div>
  );
}
