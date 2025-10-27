export default function FiltersButton({ open, setOpen }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="border border-neutral-300 px-3 py-1.5 rounded-lg text-sm hover:bg-neutral-100 transition"
    >
      {open ? "Закрити" : "Показати"}
    </button>
  );
}
