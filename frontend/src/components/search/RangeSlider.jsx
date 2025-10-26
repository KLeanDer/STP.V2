import { useEffect, useMemo, useState } from "react";

function parseValue(value) {
  if (value === "" || value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  const parsed = Number(value);
  return Number.isNaN(parsed) ? "" : String(parsed);
}

export default function RangeSlider({
  value = {},
  min = 0,
  max = 1000,
  step = 1,
  unit,
  onChange,
}) {
  const [localMin, setLocalMin] = useState(parseValue(value.min));
  const [localMax, setLocalMax] = useState(parseValue(value.max));

  useEffect(() => {
    setLocalMin(parseValue(value.min));
    setLocalMax(parseValue(value.max));
  }, [value.min, value.max]);

  const handleUpdate = useMemo(() => {
    if (typeof onChange !== "function") return () => {};
    return (nextMin, nextMax) => {
      const parsedMin = nextMin === "" ? undefined : Number(nextMin);
      const parsedMax = nextMax === "" ? undefined : Number(nextMax);
      const hasMin = parsedMin !== undefined && !Number.isNaN(parsedMin);
      const hasMax = parsedMax !== undefined && !Number.isNaN(parsedMax);

      if (!hasMin && !hasMax) {
        onChange(undefined);
        return;
      }

      onChange({
        ...(hasMin ? { min: parsedMin } : {}),
        ...(hasMax ? { max: parsedMax } : {}),
      });
    };
  }, [onChange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleUpdate(localMin, localMax);
    }, 250);

    return () => clearTimeout(timeout);
  }, [localMin, localMax, handleUpdate]);

  const formattedRange = useMemo(() => {
    const formattedMin = localMin !== "" ? Number(localMin).toLocaleString("uk-UA") : "—";
    const formattedMax = localMax !== "" ? Number(localMax).toLocaleString("uk-UA") : "—";
    return `${formattedMin} – ${formattedMax}${unit ? ` ${unit}` : ""}`;
  }, [localMin, localMax, unit]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wide">
        <span>Діапазон</span>
        <span className="font-semibold text-neutral-600">{formattedRange}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-neutral-500 uppercase">Мін</label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localMin}
            onChange={(event) => setLocalMin(event.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-neutral-500 uppercase">Макс</label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localMax}
            onChange={(event) => setLocalMax(event.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="relative h-1.5 rounded-full bg-neutral-200">
        <div
          className="absolute inset-y-0 rounded-full bg-blue-500/70"
          style={{
            left: `${Math.max(0, Math.min(100, ((localMin || min) - min) / (max - min || 1) * 100))}%`,
            right: `${Math.max(0, Math.min(100, 100 - ((localMax || max) - min) / (max - min || 1) * 100))}%`,
          }}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setLocalMin("");
            setLocalMax("");
            handleUpdate("", "");
          }}
          className="text-xs font-medium text-blue-600 hover:text-blue-500"
        >
          Скинути
        </button>
      </div>
    </div>
  );
}
