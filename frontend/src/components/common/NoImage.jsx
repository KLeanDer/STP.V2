import { Box, User, MessageSquare, Image as ImageIcon } from "lucide-react";

export default function NoImage({
  text = "Немає фото",
  type = "listing", // 'listing' | 'profile' | 'chat' | 'banner'
  size = "auto", // 'auto' | 'compact' | 'large'
  rounded = true,
}) {
  const isCompact = size === "compact";
  const isLarge = size === "large";

  const colors = {
    listing: { from: "from-neutral-100", to: "to-neutral-200", accent: "#1a73e8" },
    profile: { from: "from-[#f7f7f7]", to: "to-[#e7e7e7]", accent: "#b99b62" },
    chat: { from: "from-[#f3f3f3]", to: "to-[#e5e5e5]", accent: "#00bfa5" },
    banner: { from: "from-[#f2f2f2]", to: "to-[#dcdcdc]", accent: "#6b7280" },
  }[type] || colors?.listing;

  const Icon =
    type === "profile"
      ? User
      : type === "chat"
      ? MessageSquare
      : type === "banner"
      ? ImageIcon
      : Box;

  return (
    <div
      className={`relative flex items-center justify-center 
      w-full aspect-[4/3] overflow-hidden
      ${rounded ? "rounded-xl" : ""}
      bg-gradient-to-br ${colors.from} ${colors.to}
      border border-neutral-200
      text-neutral-600 select-none`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <Icon
          size={isCompact ? 22 : isLarge ? 64 : 36}
          strokeWidth={1.7}
          style={{ color: colors.accent }}
        />
        <span
          className={`mt-2 font-medium ${
            isCompact ? "text-xs" : isLarge ? "text-lg" : "text-sm"
          }`}
        >
          {text}
        </span>
      </div>

      <div
        className={`absolute bottom-2 right-3 text-[9px] font-semibold tracking-wide text-neutral-400 uppercase`}
      >
        STP <span className="text-neutral-300">beta</span>
      </div>
    </div>
  );
}
