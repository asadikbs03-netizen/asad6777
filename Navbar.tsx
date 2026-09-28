import { useEffect, useState } from "react";
import { useStore, scrollToId } from "../store";
import { translations } from "../locales";
import LangSwitch from "./LangSwitch";
import { cn } from "../utils/cn";

const NAV_IDS = ["#home", "#catalog", "#flavors", "#about", "#contact"] as const;

function Logo() {
  return (
    <button onClick={() => scrollToId("#home")} className="flex items-center gap-2.5" aria-label="NEXO ENERGY">
      <svg width="26" height="26" viewBox="0 0 100 100" className="drop-shadow-[0_0_14px_rgba(139,92,246,0.7)]">
        <path d="M55 12 26 56h20l-7 32 34-46H52z" fill="url(#navlg)" />
        <defs>
          <linearGradient id="navlg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#ff3d8e" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-[15px] font-bold tracking-[0.22em] text-white">
        NEXO <span className="text-white/40">ENERGY</span>
      </span>
    </button>
  );
}

export default function Navbar() {
  const lang = useStore((s) => s.lang);
  const t = translations[lang];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [t.nav.home, t.nav.products, t.nav.flavors, t.nav.about, t.nav.contact];

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[60]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {links.map((label, i) => (
              <button
                key={NAV_IDS[i]}
                onClick={() => go(NAV_IDS[i])}
                className="text-[13px] font-medium text-white/55 transition-colors duration-300 hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitch className="hidden sm:flex" />
            <button onClick={() => go("#catalog")} className="btn-primary !px-5 !py-2.5 !text-[12px] hidden lg:inline-flex">
              {t.nav.cta}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
            >
              <div className="space-y-1.5">
                <span className={cn("block h-px w-4 bg-white transition-all duration-300", open && "translate-y-[3.5px] rotate-45")} />
                <span className={cn("block h-px w-4 bg-white transition-all duration-300", open && "opacity-0")} />
                <span className={cn("block h-px w-4 bg-white transition-all duration-300", open && "-translate-y-[9.5px] -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[55] flex flex-col bg-[#06070a]/95 backdrop-blur-2xl transition-all duration-500 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((label, i) => (
            <button
              key={NAV_IDS[i]}
              onClick={() => go(NAV_IDS[i])}
              className="font-display py-3 text-left text-3xl font-semibold text-white/80 transition-colors hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-8 py-6">
          <LangSwitch />
          <button onClick={() => go("#catalog")} className="btn-primary !px-6 !py-3 !text-[12px]">
            {t.nav.cta}
          </button>
        </div>
      </div>
    </>
  );
}
