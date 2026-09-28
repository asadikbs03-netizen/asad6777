import { useStore } from "../store";
import { translations } from "../locales";
import FlavorChips from "../ui/FlavorChips";

/** SCENE 02 — the flavor catalog, content on the right so the lineup stays visible */
export default function Catalog() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];

  return (
    <section id="catalog" data-scene="catalog" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full items-center px-6 sm:px-10">
        <div className="ml-auto w-full max-w-md lg:mr-[6%] xl:mr-[10%]">
          <p className="auto-reveal kicker mb-5">{t.catalog.kicker}</p>
          <h2 className="auto-reveal font-display text-4xl font-bold leading-tight text-white sm:text-6xl" style={{ animationDelay: "0.05s" }}>
            <span key={lang} className="lang-swap block">
              {t.catalog.title}
            </span>
          </h2>
          <p className="auto-reveal mt-5 text-sm leading-relaxed text-white/55 sm:text-base" style={{ animationDelay: "0.1s" }}>
            <span key={lang} className="lang-swap block">
              {t.catalog.sub}
            </span>
          </p>
          <p className="auto-reveal mt-7 flex items-center gap-2.5 text-xs font-medium tracking-wide text-white/40" style={{ animationDelay: "0.16s" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            <span key={lang} className="lang-swap">
              {t.catalog.hint}
            </span>
          </p>
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 z-10 px-4">
        <FlavorChips />
      </div>
    </section>
  );
}
