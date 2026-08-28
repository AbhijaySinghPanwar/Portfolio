"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fieldVert } from "@/shaders/field.vert";
import { fieldFrag } from "@/shaders/field.frag";
import { fieldState } from "@/components/scene/fieldState";

const RADIUS = 1.75;

/** Pipeline lanes in the stream state, exactly one per Tech Mahindra beat so
 *  each beat owns a lane. The spec says "~5 lanes"; four makes the mapping
 *  exact and avoids a lane that never lights. */
const LANES = 4;
const LANE_GAP = 0.66;
const STREAM_SPAN = 8.0;

/** The converged core is parked off-centre so it lands in the empty upper
 *  right of the contact section rather than on top of the contact details. */
const CORE_CENTRE: [number, number, number] = [1.15, 0.8, 0];
const CORE_RADIUS = 0.34;

/** The collapsed cluster, parked right of the reading column. A disc rather
 *  than a tall band: at 45 degrees FOV from z=6 the viewport is 4.97 world
 *  units tall, so a 0.82 radius measures ~35vh across once point size and
 *  bloom are added, and stays inside the row rather than bleeding off the top
 *  and bottom of the screen. */
const CLUSTER_CENTRE: [number, number] = [2.85, 0];
const CLUSTER_RADIUS = 0.82;

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
  // Buffers are built once. Scroll states lerp between these target
  // attributes in the vertex shader; nothing here is rebuilt on scroll.
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const stream = new Float32Array(count * 3);
    const collapse = new Float32Array(count * 3);
    const core = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const dists = new Float32Array(count);
    const lanes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // --- sphere: uniform-in-sphere would be cbrt(u). A higher exponent
      // pulls points toward the centre, which makes the core read as dense.
      const u = Math.random();
      const r = RADIUS * Math.pow(u, 0.62);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);

      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // --- stream: five lanes of records moving through a pipeline.
      const lane = i % LANES;
      lanes[i] = lane;
      stream[i * 3] = Math.random() * STREAM_SPAN - STREAM_SPAN / 2;
      // Lane 0 sits at the top so the first beat lights the first lane a
      // reader's eye lands on, scanning downward.
      stream[i * 3 + 1] =
        ((LANES - 1) / 2 - lane) * LANE_GAP + (Math.random() - 0.5) * 0.055;
      stream[i * 3 + 2] = (Math.random() - 0.5) * 0.22;

      // --- collapse: a bounded disc, right of the reading column.
      // sqrt keeps the distribution even across the disc instead of piling
      // every point into the centre.
      const clusterR = CLUSTER_RADIUS * Math.sqrt(Math.random());
      const clusterT = Math.random() * Math.PI * 2;
      collapse[i * 3] = CLUSTER_CENTRE[0] + clusterR * Math.cos(clusterT);
      collapse[i * 3 + 1] = CLUSTER_CENTRE[1] + clusterR * Math.sin(clusterT);
      collapse[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // --- core: one tight cluster.
      const cr = CORE_RADIUS * Math.pow(Math.random(), 0.5);
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const cSinPhi = Math.sin(cPhi);
      core[i * 3] = CORE_CENTRE[0] + cr * cSinPhi * Math.cos(cTheta);
      core[i * 3 + 1] = CORE_CENTRE[1] + cr * cSinPhi * Math.sin(cTheta);
      core[i * 3 + 2] = CORE_CENTRE[2] + cr * Math.cos(cPhi);

      scales[i] = 0.55 + Math.random() * 1.05;
      seeds[i] = Math.random();
      dists[i] = r / RADIUS;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aStream", new THREE.BufferAttribute(stream, 3));
    g.setAttribute("aCollapse", new THREE.BufferAttribute(collapse, 3));
    g.setAttribute("aCore", new THREE.BufferAttribute(core, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aDist", new THREE.BufferAttribute(dists, 1));
    g.setAttribute("aLane", new THREE.BufferAttribute(lanes, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: reducedMotion ? 1 : 0 },
      uState: { value: 0 },
      uBeat: { value: -1 },
      uVeil: { value: 0 },
      uCoreCentre: { value: new THREE.Vector3(...CORE_CENTRE) },
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
      // The field renders one frame and never updates, so it cannot veil
      // itself per section. A constant partial veil keeps every text block
      // legible instead of leaving one section unreadable.
      u.uVeil.value = 0.7;
      return;
    }

    // Clamped so a backgrounded tab does not resume with a huge jump.
    u.uTime.value += Math.min(delta, 0.05);
    u.uReveal.value = fieldState.reveal;
    u.uPulse.value = fieldState.pulse;
    u.uBeat.value = fieldState.beat;
    u.uVeil.value = fieldState.veil;

    // Ease toward the state scroll asked for. Lenis already smooths ordinary
    // scrolling; this only matters for anchor jumps, which would otherwise
    // teleport the whole field in a single frame.
    fieldState.state +=
      (fieldState.targetState - fieldState.state) * (1 - Math.pow(0.0005, delta));
    u.uState.value = fieldState.state;

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
