"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import LatentField from "@/components/scene/LatentField";
import { fieldState } from "@/components/scene/fieldState";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useTheme } from "@/lib/useTheme";

/** Resolved once on mount. Re-resolving on resize would rebuild 40k buffers. */
function resolveCount(): number {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const tablet = window.matchMedia("(max-width: 1279px)").matches;
  const base = mobile ? 8_000 : tablet ? 15_000 : 40_000;

  // Very high density displays pay for every point twice over.
  return window.devicePixelRatio >= 3 ? Math.round(base * 0.6) : base;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Translates cursor position into world units on the z = 0 plane and writes it
 * to the shared field state. Lives inside the Canvas so it can read the
 * resolved viewport, but touches no React state.
 */
function PointerBridge() {
  const { viewport } = useThree();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      fieldState.mouseX = (e.clientX / window.innerWidth - 0.5) * viewport.width;
      fieldState.mouseY = -(e.clientY / window.innerHeight - 0.5) * viewport.height;
      fieldState.mouseStrength = 1;
    };
    const onLeave = () => {
      fieldState.mouseStrength = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [viewport.width, viewport.height]);

  return null;
}

/** Shown when WebGL is unavailable. The page must never be blank. */
function FieldFallback() {
  return (
    <div
      aria-hidden="true"
      className="field-canvas"
      style={{
        background:
          "radial-gradient(closest-side at 50% 45%, color-mix(in srgb, var(--iodine) 22%, transparent), transparent 70%)",
      }}
    />
  );
}

export default function Scene() {
  const reducedMotion = useReducedMotion();
  const theme = useTheme();
  const light = theme === "light";
  const [count, setCount] = useState<number | null>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    if (!supportsWebGL()) {
      setWebgl(false);
      return;
    }
    setCount(resolveCount());
  }, []);

  if (!webgl) return <FieldFallback />;
  if (count === null) return null;

  return (
    <div className="field-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 6] }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PointerBridge />
        <LatentField count={count} reducedMotion={reducedMotion} light={light} />
        {!reducedMotion && !light && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.38}
              luminanceThreshold={0.22}
              luminanceSmoothing={0.45}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
