import { useStore } from "../store";
import { LANGS } from "../locales";
import { cn } from "../utils/cn";

/** UZ / RU / EN switcher — elegant segmented pills */
export default function LangSwitch({ className }: { className?: string }) {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider transition-all duration-300",
            lang === l.code
              ? "bg-white text-black shadow-[0_2px_14px_rgba(255,255,255,0.25)]"
              : "text-white/45 hover:text-white"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
