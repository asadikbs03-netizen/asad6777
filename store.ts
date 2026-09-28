import { create } from "zustand";
import type { Lang } from "./locales";

export type Quality = "high" | "medium" | "low";

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** 3D assets loaded + first frames rendered */
  ready: boolean;
  setReady: (v: boolean) => void;
  /** loader finished its exit animation */
  entered: boolean;
  setEntered: (v: boolean) => void;
  /** index of the hero / selected flavor */
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  quality: Quality;
  setQuality: (q: Quality) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
  /** scroll progress 0..1 driven by the main ScrollTrigger */
  progress: number;
  setProgress: (p: number) => void;
  webglOk: boolean;
  setWebglOk: (v: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  lang: "en",
  setLang: (l) => set({ lang: l }),
  ready: false,
  setReady: (v) => set({ ready: v }),
  entered: false,
  setEntered: (v) => set({ entered: v }),
  activeIndex: 0,
  setActiveIndex: (i) => set({ activeIndex: i }),
  quality: "high",
  setQuality: (q) => set({ quality: q }),
  reduced: false,
  setReduced: (v) => set({ reduced: v }),
  progress: 0,
  setProgress: (p) => set({ progress: p }),
  webglOk: true,
  setWebglOk: (v) => set({ webglOk: v }),
}));

/** tiny helper — smooth scroll to an anchor id (works with Lenis when active) */
export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(id, { offset: -10, duration: 1.8 });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Smooth-scroll to an absolute story position expressed in viewport
 * heights (used by the flavor switcher to jump between hero flavors).
 */
export function scrollToStory(vh: number) {
  const top = (vh / 100) * window.innerHeight;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.9, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}
