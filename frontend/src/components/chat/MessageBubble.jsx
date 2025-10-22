/**
 * @param {{
 *   message: {
 *     id?: string|number,
 *     text: string,
 *     createdAt?: string,
 *     status?: "sent"|"delivered"|"read"
 *   },
 *   isOwn: boolean
 * }} props
 */
export default function MessageBubble({ message, isOwn }) {
  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const renderStatus = () => {
    if (!isOwn) return null;
    switch (message?.status) {
      case "read":
        return <span className="ml-1 text-blue-500">✔✔</span>;
      case "delivered":
        return <span className="ml-1 text-gray-500">✔✔</span>;
      case "sent":
      default:
        return <span className="ml-1 text-gray-400">✔</span>;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative px-4 py-2 rounded-2xl text-sm shadow
          ${isOwn
            ? "bg-neutral-800 text-white rounded-br-sm"
            : "bg-neutral-200 text-neutral-900 rounded-bl-sm"}
          max-w-[95%] sm:max-w-[85%] md:max-w-[75%]
        `}
      >
        {/* ТЕКСТ сообщения */}
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {message.text}
        </div>

        {/* Время и статус */}
        <div className="flex items-center justify-end gap-1 text-[10px] mt-1 text-right text-neutral-400">
          <span>{time}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
