"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fieldVert } from "@/shaders/field.vert";
import { fieldFrag } from "@/shaders/field.frag";
import { fieldState } from "@/components/scene/fieldState";

const RADIUS = 1.75;

/** Repulsion is specified in CSS pixels; the shader needs world units. */
const REPEL_PX = 180;

type Props = {
  count: number;
  reducedMotion: boolean;
};

export default function LatentField({ count, reducedMotion }: Props) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  // Buffers are built once. Scroll states in P2 lerp between extra target
  // attributes rather than regenerating any of this.
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const dists = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Uniform-in-sphere would be cbrt(u). A higher exponent pulls points
      // toward the centre, which is what makes the core read as dense.
      const u = Math.random();
      const r = RADIUS * Math.pow(u, 0.62);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);

      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scales[i] = 0.55 + Math.random() * 1.05;
      seeds[i] = Math.random();
      dists[i] = r / RADIUS;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aDist", new THREE.BufferAttribute(dists, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS * 2);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: reducedMotion ? 1 : 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseStrength: { value: 0 },
      uMouseRadius: { value: 1 },
      uSize: { value: 10 },
      uPixelRatio: { value: 1 },
      uPulse: { value: 0 },
      uIodine: { value: new THREE.Color("#7B5CFF") },
      uEmber: { value: new THREE.Color("#FF5A1F") },
    }),
    // Built once. reducedMotion only seeds the initial reveal value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;

    // Reduced motion renders a single resolved frame and then stops animating.
    if (reducedMotion) {
      u.uReveal.value = 1;
      u.uMouseStrength.value = 0;
      return;
    }

    // Clamped so a backgrounded tab does not resume with a huge jump.
    u.uTime.value += Math.min(delta, 0.05);
    u.uReveal.value = fieldState.reveal;
    u.uProgress.value = fieldState.progress;
    u.uPulse.value = fieldState.pulse;

    // World units per CSS pixel at the z = 0 plane.
    const worldPerPx = viewport.height / size.height;
    u.uMouseRadius.value = REPEL_PX * worldPerPx;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uSize.value = 7.5 * (size.height / 900);

    // Lagged follow. The lag is what gives the ~0.8s ease back, rather than
    // points snapping home the instant the cursor moves.
    const m = u.uMouse.value as THREE.Vector3;
    const lag = 1 - Math.pow(0.001, delta);
    m.x += (fieldState.mouseX - m.x) * lag;
    m.y += (fieldState.mouseY - m.y) * lag;

    const target = fieldState.mouseStrength * u.uMouseRadius.value * 0.5;
    u.uMouseStrength.value +=
      (target - u.uMouseStrength.value) * (1 - Math.pow(0.02, delta));
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={fieldVert}
        fragmentShader={fieldFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
