import { useStore, scrollToStory } from "../store";
import { translations, FLAVORS } from "../locales";

/** flavor-segment centers in vh of the story — used by the flavor switcher */
const SEGMENT_CENTER_VH = [240, 413, 497, 570, 697];

/** SCENE 03/04 — featured product panel (right side, camera shows the can on the left) */
export default function Details() {
  const lang = useStore((s) => s.lang);
  const active = useStore((s) => s.activeIndex);
  const setActiveIndex = useStore((s) => s.setActiveIndex);
  const t = translations[lang];
  const f = FLAVORS[active];
  const ft = f[lang];

  const next = () => {
    const n = (active + 1) % FLAVORS.length;
    setActiveIndex(n);
    scrollToStory(SEGMENT_CENTER_VH[n]);
  };

  return (
    <section id="flavors" data-scene="details" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full items-center justify-center px-5 sm:justify-end sm:px-10 lg:pr-[8%] xl:pr-[11%]">
        <div className="auto-reveal glass w-full max-w-md p-6 sm:p-8" key={active}>
          <div className="flex items-center justify-between gap-4">
            <p className="kicker">{t.details.kicker}</p>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black transition-colors duration-500"
              style={{ background: f.css }}
            >
              {ft.tag}
            </span>
          </div>

          <h3 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl" key={`${active}-${lang}`}>
            <span className="lang-swap block">{f.name}</span>
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-[15px]" key={`d-${active}-${lang}`}>
            <span className="lang-swap block">{ft.desc}</span>
          </p>

          {/* flavor notes */}
          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">{t.details.notes}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {ft.notes.map((n) => (
                <span
                  key={n}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium text-white/70 transition-colors duration-500"
                  style={{ borderColor: `${f.css}55`, background: `${f.css}14` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* benefits */}
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">{t.details.benefits}</p>
            <ul className="mt-2.5 space-y-2">
              {ft.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-white/65">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.css} strokeWidth="3" className="shrink-0">
                    <path d="M4 12.5 9.5 18 20 6" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{t.details.energy}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${f.energy}%`, background: `linear-gradient(90deg, ${f.css}88, ${f.css})` }}
                />
              </div>
              <p className="mt-1.5 font-display text-sm text-white/80">{f.energy}%</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{t.details.size}</p>
                <p className="mt-1.5 font-display text-sm text-white/80">{f.size}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{t.details.caffeine}</p>
                <p className="mt-1.5 font-display text-sm text-white/80">{f.caffeine}</p>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="btn-primary !px-6 !py-3 !text-[12px]"
              style={{ background: `linear-gradient(120deg, ${f.css}cc, ${f.css})`, boxShadow: `0 12px 40px -12px ${f.css}` }}
              onClick={next}
            >
              {t.details.cta}
            </button>
            <button className="btn-ghost !px-6 !py-3 !text-[12px]" onClick={next}>
              {t.details.next}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
