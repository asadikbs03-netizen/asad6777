import { useStore, scrollToId } from "../store";
import { translations } from "../locales";
import FlavorChips from "../ui/FlavorChips";

/** SCENE 07 — final lineup + strong CTA */
export default function Cta() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];

  return (
    <section id="contact" data-scene="cta" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="kicker mb-5">{t.cta.kicker}</p>
        <h2 className="max-w-4xl font-display text-[10vw] font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          <span
            key={lang}
            className="lang-swap block bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
          >
            {t.cta.title}
          </span>
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
          <span key={lang} className="lang-swap block">
            {t.cta.sub}
          </span>
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button className="btn-primary !px-8 !py-4" onClick={() => scrollToId("#catalog")}>
            {t.cta.primary}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button className="btn-ghost !px-8 !py-4" onClick={() => scrollToId("#about")}>
            {t.cta.secondary}
          </button>
        </div>
        <FlavorChips className="mt-10" />
      </div>
    </section>
  );
}
