export default function FilterGroup({
  title,
  description,
  children,
  action,
}) {
  return (
    <section className="space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
            {title}
          </h3>
          {description ? (
            <p className="text-xs text-neutral-500 mt-1 leading-snug">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
