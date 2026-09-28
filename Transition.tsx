import { useStore } from "../store";
import { translations, FLAVORS } from "../locales";

/** SCENE 05 — lateral product handoff: the next flavor takes over */
export default function Transition() {
  const lang = useStore((s) => s.lang);
  const active = useStore((s) => s.activeIndex);
  const t = translations[lang];
  const f = FLAVORS[active];
  const ft = f[lang];

  return (
    <section id="transition" data-scene="transition" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:pl-[7%] xl:pl-[10%]">
        <div className="auto-reveal glass max-w-md p-5 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <p className="kicker mb-5 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-white/40">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <span key={lang} className="lang-swap">
              {t.details.kicker}
            </span>
          </p>
          <h3 className="font-display text-5xl font-bold leading-none text-white sm:text-7xl" key={`${active}-${lang}`}>
            <span className="lang-swap block bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              {f.name}
            </span>
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base" key={`d-${active}-${lang}`}>
            <span className="lang-swap block">{ft.desc}</span>
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-14" style={{ background: `linear-gradient(90deg, transparent, ${f.css})` }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: f.css }}>
              {ft.tag}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
