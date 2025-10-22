export default function ListingDescription({ description }) {
  return (
    <div className="border-t border-neutral-200 pt-6 mb-8">
      <h2 className="text-xl font-semibold mb-3 text-neutral-900">📄 Опис</h2>
      <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
        {description || "Без опису"}
      </p>
    </div>
  );
}
