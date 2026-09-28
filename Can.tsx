import { useEffect, useMemo } from "react";
import type { MutableRefObject } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FLAVORS } from "../locales";

export interface CanMats {
  body: THREE.MeshStandardMaterial;
  sleeve: THREE.MeshStandardMaterial;
  coat: THREE.MeshStandardMaterial;
  lid: THREE.MeshStandardMaterial;
  sweep: THREE.MeshBasicMaterial;
}

export interface CanModelProps {
  flavor: number;
  /** animated materials are written back through this ref (for the group controller) */
  mats?: MutableRefObject<CanMats | null>;
}

/** generate the brushed-metal vertical gradient used for the exposed top/bottom bands */
function bodyCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  let g = ctx.createLinearGradient(0, 0, 0, 30);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.55, "#8e8e96");
  g.addColorStop(1, "#17181d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 768, 30);
  g = ctx.createLinearGradient(0, 30, 0, 200);
  g.addColorStop(0, "#9a9aa2");
  g.addColorStop(0.08, "#d9d9de");
  g.addColorStop(0.24, "#5c5d65");
  g.addColorStop(0.62, "#cdced4");
  g.addColorStop(0.85, "#6b6c74");
  g.addColorStop(1, "#131418");
  ctx.fillStyle = g;
  ctx.fillRect(0, 30, 768, 170);
  g = ctx.createLinearGradient(0, 200, 0, 256);
  g.addColorStop(0, "#1b1c21");
  g.addColorStop(0.5, "#83848c");
  g.addColorStop(1, "#e8e8ec");
  ctx.fillStyle = g;
  ctx.fillRect(0, 200, 768, 56);
  return c;
}

/** vertical soft white band used as an additive light sweep */
function sweepCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 128, 512);
  const g = ctx.createLinearGradient(0, 130, 0, 250);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 130, 128, 120);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return c;
}

/**
 * Procedural soda can — real geometry, real materials:
 * brushed-metal body, label sleeve with emissive brand color, glossy
 * clear coat, additive light sweep and a beveled lid/bottom.
 * Label artwork lives in /public/textures/label-<flavor>.jpg.
 */
export function CanModel({ flavor, mats }: CanModelProps) {
  const meta = FLAVORS[flavor % FLAVORS.length];
  const label = useTexture(`/textures/label-${meta.id}.jpg`);
  const noise = useTexture("/textures/noise.png");

  const materialBundle = useMemo(() => {
    const bodyTex = new THREE.CanvasTexture(bodyCanvas());
    bodyTex.colorSpace = THREE.SRGBColorSpace;

    const labelTex = label.clone();
    labelTex.colorSpace = THREE.SRGBColorSpace;
    labelTex.anisotropy = 8;
    labelTex.needsUpdate = true;

    const roughTex = noise.clone();
    roughTex.wrapS = THREE.RepeatWrapping;
    roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.repeat.set(5, 1);
    roughTex.needsUpdate = true;

    const sweepTex = new THREE.CanvasTexture(sweepCanvas());

    const body = new THREE.MeshStandardMaterial({
      map: bodyTex,
      roughnessMap: roughTex,
      metalness: 0.78,
      roughness: 0.34,
      transparent: true,
    });
    const sleeve = new THREE.MeshStandardMaterial({
      map: labelTex,
      metalness: 0.62,
      roughness: 0.32,
      emissive: new THREE.Color(meta.css),
      emissiveMap: labelTex,
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.96,
    });
    const coat = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.05,
      color: new THREE.Color("#ffffff"),
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const lid = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.22,
      color: new THREE.Color("#aeb0b8"),
      transparent: true,
    });
    const sweep = new THREE.MeshBasicMaterial({
      map: sweepTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { body, sleeve, coat, lid, sweep };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  useEffect(() => {
    if (mats) mats.current = materialBundle;
    return () => {
      if (mats && mats.current === materialBundle) mats.current = null;
    };
  }, [mats, materialBundle]);

  return (
    <group>
      {/* brushed-metal body (top & bottom bands remain visible) */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 1.05, 48, 1]} />
        <primitive object={materialBundle.body} attach="material" />
      </mesh>
      {/* label sleeve */}
      <mesh>
        <cylinderGeometry args={[0.402, 0.402, 0.9, 48, 1]} />
        <primitive object={materialBundle.sleeve} attach="material" />
      </mesh>
      {/* glossy clear coat */}
      <mesh>
        <cylinderGeometry args={[0.403, 0.403, 0.88, 48, 1]} />
        <primitive object={materialBundle.coat} attach="material" />
      </mesh>
      {/* additive light sweep */}
      <mesh>
        <cylinderGeometry args={[0.404, 0.404, 0.88, 48, 1]} />
        <primitive object={materialBundle.sweep} attach="material" />
      </mesh>
      {/* lid + rim + pull tab surface */}
      <mesh position={[0, 0.525, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.026, 48, 1]} />
        <primitive object={materialBundle.lid} attach="material" />
      </mesh>
      <mesh position={[0, 0.539, 0]}>
        <torusGeometry args={[0.376, 0.016, 16, 48]} />
        <primitive object={materialBundle.lid} attach="material" />
      </mesh>
      <mesh position={[0, 0.551, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.008, 48, 1]} />
        <primitive object={materialBundle.lid} attach="material" />
      </mesh>
      {/* bottom cap */}
      <mesh position={[0, -0.527, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 48, 1]} />
        <primitive object={materialBundle.lid} attach="material" />
      </mesh>
    </group>
  );
}
