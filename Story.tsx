import { useStore } from "../store";
import { translations } from "../locales";

/** SCENE 06 — brand story: why choose us */
export default function Story() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];

  return (
    <section id="about" data-scene="story" className="relative h-screen w-full">
      <div className="relative z-10 flex h-full items-end justify-center px-5 pb-14 sm:pb-20">
        <div className="w-full max-w-4xl text-center">
          <p className="auto-reveal kicker mb-4">{t.story.kicker}</p>
          <h2 className="auto-reveal font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            <span key={lang} className="lang-swap block">
              {t.story.title}
            </span>
          </h2>
          <p className="auto-reveal mx-auto mt-4 max-w-xl text-sm text-white/55 sm:text-base">
            <span key={lang} className="lang-swap block">
              {t.story.sub}
            </span>
          </p>

          <div className="mt-9 grid gap-3 text-left sm:grid-cols-3 sm:gap-4">
            {t.story.features.map((feat, i) => (
              <div key={feat.t} className="auto-reveal glass p-5 sm:p-6" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-pink-500/25">
                  {i === 0 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2">
                      <path d="M12 3l2.7 5.7L20 9l-4.3 4.2L16.8 19 12 16.4 7.2 19l1.1-5.8L4 9l5.3-.3z" />
                    </svg>
                  ) : i === 1 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" strokeWidth="2">
                      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 100 100" fill="#a7f3d0">
                      <path d="M55 12 26 56h20l-7 32 34-46H52z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-display text-sm font-semibold text-white">{feat.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/50">{feat.d}</p>
              </div>
            ))}
          </div>

          <div className="auto-reveal mt-9 flex items-center justify-center gap-10 sm:gap-16">
            {t.story.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-white sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
