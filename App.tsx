import { Suspense, lazy, useEffect, useRef } from "react";
import { useStore } from "./store";
import { useStory } from "./hooks/useStory";
import { detectQuality } from "./three/quality";
import { SCROLL_HEIGHT } from "./three/data";
import Navbar from "./ui/Navbar";
import Chrome from "./ui/Chrome";
import Loader from "./ui/Loader";
import Hero from "./sections/Hero";
import Catalog from "./sections/Catalog";
import Details from "./sections/Details";
import Transition from "./sections/Transition";
import Story from "./sections/Story";
import Cta from "./sections/Cta";
import Footer from "./sections/Footer";
import Fallback from "./sections/Fallback";

const Scene = lazy(() => import("./three/Scene"));

export default function App() {
  const webglOk = useStore((s) => s.webglOk);
  const quality = useStore((s) => s.quality);
  const rootRef = useRef<HTMLDivElement>(null);

  // device profile: quality, reduced-motion, WebGL availability
  useEffect(() => {
    useStore.getState().setQuality(detectQuality());
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      useStore.getState().setWebglOk(ok);
    } catch {
      useStore.getState().setWebglOk(false);
    }
    useStore
      .getState()
      .setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useStory(rootRef, webglOk);

  if (!webglOk) {
    return (
      <>
        <Navbar />
        <Fallback />
        <Footer />
      </>
    );
  }

  return (
    <div className="relative">
      {/* fixed WebGL stage behind the scroll story */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none" aria-hidden="true">
        <Suspense fallback={null}>
          <Scene key={quality} />
        </Suspense>
      </div>

      {/* scroll story: 800vh of scenes, each pinned by viewport height */}
      <div ref={rootRef} className="relative z-10" style={{ height: `${SCROLL_HEIGHT}vh` }}>
        <Navbar />
        <Chrome />
        <Hero />
        <Catalog />
        <Details />
        <Transition />
        <Story />
        <Cta />
      </div>

      <Footer />
      <Loader />
    </div>
  );
}
