import { useStore } from "../store";
import { translations, FLAVORS } from "../locales";

/** Graceful static fallback when WebGL is unavailable */
export default function Fallback() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#06070a] pt-24">
      <div
        className="mx-auto max-w-5xl px-6 text-center"
        style={{ background: "radial-gradient(ellipse at top, rgba(124,77,255,0.16), transparent 60%)" }}
      >
        <p className="kicker">NEXO ENERGY</p>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-6xl" key={lang}>
          {t.fallback.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55" key={lang}>
          {t.fallback.sub}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="kicker mb-8 text-center" key={lang}>
          — {t.fallback.flavors} —
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FLAVORS.map((f) => (
            <div key={f.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="overflow-hidden" style={{ background: `radial-gradient(circle at 50% 20%, ${f.css}22, transparent 70%)` }}>
                <img
                  src={`/textures/label-${f.id}.jpg`}
                  alt={f.name}
                  className="mx-auto aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <p className="font-display text-[11px] font-bold text-white">{f.name}</p>
                <p className="mt-1.5 text-[10px] text-white/45">
                  {f.caffeine} · {f.size} · {f.energy}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
