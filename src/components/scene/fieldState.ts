/**
 * Shared mutable state between the DOM and the render loop.
 *
 * GSAP tweens these numbers and useFrame reads them. Deliberately a plain
 * object and not React state: writing to it never triggers a render, which is
 * the whole point. Anything here is per-frame data, not app state.
 */
export const fieldState = {
  /** 0 -> 1 during the load sequence. Drives the outward point reveal. */
  reveal: 0,
  /** 0 -> 1 across the whole page. */
  progress: 0,
  /** Where scroll says the field should be: 0 sphere, 1 stream, 2 collapse, 3 core. */
  targetState: 0,
  /** Where the field actually is. Eased toward targetState in the render loop. */
  state: 0,
  /** Cursor repulsion strength, eased to 0 when the pointer leaves. */
  mouseStrength: 0,
  /** Cursor position on the z = 0 plane, in world units. */
  mouseX: 0,
  mouseY: 0,
  /** 0 -> 1 while a query pulse is passing. Wired in P5. */
  pulse: 0,
  /** Which pipeline lane is lit during the experience beats. -1 for none. */
  beat: -1,
};

export type FieldState = typeof fieldState;

// Dev-only handle so the scroll states can be measured from a test harness.
// Stripped from production builds by dead-code elimination.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { __fieldState: FieldState }).__fieldState = fieldState;
}
