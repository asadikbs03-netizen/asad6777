import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { translations } from "../locales";

/** Premium loading screen: brand mark, animated percentage, graceful exit. */
export default function Loader() {
  const ready = useStore((s) => s.ready);
  const lang = useStore((s) => s.lang);
  const setEntered = useStore((s) => s.setEntered);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      setPct((p) => Math.min(100, p + Math.max(2, (100 - p) * 0.14)));
    }, 32);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (pct >= 100 && ready && Date.now() - startedAt.current > 1200) {
      setDone(true);
      const a = window.setTimeout(() => setEntered(true), 250);
      const b = window.setTimeout(() => setGone(true), 800);
      return () => {
        window.clearTimeout(a);
        window.clearTimeout(b);
      };
    }
  }, [pct, ready, setEntered]);

  // safety: never trap the visitor behind the loader
  useEffect(() => {
    const id = window.setTimeout(() => {
      setPct(100);
      setEntered(true);
      setDone(true);
      setGone(true);
    }, 8000);
    return () => window.clearTimeout(id);
  }, [setEntered]);

  if (gone) return null;

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#06070a] transition-all duration-700 ease-out ${
        done ? "pointer-events-none opacity-0 scale-[1.05]" : "opacity-100"
      }`}
    >
      {/* ambient glow */}
      <div className="absolute w-[46rem] h-[46rem] rounded-full bg-[radial-gradient(circle,rgba(124,77,255,0.14),transparent_60%)]" />

      <div className="relative flex flex-col items-center">
        {/* mark */}
        <div className="flex items-center gap-3 mb-10">
          <svg width="30" height="30" viewBox="0 0 100 100" className="drop-shadow-[0_0_18px_rgba(139,92,246,0.8)]">
            <path d="M55 12 26 56h20l-7 32 34-46H52z" fill="url(#lg)" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="1" stopColor="#ff3d8e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="font-display text-2xl font-bold tracking-[0.18em] text-white">
            NEXO <span className="text-white/40 font-medium">ENERGY</span>
          </div>
        </div>

        {/* progress */}
        <div className="w-64 sm:w-80">
          <div className="h-px w-full bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="kicker">{translations[lang].loader.label}</span>
            <span className="font-display text-sm tabular-nums text-white/70">{Math.floor(pct)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
