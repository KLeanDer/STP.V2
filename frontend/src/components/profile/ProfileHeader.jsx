export default function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      <img
        src={user.avatarUrl || "https://i.pravatar.cc/80"}
        alt="avatar"
        className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
      />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {user.name}
          {user.isVerified && (
            <span className="text-green-600 text-sm font-medium">
              ✅ Верифікований
            </span>
          )}
        </h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}
