import { useStore } from "../store";

/**
 * Ambient chrome: film grain, vignette, top scrim for the nav,
 * and a vertical scroll-progress indicator.
 */
export default function Chrome() {
  const progress = useStore((s) => s.progress);
  return (
    <>
      <div className="grain" aria-hidden="true" />
      {/* vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[6]"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(4,5,9,0.55) 100%)",
        }}
        aria-hidden="true"
      />
      {/* top scrim for nav legibility */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[7] h-28"
        style={{ background: "linear-gradient(to bottom, rgba(6,7,10,0.75), transparent)" }}
        aria-hidden="true"
      />
      {/* scroll progress rail */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="font-display text-[10px] tabular-nums text-white/40">{String(Math.round(progress * 100)).padStart(2, "0")}</span>
        <div className="relative h-36 w-px overflow-hidden bg-white/10">
          <div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-violet-400 to-pink-500"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
