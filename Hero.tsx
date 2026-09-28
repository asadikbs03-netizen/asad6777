import { useStore, scrollToId } from "../store";
import { translations } from "../locales";

/** SCENE 01 — cinematic intro, headline, CTAs and scroll hint */
export default function Hero() {
  const lang = useStore((s) => s.lang);
  const entered = useStore((s) => s.entered);
  const t = translations[lang];

  return (
    <section id="home" data-scene="hero" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className={`hero-in kicker mb-6 ${entered ? "play" : ""}`}>
          NEXO ENERGY · {t.hero.kicker}
        </p>
        <h1
          className={`hero-in max-w-5xl font-display text-[11vw] font-bold leading-[1.04] text-white sm:text-6xl lg:text-[76px] ${entered ? "play" : ""}`}
          style={{ animationDelay: "0.08s" }}
        >
          <span key={lang} className="lang-swap block bg-gradient-to-b from-white via-white to-white/45 bg-clip-text text-transparent">
            {t.hero.title}
          </span>
        </h1>
        <p
          className={`hero-in mt-7 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base ${entered ? "play" : ""}`}
          style={{ animationDelay: "0.18s" }}
        >
          <span key={lang} className="lang-swap block">
            {t.hero.sub}
          </span>
        </p>
        <div className={`hero-in mt-10 flex flex-wrap items-center justify-center gap-4 ${entered ? "play" : ""}`} style={{ animationDelay: "0.3s" }}>
          <button className="btn-primary" onClick={() => scrollToId("#catalog")}>
            {t.hero.primary}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button className="btn-ghost" onClick={() => scrollToId("#flavors")}>
            {t.hero.secondary}
          </button>
        </div>
      </div>

      {/* scroll hint */}
      <div className={`hero-in absolute bottom-7 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2.5 ${entered ? "play" : ""}`} style={{ animationDelay: "0.6s" }}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35" key={lang}>
          {t.hero.scroll}
        </span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-white/80" />
        </span>
      </div>
    </section>
  );
}
