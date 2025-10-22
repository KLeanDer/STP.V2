import { useEffect } from "react";
import { User, Phone } from "lucide-react";

export default function ContactFields({ form, handleChange, setForm }) {
  // 🔹 Автопідстановка імені з профілю
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.name && !form.contactName) {
        setForm((p) => ({ ...p, contactName: user.name }));
      }
    } catch {}
  }, []);

  // 🔹 Якщо немає телефону — встановлюємо префікс
  useEffect(() => {
    if (!form.contactPhone) {
      setForm((p) => ({ ...p, contactPhone: "+380 " }));
    }
  }, []);

  // Витягуємо тільки 9 цифр після 380
  const digitsAfter380 = (form.contactPhone || "")
    .replace(/\D/g, "")
    .replace(/^380/, "")
    .slice(0, 9);

  // Форматуємо: XX XXX XX XX
  const formatRest = (digits) => {
    const g1 = digits.slice(0, 2);
    const g2 = digits.slice(2, 5);
    const g3 = digits.slice(5, 7);
    const g4 = digits.slice(7, 9);
    return [g1, g2, g3, g4].filter(Boolean).join(" ");
  };

  const displayRest = formatRest(digitsAfter380);

  const onRestChange = (e) => {
    let only = e.target.value.replace(/\D/g, "").slice(0, 9);

    // 🚫 Заборона першої цифри 0
    if (only.length === 1 && only[0] === "0") return;

    const formatted = formatRest(only);
    setForm({
      ...form,
      contactPhone: "+380" + (formatted ? " " + formatted : " "),
    });
  };

  const onRestBlur = () => {
    const raw = (form.contactPhone || "").replace(/\D/g, "");
    if (raw.length > 0 && raw.length !== 12) {
      setForm({ ...form, contactPhone: "+380 " });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Ваші дані</h2>

      {/* Ім’я */}
      <div className="mb-4">
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2">
          <User size={18} /> Ім’я
        </label>
        <input
          type="text"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          placeholder="Ваше ім’я"
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 outline-none"
        />
      </div>

      {/* Телефон UA */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2">
          <Phone size={18} /> Телефон (Україна)
        </label>

        <div className="flex">
          {/* Фіксований префікс */}
          <span className="select-none px-3 py-2 bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-l-lg font-medium">
            +380
          </span>

          {/* Введення тільки залишку */}
          <input
            type="tel"
            inputMode="numeric"
            placeholder="XX XXX XX XX"
            value={displayRest}
            onChange={onRestChange}
            onBlur={onRestBlur}
            maxLength={12}
            className="flex-1 border border-l-0 border-neutral-300 rounded-r-lg px-3 py-2 focus:ring-2 outline-none"
          />
        </div>

        <p className="text-xs text-neutral-500 mt-1">
          Формат: +380 <span className="tabular-nums">XX XXX XX XX</span>
        </p>
      </div>
    </div>
  );
}
