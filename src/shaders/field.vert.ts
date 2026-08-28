/**
 * Latent field vertex shader.
 *
 * The point's resting place is its sphere position. Everything else is
 * displacement layered on top: a slow rotation, low-frequency idle drift, the
 * load-time reveal that expands outward from the origin, and cursor repulsion.
 *
 * uProgress is already threaded through for the scroll-driven state changes in
 * P2, so adding the stream / collapse / converge targets does not mean
 * rebuilding the geometry.
 */
export const fieldVert = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uProgress;
uniform vec3  uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uSize;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSeed;
attribute float aDist;

varying float vAlpha;
varying float vDist;
varying float vSeed;

// Cheap low-frequency wander. Not real noise, but it never repeats visibly at
// these speeds and it costs three sines instead of a permutation table.
vec3 drift(vec3 p, float t, float seed) {
  return vec3(
    sin(t * 0.25 + seed * 6.2831 + p.y * 1.4),
    cos(t * 0.22 + seed * 4.7123 + p.z * 1.6),
    sin(t * 0.19 + seed * 2.7182 + p.x * 1.2)
  );
}

void main() {
  vec3 pos = position;

  // Slow rotation about Y.
  float a = uTime * 0.055;
  float s = sin(a);
  float c = cos(a);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Idle drift, stronger toward the rim so the core stays legible.
  pos += drift(position, uTime, aSeed) * 0.05 * (0.35 + aDist);

  // Load reveal: points arrive from the centre outward, staggered by radius.
  float appear = smoothstep(aDist - 0.35, aDist + 0.02, uReveal * 1.4);
  pos *= mix(0.45, 1.0, appear);

  // Cursor repulsion. Falls off as a gaussian inside uMouseRadius.
  vec3 away = pos - uMouse;
  float d = length(away);
  float falloff = exp(-(d * d) / (2.0 * uMouseRadius * uMouseRadius));
  pos += normalize(away + vec3(0.0, 0.0, 0.0001)) * falloff * uMouseStrength;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Perspective-attenuated point size.
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mvPosition.z, 0.001));

  vAlpha = appear;
  vDist = aDist;
  vSeed = aSeed;
}
`;
