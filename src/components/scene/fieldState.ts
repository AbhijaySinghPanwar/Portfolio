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
  /** 0 -> 1 across the whole page. P2 maps this to the five field states. */
  progress: 0,
  /** Cursor repulsion strength, eased to 0 when the pointer leaves. */
  mouseStrength: 0,
  /** Cursor position on the z = 0 plane, in world units. */
  mouseX: 0,
  mouseY: 0,
  /** 0 -> 1 while a query pulse is passing. Wired in P5. */
  pulse: 0,
};

export type FieldState = typeof fieldState;
