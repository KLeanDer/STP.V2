export default function FooterSection() {
  return (
    <footer className="border-t border-neutral-200 py-5 text-center text-[12px] text-neutral-500 bg-white/80 backdrop-blur-sm relative z-10">
      © {new Date().getFullYear()} STP — створено з довірою та стилем.
    </footer>
  );
}
