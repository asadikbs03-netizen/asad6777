# NEXO ENERGY — Premium Multilingual Scroll-Driven 3D Drink Website

A cinematic, scroll-driven WebGL product experience for a canned energy drink brand.
Five procedural 3D cans live in a dark studio environment; scrolling drives the camera
through seven scenes — hero intro → flavor catalog → featured close-up → product details →
lateral flavor handoff → brand story → final CTA lineup.

- **Stack:** React 19 · Vite 7 · TypeScript · Three.js · React Three Fiber · drei · postprocessing · GSAP + ScrollTrigger · Lenis · Zustand · Tailwind CSS v4
- **Languages:** Uzbek (UZ), Russian (RU), English (EN) — instant switching, no layout break
- **Interactions:** scroll-driven camera, mouse parallax + subtle zoom breath, hero can selection, flavor switcher
- **Performance:** device quality detection (high/medium/low), controlled DPR, optional shadows/bloom, fps watchdog, reduced-motion support
- **Fallback:** graceful static catalog when WebGL is unavailable

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Project structure

```
public/
  textures/            # label artwork + noise (generated assets)
    label-litchi.jpg   # <-- replace to rebrand a flavor
    label-citrus.jpg
    label-berry.jpg
    label-grape.jpg
    label-lime.jpg
    noise.png          # procedural grain used by materials
src/
  locales/index.ts     # ★ ALL text in UZ / RU / EN + flavor data (colors, stats)
  store.ts             # zustand state: lang, progress, active flavor, quality…
  hooks/useStory.ts    # Lenis + ScrollTrigger orchestration (the scroll "movie")
  three/
    data.ts            # story timeline, can choreography, camera anchors
    Can.tsx            # procedural can model (replaceable with GLB if desired)
    CanGroup.tsx       # per-can animation controller
    Scene.tsx          # camera rig, lights, environment, bloom
    quality.ts         # device profiling
    flavors.ts         # re-exports for UI
  ui/                  # Loader, Navbar, LangSwitch, Chrome, FlavorChips
  sections/            # Hero, Catalog, Details, Transition, Story, Cta, Footer, Fallback
  styles (index.css)   # design system, keyframes, reduced-motion overrides
```

## Editing text (translations)

All copy lives in `src/locales/index.ts` — one structured object per language
(`uz`, `ru`, `en`). Edit values there and every component updates instantly.
Flavor metadata (colors `css`, energy %, caffeine, size, flavor notes…) lives in
the `FLAVORS` array in the same file.

## Replacing the cans

The cans are procedural (cylinder + lid + label textures), so you can rebrand
without any 3D tooling:

1. Replace `/public/textures/label-<flavor>.jpg` with any portrait artwork.
2. Update the matching flavor entry in `src/locales/index.ts` (name, css color).

To use real GLB/GLTF models instead (e.g. `/public/models/can-01.glb`), swap the
`CanModel` component in `src/three/Can.tsx` for a `<useGLTF>` mesh — the animation
system in `CanGroup.tsx` (position/rotation/fade) is model-agnostic and will keep
working.

## How the story works

The page is a fixed WebGL stage behind an 800vh scroll document. A master
ScrollTrigger writes normalized progress into the store; the 3D layer smooths it
and maps it to story units `u ∈ [0, 6]`:

| u        | scene                     |
| -------- | ------------------------- |
| 0–1      | hero intro (dolly-in)     |
| 1–2      | flavor catalog (selection)|
| 2–3      | featured close-up (left)  |
| 3–4      | lateral handoff (→ right) |
| 4–5      | brand story (can band)    |
| 5–6      | final lineup + CTA        |

Flavor selection follows `SEGMENTS` in `src/three/data.ts`; camera motion follows
`CAMERA_ANCHORS` in the same file — both are easy to retune.

## Accessibility

- Semantic sections, labelled nav, keyboard-focusable controls
- `prefers-reduced-motion` disables idle motion, parallax and reveals
- Static HTML fallback when WebGL is unavailable
- Touch devices reduce mouse effects automatically

## Notes

- Can label textures and the noise map are generated assets committed to the repo —
  no external 3D asset dependencies at runtime.
- The quality watchdog can downgrade to the `low` profile (no shadows, no bloom,
  lower DPR) if the frame rate dips below budget.
