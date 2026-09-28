/**
 * NEXO ENERGY — 3D story data.
 * The whole scroll journey is expressed as "story units" u in [0, 6]:
 *   u 0–1  hero intro      u 2–3  featured details (flavor 0)
 *   u 1–2  catalog lineup  u 3–4  product transition (left → right handoff)
 *   u 4–5  brand story     u 5–6  final lineup + CTA
 */

export const SCROLL_HEIGHT = 800; // total scroll canvas height in vh
export const CAN_WORLD_H = 1.38;

/* ------------------------------------------------------------------ */
/* Flavor selection timeline                                           */
/* ------------------------------------------------------------------ */

export interface Segment {
  f: number;
  from: number;
  to: number;
}

export const SEGMENTS: Segment[] = [
  { f: 0, from: 1.15, to: 2.45 },
  { f: 1, from: 2.75, to: 3.45 },
  { f: 2, from: 3.45, to: 4.0 },
  { f: 3, from: 4.0, to: 4.55 },
  { f: 4, from: 4.55, to:5.9 },
];

export function flavorForScroll(u: number): number {
  for (const s of SEGMENTS) if (u >= s.from && u < s.to) return s.f;
  return u < SEGMENTS[0].from ? 0 : 4;
}

/** 0..1 selection envelope for a flavor at story unit u */
export function segmentSel(f: number, u: number): number {
  const s = SEGMENTS[f];
  const center = (s.from + s.to) / 2;
  const half = (s.to - s.from) / 2;
  const d = Math.abs(u - center) / half;
  if (d <= 0.55) return 1;
  return Math.min(1, Math.max(0, 1 - smoothstep(0.55, 1, d)));
}

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* Can choreography                                                    */
/* ------------------------------------------------------------------ */

export interface CanPose {
  x: number;
  y: number;
  z: number;
  s: number;
  /** hero emissive emphasis 0..1 */
  e: number;
  /** light-sweep highlight 0..1 */
  sweep: number;
}

export const LINEUP_X = (f: number) => -2.2 + 1.1 * f;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPose = (a: CanPose, b: CanPose, t: number): CanPose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  s: lerp(a.s, b.s, t),
  e: lerp(a.e, b.e, t),
  sweep: lerp(a.sweep, b.sweep, t),
});

/**
 * Primary pose solver for u < 4.4 (hero, catalog, details, transition).
 * Each can blends between its "catalog pick" pose (rises to center of the
 * lineup) and its "showcase hero" pose (close-up, left or right of frame).
 */
export function canPose(f: number, u: number): CanPose {
  const sel = segmentSel(f, u);
  const side = f === 0 ? -1 : 1;
  const lx = LINEUP_X(f);

  // catalog pose: lineup -> hero pick at center
  const cx = lerp(lx, 0, sel);
  const cy = 0.09;
  const cz = lerp(0.2, 0.85, sel);
  const cs = lerp(0.68, 1.07, sel);

  // showcase pose: offstage -> close-up hero at the side of the frame
  const sx = lerp(side * 5.6, side * 2.45, sel);
  const sy = lerp(-0.95, 0.07, sel);
  const sz = lerp(-2.4, 0.9, sel);
  const ss = lerp(0.5, 1.2, sel);

  // cross-fade between catalog behavior and showcase behavior
  const blob = smoothstep(1.7, 2.2, u);

  return {
    x: lerp(cx, sx, blob),
    y: lerp(cy, sy, blob),
    z: lerp(cz, sz, blob),
    s: lerp(cs, ss, blob),
    e: 0.25 * sel,
    sweep: 0.2 * sel,
  };
}

/** compact band pose used by the brand-story scene */
export const BAND_POSE = (f: number): CanPose => ({
  x: -0.45 + 0.225 * f,
  y: -0.18,
  z: 0.12,
  s: 0.74,
  e: 0.12,
  sweep: 0.06,
});

/** final lineup for the CTA scene — hero can raised in the center */
export const FINAL_POSE = (f: number): CanPose => ({
  x: -2.2 + 1.1 * f,
  y: f === 2 ? 0.55 : 0.09,
  z: f === 2 ? 1.55 : 0.45,
  s: f === 2 ? 1.14 : 0.84,
  e: f === 2 ? 0.2 : 0.06,
  sweep: f === 2 ? 0.16 : 0,
});

/** Full pose solver including story (band) and final scenes */
export function poseFor(f: number, u: number): CanPose {
  if (u < 4.4) return canPose(f, u);
  const from = canPose(f, 4.4);
  if (u < 5.0) return lerpPose(from, BAND_POSE(f), smoothstep(4.4, 5.0, u));
  if (u < 5.85) return lerpPose(BAND_POSE(f), FINAL_POSE(f), smoothstep(5.0, 5.85, u));
  return FINAL_POSE(f);
}

/* ------------------------------------------------------------------ */
/* Camera — piecewise cinematic anchors (interpolated with smoothstep) */
/* ------------------------------------------------------------------ */

export interface CamAnchor {
  u: number;
  x: number;
  y: number;
  z: number;
  lx: number;
  ly: number;
  lz: number;
  fov: number;
}

export const CAMERA_ANCHORS: CamAnchor[] = [
  { u: 0.0, x: 0, y: 0.05, z: 4.9, lx: 0, ly: 0.16, lz: 0, fov: 44 },
  { u: 1.55, x: 0, y: 0.05, z: 4.9, lx: 0, ly: 0.16, lz: 0, fov: 44 },
  { u: 2.1, x: -2.5, y: 0.02, z: 2.42, lx: -2.36, ly: 0.1, lz: 0.86, fov: 48 },
  { u: 2.9, x: -2.56, y: 0.02, z: 2.26, lx: -2.34, ly: 0.12, lz: 0.88, fov: 52 },
  { u: 3.6, x: 2.42, y: 0.02, z: 2.26, lx: 2.3, ly: 0.12, lz: 0.88, fov: 52 },
  { u: 4.15, x: 0, y: 0.05, z: 4.6, lx: 0, ly: 0.14, lz: 0, fov: 42 },
  { u: 4.85, x: 0, y: 0.05, z: 4.6, lx: 0, ly: 0.14, lz: 0, fov: 42 },
  { u: 5.5, x: 0, y: 0.26, z: 4.05, lx: 0, ly: 0.18, lz: 0, fov: 46 },
  { u: 6.0, x: 0, y: 0.26, z: 4.05, lx: 0, ly: 0.18, lz: 0, fov: 46 },
];

export function cameraAt(u: number): CamAnchor {
  const a = CAMERA_ANCHORS;
  const out = { ...a[0] };
  let prev = a[0];
  for (let i = 1; i < a.length; i++) {
    const nxt = a[i];
    if (u <= nxt.u) {
      const k = smoothstep(prev.u, nxt.u, u);
      out.x = lerp(prev.x, nxt.x, k);
      out.y = lerp(prev.y, nxt.y, k);
      out.z = lerp(prev.z, nxt.z, k);
      out.lx = lerp(prev.lx, nxt.lx, k);
      out.ly = lerp(prev.ly, nxt.ly, k);
      out.lz = lerp(prev.lz, nxt.lz, k);
      out.fov = lerp(prev.fov, nxt.fov, k);
      break;
    }
    prev = nxt;
    if (i === a.length - 1) {
      out.x = nxt.x; out.y = nxt.y; out.z = nxt.z;
      out.lx = nxt.lx; out.ly = nxt.ly; out.lz = nxt.lz; out.fov = nxt.fov;
    }
  }
  return out;
}
