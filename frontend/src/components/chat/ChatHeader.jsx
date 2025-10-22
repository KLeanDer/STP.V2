// src/components/chat/ChatHeader.jsx
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatAdCard from "./ChatAdCard";

function formatLastSeen(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * @param {Object} props
 * @param {{ id: string|number, name?: string, avatarUrl?: string }} props.peerUser
 * @param {any} props.listing
 * @param {{ online?: boolean, lastSeen?: string }} props.status
 * @param {Object} props.typing - словарь кто печатает { userId: true }
 * @param {() => void} [props.onBack]
 */
export default function ChatHeader({ peerUser, listing, status, typing, onBack }) {
  const navigate = useNavigate();

  const onlineText = useMemo(() => {
    if (!peerUser) return "";
    if (typing && typing[peerUser.id]) return "друкує…";
    if (status?.online) return "в мережі";
    if (status?.lastSeen) return `був(ла) ${formatLastSeen(status.lastSeen)}`;
    return "офлайн";
  }, [status, typing, peerUser]);

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Назад */}
        <button
          onClick={() => (onBack ? onBack() : navigate("/chat"))}
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Назад"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Аватар */}
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100 border">
          {peerUser?.avatarUrl ? (
            <img
              src={peerUser.avatarUrl}
              alt={peerUser?.name || "user"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              {peerUser?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Имя + статус */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-semibold text-gray-900">
              {peerUser?.name || "Користувач"}
            </div>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                status?.online ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div className="text-xs text-gray-500 truncate">{onlineText}</div>
        </div>

        {/* Быстрый переход в профиль */}
        {peerUser?.id && (
          <Link
            to={`/profile/${peerUser.id}`}
            className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Профіль
          </Link>
        )}
      </div>

      {/* Карточка объявления */}
      {listing && (
        <div className="px-4 pb-3">
          <ChatAdCard listing={listing} />
        </div>
      )}
    </div>
  );
}
