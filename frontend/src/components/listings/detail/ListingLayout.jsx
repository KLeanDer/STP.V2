export default function ListingLayout({ children }) {
  return (
    <main className="relative min-h-screen text-neutral-900 bg-gradient-to-b from-[#fafafa] via-[#f5f5f5] to-[#ededed] overflow-x-hidden">
      {/* WATERMARK */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1
          className="text-[26rem] font-extrabold text-[#e0e0e0]/35 blur-[6px] rotate-[-25deg] tracking-tighter"
          style={{ lineHeight: "0.7", userSelect: "none" }}
        >
          STP
        </h1>
      </div>

      {/* GLOW BACKGROUND (клади ниже контента по z-index) */}
      <div className="pointer-events-none absolute top-[15%] left-[5%] w-80 h-80 bg-[#0056b3]/20 rounded-full blur-[120px] z-0" />
      <div className="pointer-events-none absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#00449b]/15 rounded-full blur-[160px] z-0" />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>

      {/* SINGLE FOOTER */}
      <footer className="relative z-10 border-t border-neutral-200 py-5 text-center text-[12px] text-neutral-500 bg-white/70 backdrop-blur-sm mt-10">
        © {new Date().getFullYear()} STP — створено з довірою та стилем.
      </footer>
    </main>
  );
}
