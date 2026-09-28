import type { Quality } from "../store";

/**
 * Detect a sensible render-quality profile from hardware hints,
 * preferring a smooth premium experience on weaker devices.
 */
export function detectQuality(): Quality {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "high";
  try {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "low";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = (dbg && gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER);
    const r = String(renderer).toLowerCase();
    const gpu = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const coarseCores = navigator.hardwareConcurrency || 4;
    const mem = (nav.deviceMemory || 8) as number;
    const mobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    const apple = /apple/i.test(r);
    const integrated = /intel|radeon graphics|uhd graphics|iris/i.test(r);
    const desktopWeak = !mobile && integrated && !apple;

    if (mem <= 2 || coarseCores <= 2 || gpu < 4096 || mobile) return "low";
    if (mem <= 4 || coarseCores <= 4 || desktopWeak) return "medium";
    return "high";
  } catch {
    return "medium";
  }
}

/** Rough 60fps budget for content-locked sections */
export function budgetFps(quality: Quality): number {
  return quality === "high" ? 60 : quality === "medium" ? 45 : 32;
}

/** Quality profiles used by the 3D scene */
export const qualityProfile = {
  high: { dpr: 1.8, shadows: true, envSamples: 64 },
  medium: { dpr: 1.4, shadows: true, envSamples: 32 },
  low: { dpr: 1.15, shadows: false, envSamples: 8 },
} as const;

export const isMobileDevice = () =>
  typeof window !== "undefined" && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
