import { useState, useRef, useEffect, useMemo } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  messages = [],
  onSend,
  onTyping,
  typingUsers = {},
  currentUserId,
  noChats = false,
  chatSelected = true,
}) {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const initializedRef = useRef(false);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // При первом рендере — сразу вниз
  useEffect(() => {
    if (!initializedRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      initializedRef.current = true;
    }
  }, [messages]);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Отслеживаем прокрутку
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;

    // Если юзер не внизу → показать кнопку
    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 100);
  };

  // Кнопка "вниз"
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend?.(text);
    setInput("");
    clearTimeout(typingTimeoutRef.current);
    onTyping?.(false);

    scrollToBottom();
  };

  if (noChats) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        У вас поки немає чатів
      </div>
    );
  }

  if (!chatSelected) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Оберіть потрібний чат, щоб почати спілкування
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      {/* Сообщения */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 bg-neutral-50"
      >
        {messages.length === 0 ? (
          <div className="text-center text-neutral-400 mt-10">
            Тут поки немає повідомлень
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id || msg.createdAt || `${idx}-${msg.senderId}`}
              message={msg}
              isOwn={msg.senderId === currentUser?.id}
            />
          ))
        )}
      </div>

      {/* Кнопка "вниз" */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-5 w-10 h-10 flex items-center justify-center 
                     bg-white border border-neutral-300 rounded-full shadow hover:bg-neutral-100 transition"
          aria-label="Прокрутити вниз"
          title="Прокрутити вниз"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-neutral-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Поле ввода */}
      <div className="border-t border-neutral-200 p-3 shrink-0 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 items-end"
        >
          <textarea
            placeholder="Напишіть повідомлення..."
            value={input}
            onChange={(e) => {
              const val = e.target.value;
              setInput(val);

              if (val.length > 0) {
                onTyping?.(true);
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                  onTyping?.(false);
                }, 1000);
              } else {
                clearTimeout(typingTimeoutRef.current);
                onTyping?.(false);
              }

              // авто-высота
              e.target.style.height = "auto";
              const limit = 208;
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                limit
              )}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="flex-1 resize-none px-3 py-2 border rounded-xl bg-white shadow-sm 
                       focus:outline-none focus:ring focus:ring-neutral-300
                       max-h-52 leading-relaxed whitespace-pre-wrap break-words 
                       overflow-y-auto scrollbar-none"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full 
                       hover:bg-neutral-800 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition shadow"
            aria-label="Надіслати"
            title="Надіслати"
          >
            {/* Стрелка ">" */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
