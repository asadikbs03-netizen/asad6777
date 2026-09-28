import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useStore } from "../store";
import { budgetFps } from "../three/quality";
import { flavorForScroll, FLAVORS } from "../three/flavors";

gsap.registerPlugin(ScrollTrigger);

/**
 * Orchestrates the whole scroll story:
 *  - Lenis smooth scrolling wired into GSAP's ticker
 *  - one master ScrollTrigger drives `store.progress` (0..1)
 *  - derived triggers handle the active flavor, section fades,
 *    reveal animations and flavor-chip highlights
 *  - a lightweight fps watchdog steps quality down when needed
 */
export function useStory(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return;
    const root = rootRef.current;

    const setProgress = useStore.getState().setProgress;
    const setActiveIndex = useStore.getState().setActiveIndex;
    const budget = budgetFps(useStore.getState().quality);

    /* ---------------- smooth scrolling ---------------- */
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.4,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // hold scrolling until the loader exits
    lenis.stop();
    const unsubEntered = useStore.subscribe((s, prev) => {
      if (s.entered && !prev.entered) lenis.start();
    });
    window.scrollTo(0, 0);

    const triggers: ScrollTrigger[] = [];

    /* ---------------- master progress ---------------- */
    const main = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });
    triggers.push(main);

    /* ---------------- active flavor ---------------- */
    const active = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = flavorForScroll(self.progress * 6);
        if (useStore.getState().activeIndex !== idx) setActiveIndex(idx);
      },
    });
    triggers.push(active);

    /* ---------------- section fades (in from bottom, out at top) ---------------- */
    const smooth01 = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const sectionEls = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    sectionEls.forEach((el) => {
      if (el.dataset.scene === "cta") return; // handled separately (no fade-out at page end)
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "top -60%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const o = smooth01(0, 0.16, p) * (1 - smooth01(0.68, 0.94, p));
          el.style.opacity = String(o);
          el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        },
      });
      triggers.push(st);
    });

    /* ---------------- one-shot reveals ---------------- */
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    revealEls.forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () => el.classList.add("reveal-visible"),
        })
      );
    });

    /* ---------------- scrub reveals (opacity + rise) ---------------- */
    const autoEls = Array.from(root.querySelectorAll<HTMLElement>(".auto-reveal"));
    autoEls.forEach((el) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        end: "top 38%",
        scrub: true,
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, self.progress));
          el.style.opacity = String(p);
          el.style.transform = `translateY(${(1 - p) * 34}px)`;
        },
      });
      triggers.push(st);
    });

    /* ---------------- flavor chips follow the 3D selection ---------------- */
    const chipEls = Array.from(root.querySelectorAll<HTMLElement>("[data-chip]"));
    const chipTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const u = self.progress * 6;
        const idx = flavorForScroll(u);
        const inCatalog = u >= 0.95 && u <= 2.06;
        const inShowcase = u >= 2.0 && u <= 4.2;
        chipEls.forEach((el, i) => {
          const on = i === idx && (inCatalog || inShowcase);
          el.classList.toggle("chip-active", on);
          el.style.setProperty("--chip-color", FLAVORS[i].css);
        });
      },
    });
    triggers.push(chipTrigger);

    /* ---------------- CTA scene rise-in (no fade-out at page end) ---------------- */
    const ctaEl = root.querySelector<HTMLElement>('[data-scene="cta"]');
    if (ctaEl) {
      const st = ScrollTrigger.create({
        trigger: ctaEl,
        start: "top 100%",
        end: "top 25%",
        scrub: true,
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, self.progress));
          ctaEl.style.opacity = String(p);
          ctaEl.style.transform = `translateY(${(1 - p) * 44}px)`;
          ctaEl.style.pointerEvents = p > 0.5 ? "auto" : "none";
        },
      });
      triggers.push(st);
    }

    /* ---------------- hero entrance (after loader) ---------------- */
    const unsubHero = useStore.subscribe((s, prev) => {
      if (s.entered && !prev.entered) {
        const heroEl = root.querySelector<HTMLElement>(".hero-in");
        if (heroEl) heroEl.classList.add("play");
      }
    });

    /* ---------------- fps watchdog ---------------- */
    let frames = 0;
    let last = performance.now();
    const count = () => {
      frames++;
    };
    gsap.ticker.add(count);
    const checkId = window.setInterval(() => {
      const now = performance.now();
      const fps = (frames * 1000) / Math.max(1, now - last);
      last = now;
      frames = 0;
      if (fps > 0 && fps < budget && useStore.getState().quality !== "low") {
        useStore.getState().setQuality("low");
      }
    }, 2200);

    return () => {
      window.clearInterval(checkId);
      gsap.ticker.remove(count);
      gsap.ticker.remove(raf);
      unsubHero();
      unsubEntered();
      triggers.forEach((tr) => tr.kill());
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [enabled, rootRef]);
}
