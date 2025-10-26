export default function TagSelect({ options = [], selected = [], onToggle }) {
  const selectedSet = new Set(selected);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selectedSet.has(option.id);
        return (
          <button
            type="button"
            key={option.id}
            onClick={() => onToggle?.(option, !isActive)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
              isActive
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
            }`}
          >
            <span className="font-medium">{option.label}</span>
            {typeof option.count === "number" ? (
              <span className="text-xs font-semibold opacity-70">
                {option.count.toLocaleString("uk-UA")}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
