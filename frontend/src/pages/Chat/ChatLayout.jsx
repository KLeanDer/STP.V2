import { Outlet } from "react-router-dom";
import ChatList from "../../components/chat/ChatList";

export default function ChatLayout() {
  return (
    <div className="bg-neutral-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6
            bg-white rounded-2xl shadow-sm overflow-hidden
            h-[720px]                   /* фикс. высота контейнера */
          "
        >
          {/* Левая колонка */}
          <aside className="border-r border-neutral-200 p-4">
            <ChatList />
          </aside>

          {/* Правая колонка */}
          <main className="flex flex-col h-full min-h-0 p-4"> {/* ВАЖНО: min-h-0 */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
