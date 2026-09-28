import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "../store";
import { qualityProfile } from "./quality";
import { FLAVORS } from "../locales";
import { cameraAt } from "./data";
import { CanGroup } from "./CanGroup";

/* ------------------------------------------------------------------ */
/* Camera rig — piecewise cinematic anchors + pointer parallax +       */
/* gentle breathing so the whole frame feels alive.                    */
/* ------------------------------------------------------------------ */
function CameraRig({ reduced }: { reduced: boolean }) {
  const cam = useRef<THREE.PerspectiveCamera | null>(null);
  const px = useRef(0);
  const py = useRef(0);
  const tx = useRef(0);
  const ty = useRef(0);
  const fov = useRef(44);
  const getCamera = useThree((s) => s.camera);

  useEffect(() => {
    cam.current = getCamera as THREE.PerspectiveCamera;
  }, [getCamera]);

  // pointer tracking on window — the canvas sits behind the UI layer
  useEffect(() => {
    const hoverOk = window.matchMedia("(hover: hover)").matches;
    if (!hoverOk) return;
    const onMove = (e: PointerEvent) => {
      tx.current = (e.clientX / window.innerWidth) * 2 - 1;
      ty.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    if (!cam.current) cam.current = state.camera as THREE.PerspectiveCamera;
    const d = Math.min(dt, 0.05);

    // damped pointer parallax (subtle, premium)
    if (!reduced) {
      px.current += (tx.current - px.current) * Math.min(1, d * 2.2);
      py.current += (ty.current - py.current) * Math.min(1, d * 2.2);
    }

    const progress = useStore.getState().progress;
    const u = progress * 6;
    const a = cameraAt(u);

    // widen the frame on narrow screens so the hero can stays in view
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fovBoost = aspect < 0.6 ? 1.24 : aspect < 1 ? 1.1 : 1;

    // inner cinematic micro-curves on top of the anchors
    let ox = 0, oy = 0, oz = 0;
    if (u < 1.15) {
      const k = Math.sin(Math.min(1, u / 1.15) * Math.PI);
      oz = -k * 0.32;
      ox = Math.sin(Math.min(1, u) * Math.PI) * 0.2;
    } else if (u < 4.3) {
      const k = (u - 1.9) / 2.4;
      ox = Math.sin(k * Math.PI * 3.1) * 0.05;
      oy = -Math.sin(k * Math.PI * 2.2) * 0.05;
      oz = Math.sin(k * Math.PI * 1.6) * 0.14;
    } else if (u < 5.2) {
      oz = -Math.sin(((u - 4.3) / 0.9) * Math.PI) * 0.25;
    } else {
      oz = Math.sin(((u - 5.2) / 0.8) * Math.PI) * 0.12;
      oy = Math.sin(((u - 5.2) / 0.8) * Math.PI) * 0.04;
    }

    // idle breath
    const breath = reduced ? 0 : 1;
    ox += Math.cos(useStore.getState().progress * 24) * 0.012 * breath;
    oy += Math.sin(useStore.getState().progress * 20) * 0.01 * breath;

    // parallax amplitude — smaller in close-ups to keep focus
    const closeup = u > 1.9 && u < 4.35;
    const amp = closeup ? 0.055 : 0.14;
    const pyy = reduced ? 0 : py.current;

    const camX = a.x + ox + px.current * amp * breath;
    const camY = a.y + oy + pyy * amp * 0.55 * breath;
    const camZ = a.z + oz;

    const c = cam.current;
    c.position.x += (camX - c.position.x) * (1 - Math.exp(-d * 3.2));
    c.position.y += (camY - c.position.y) * (1 - Math.exp(-d * 3.2));
    c.position.z += (camZ - c.position.z) * (1 - Math.exp(-d * 3.2));

    const lx = a.lx + px.current * amp * 0.25 * breath;
    const ly = a.ly + pyy * amp * 0.25 * breath;
    c.lookAt(lx, ly, a.lz);

    fov.current += (a.fov * fovBoost - fov.current) * Math.min(1, d * 1.6);
    if (Math.abs(c.fov - fov.current) > 0.01) {
      c.fov = fov.current;
      c.updateProjectionMatrix();
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Follow light — emphasizes whichever flavor is currently the hero    */
/* ------------------------------------------------------------------ */
function HeroFollowLight({ reduced }: { reduced: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const scene = useThree((s) => s.scene);
  const color = useRef(new THREE.Color("#ffffff"));

  useEffect(() => {
    scene.add(target);
    return () => {
      scene.remove(target);
    };
  }, [scene, target]);

  useFrame((_, dt) => {
    if (!light.current) return;
    const d = Math.min(dt, 0.05);
    const store = useStore.getState();
    const active = store.activeIndex;
    const u = store.progress * 6;
    const pos = { x: active === 0 ? -2.45 : 2.45, y: 0.05, z: 0.9 };
    const move = u > 1.2 && u < 4.5 ? 1 : 0;
    const lx = pos.x;
    const ly = pos.y + 0.9;
    const lz = pos.z + 1.1;

    light.current.position.x += (lx - light.current.position.x) * (1 - Math.exp(-d * (2 + move * 2)));
    light.current.position.y += (ly - light.current.position.y) * (1 - Math.exp(-d * (2 + move * 2)));
    light.current.position.z += (lz - light.current.position.z) * (1 - Math.exp(-d * (2 + move * 2)));
    target.position.set(pos.x, pos.y + 0.2, pos.z);
    light.current.target = target;

    const c = new THREE.Color(FLAVORS[active].css).lerp(new THREE.Color("#ffffff"), 0.55);
    color.current.lerp(c, Math.min(1, d * 2));
    light.current.color.copy(color.current);
    light.current.intensity += ((reduced ? 40 : 60) * (0.55 + 0.45 * Math.min(1, Math.max(0, move))) - light.current.intensity) * Math.min(1, d * 1.4);
  });

  return (
    <spotLight
      ref={light}
      angle={0.42}
      penumbra={0.75}
      decay={1.4}
      distance={14}
      castShadow
      shadow-mapSize-width={512}
      shadow-mapSize-height={512}
      shadow-bias={-0.0004}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Environment — local studio reflections (no network HDR needed)      */
/* ------------------------------------------------------------------ */
function StudioEnv({ samples }: { samples: number }) {
  return (
    <Environment resolution={samples} frames={1}>
      <color attach="background" args={["#05060a"]} />
      <Lightformer intensity={3.2} position={[0, 6, -8]} scale={[14, 4, 1]} />
      <Lightformer intensity={1.6} position={[-6, 1, -2]} rotation-y={Math.PI / 2} scale={[16, 0.7, 1]} />
      <Lightformer intensity={1.2} position={[7, 2, 1]} rotation-y={-Math.PI / 2} scale={[16, 0.6, 1]} />
      <Lightformer intensity={0.9} position={[0, -3, 3]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
    </Environment>
  );
}

/* ------------------------------------------------------------------ */
/* Main story scene                                                    */
/* ------------------------------------------------------------------ */
function StoryScene({ quality }: { quality: keyof typeof qualityProfile }) {
  const t = useRef(0);
  const w = useRef(0);
  const reduced = useStore((s) => s.reduced);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const target = useStore.getState().progress;
    t.current += (target - t.current) * (1 - Math.exp(-d * 4.4));
    w.current += d * (reduced ? 0.12 : 0.34);
  });

  return (
    <>
      <color attach="background" args={["#06070a"]} />
      <fog attach="fog" args={["#06070a", 7.5, 17]} />

      <CameraRig reduced={reduced} />
      <HeroFollowLight reduced={reduced} />

      {/* key light */}
      <spotLight
        position={[-7, 6.5, 5.5]}
        angle={0.6}
        penumbra={0.65}
        intensity={110}
        decay={1.4}
        distance={30}
        castShadow={qualityProfile[quality].shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
      {/* rim light */}
      <spotLight position={[7.5, 3.5, -6]} angle={0.75} penumbra={0.9} intensity={80} decay={1.4} distance={26} color="#8b5cf6" />
      {/* cool fill */}
      <spotLight position={[0, 2.5, 7]} angle={0.8} penumbra={1} intensity={26} decay={1.2} distance={22} color="#38bdf8" />
      <ambientLight intensity={0.14} />

      <StudioEnv samples={qualityProfile[quality].envSamples} />

      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.66, 0]} receiveShadow={qualityProfile[quality].shadows}>
        <circleGeometry args={[19, 64]} />
        <meshStandardMaterial color="#0b0d13" metalness={0.85} roughness={0.36} envMapIntensity={0.5} />
      </mesh>

      {FLAVORS.map((_, i) => (
        <CanGroup key={i} flavor={i} t={t} w={w} reduced={reduced} />
      ))}

      {quality !== "low" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={1.0} luminanceSmoothing={0.15} mipmapBlur radius={0.72} />
        </EffectComposer>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas wrapper                                                      */
/* ------------------------------------------------------------------ */
export default function Scene() {
  const quality = useStore((s) => s.quality);
  const setReady = useStore((s) => s.setReady);
  const profile = qualityProfile[quality];

  return (
    <Canvas
      dpr={profile.dpr}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.05, 4.9], fov: 44, near: 0.1, far: 60 }}
      onCreated={() => setReady(true)}
    >
      <Suspense fallback={null}>
        <StoryScene quality={quality} />
      </Suspense>
    </Canvas>
  );
}
