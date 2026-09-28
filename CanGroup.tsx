import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { CanModel, type CanMats } from "./Can";
import { poseFor, segmentSel, LINEUP_X } from "./data";

interface CanGroupProps {
  flavor: number;
  /** smooth story time 0..1 (0..6 story units = t*6) */
  t: MutableRefObject<number>;
  /** idle clock (radians-ish) */
  w: MutableRefObject<number>;
  reduced: boolean;
}

const _tmp = new THREE.Vector3();

/**
 * One can in the cinematic story. Position follows the pose solver
 * (data.ts) with a damped spring; rotation uses a controlled spin while
 * the flavor is selected and gentle idle sway otherwise. Offstage cans
 * fade out through material opacity for elegant exits/entries.
 */
export function CanGroup({ flavor, t, w, reduced }: CanGroupProps) {
  const grp = useRef<THREE.Group>(null);
  const base = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const mats = useRef<CanMats | null>(null);
  const fade = useRef(1);
  const idx = flavor;

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const g = grp.current;
    const b = base.current;
    const inn = inner.current;
    if (!g || !b || !inn) return;

    const u = t.current * 6;
    const pose = poseFor(idx, u);
    const sel = segmentSel(idx, u);

    _tmp.set(pose.x, pose.y, pose.z);
    g.position.lerp(_tmp, 1 - Math.exp(-d * 3.4));

    // scale compensation: keep the can visually consistent while moving
    const ts = 1 + Math.max(0, pose.s - 1) * 0.55;
    g.scale.setScalar(ts);

    // idle drift + breathing (disabled under reduced motion)
    if (!reduced) {
      const wt = w.current;
      b.position.set(
        Math.sin(wt * 0.5 + idx * 2.3) * 0.02,
        Math.sin(wt * 0.9 + idx * 1.7) * 0.05 + Math.sin(wt * 0.42 + idx * 2.1) * 0.03,
        Math.sin(wt * 0.33 + idx * 1.1) * 0.02
      );
      b.rotation.x = Math.sin(wt * 0.42 + idx * 2.1) * 0.018;
      b.rotation.z = Math.sin(wt * 0.3 + idx * 1.6) * 0.014;
    }

    // rotation: controlled spin while selected, idle sway otherwise
    if (!reduced && sel > 0.01) {
      inn.rotation.y += sel * 0.42 * d;
    } else {
      const target = Math.sin(w.current * 0.3 + idx * 2.2) * 0.1;
      inn.rotation.y += (target - inn.rotation.y) * Math.min(1, d * 1.1);
    }

    // emissive + light sweep
    let e = pose.e;
    let sw = pose.sweep;
    // band & final scenes add a soft ambient emphasis
    if (u >= 4.4 && u < 5.0) {
      e = Math.max(e, 0.12);
      sw = Math.max(sw, 0.06);
    }
    if (u >= 5.0) {
      e = Math.max(e, 0.1);
      sw = Math.max(sw, 0.05);
    }
    const m = mats.current;
    if (m) {
      m.sleeve.emissiveIntensity += (e * 0.55 - m.sleeve.emissiveIntensity) * Math.min(1, d * 2.2);
      m.sweep.opacity += (sw - m.sweep.opacity) * Math.min(1, d * 2.2);
    }

    // offstage fade: hide cans that are neither selected nor in lineup scenes
    const inShowcase = u >= 1.7 && u < 4.4;
    const visibleTarget = inShowcase && sel < 0.01 ? 0 : 1;
    fade.current += (visibleTarget - fade.current) * Math.min(1, d * 2.6);
    if (g.visible && fade.current < 0.045) g.visible = false;
    else if (!g.visible && fade.current >= 0.05) g.visible = true;
    if (m) {
      const op = Math.min(1, Math.max(0, fade.current));
      m.body.opacity = op;
      m.sleeve.opacity = op * 0.96;
      m.coat.opacity = op * 0.1;
      m.lid.opacity = op;
    }
  });

  return (
    <group ref={grp}>
      <group ref={base}>
        <group ref={inner}>
          <CanModel flavor={flavor} mats={mats} />
        </group>
      </group>
    </group>
  );
}

export { LINEUP_X };
