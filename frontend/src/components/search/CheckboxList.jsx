export default function CheckboxList({ options = [], value = [], onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const handleToggle = (optionValue) => {
    if (typeof onChange !== "function") return;

    if (selected.includes(optionValue)) {
      onChange(selected.filter((item) => item !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <ul className="space-y-2">
      {options.map((option) => {
        const isActive = selected.includes(option.value);
        return (
          <li key={option.value} className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => handleToggle(option.value)}
                className="h-4 w-4 rounded border-neutral-300 text-blue-500 focus:ring-blue-400"
              />
              <span>{option.label}</span>
            </label>
            {typeof option.count === "number" ? (
              <span className="text-xs font-medium text-neutral-400">
                {option.count.toLocaleString("uk-UA")}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
