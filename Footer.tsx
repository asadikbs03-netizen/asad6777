import { useStore, scrollToId } from "../store";
import { translations } from "../locales";

const SOCIALS = [
  {
    name: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8 0-3.2 0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.7a6.1 6.1 0 1 0 0 12.2 6.1 6.1 0 0 0 0-12.2zm0 10a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm6.3-10.2a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z",
  },
  {
    name: "Telegram",
    path: "M21.9 4.6 18.9 19c-.2 1-.8 1.2-1.6.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-.9.5l.3-4.7L18.4 6c.4-.4-.1-.6-.6-.2L7.3 13l-4.5-1.4c-1-.3-1-1 .2-1.4l17.5-6.7c.8-.3 1.5.2 1.4 1.1z",
  },
  {
    name: "YouTube",
    path: "M23 7.5a3 3 0 0 0-2.1-2.2C19 5 12 5 12 5s-7 0-8.9.3A3 3 0 0 0 1 7.5 31 31 0 0 0 .7 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.2C5 19 12 19 12 19s7 0 8.9-.3a3 3 0 0 0 2.1-2.2A31 31 0 0 0 23.3 12 31 31 0 0 0 23 7.5zM9.8 15V9l5.2 3z",
  },
];

export default function Footer() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];
  const links = [
    { id: "#home", label: t.nav.home },
    { id: "#catalog", label: t.nav.products },
    { id: "#flavors", label: t.nav.flavors },
    { id: "#about", label: t.nav.about },
    { id: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="relative z-10 border-t border-white/[0.07] bg-[#06070a]/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 100 100">
              <path d="M55 12 26 56h20l-7 32 34-46H52z" fill="#a78bfa" />
            </svg>
            <span className="font-display text-sm font-bold tracking-[0.22em] text-white">
              NEXO <span className="text-white/40">ENERGY</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45" key={lang}>
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">{t.footer.nav}</p>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollToId(l.id)} className="text-sm text-white/55 transition-colors hover:text-white">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">{t.footer.follow}</p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-300 hover:border-white/30 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-6 py-5 text-[11px] text-white/30 sm:flex-row sm:px-10">
          <span key={lang}>{t.footer.rights}</span>
          <span className="font-display tracking-[0.3em]">WEBGL EXPERIENCE · 2026</span>
        </div>
      </div>
    </footer>
  );
}
