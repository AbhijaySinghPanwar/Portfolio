/**
 * Latent field vertex shader.
 *
 * Each point carries one resting position per field state. uState walks
 * continuously from 0 to 3 as the page scrolls and the shader lerps between
 * consecutive targets, so the geometry is built once and never rebuilt.
 *
 *   0  sphere    slow-rotating cloud, dense at the core
 *   1  stream    five lanes flowing left to right, a pipeline
 *   2  collapse  pushed right and dimmed so the project rows read
 *   3  core      converged and breathing
 *
 * GLSL cannot index attributes dynamically, so the blend is written as a
 * chain of mixes. Each weight only opens once the previous state is fully
 * resolved, which makes the chain equivalent to picking the two states either
 * side of uState.
 */
export const fieldVert = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uState;
uniform vec3  uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uSize;
uniform float uPixelRatio;
uniform float uBeat;
uniform vec3  uCoreCentre;

attribute vec3  aStream;
attribute vec3  aCollapse;
attribute vec3  aCore;
attribute float aScale;
attribute float aSeed;
attribute float aDist;
attribute float aLane;

varying float vAlpha;
varying float vDist;
varying float vDim;
varying float vBeat;

const float STREAM_SPAN = 8.0;

// Cheap low-frequency wander. Not real noise, but it never repeats visibly at
// these speeds and it costs three sines instead of a permutation table.
vec3 drift(vec3 p, float t, float seed) {
  return vec3(
    sin(t * 0.25 + seed * 6.2831 + p.y * 1.4),
    cos(t * 0.22 + seed * 4.7123 + p.z * 1.6),
    sin(t * 0.19 + seed * 2.7182 + p.x * 1.2)
  );
}

float weight(float state, float edge) {
  return smoothstep(0.0, 1.0, clamp(state - edge, 0.0, 1.0));
}

void main() {
  float wStream   = weight(uState, 0.0);
  float wCollapse = weight(uState, 1.0);
  float wCore     = weight(uState, 2.0);

  // --- state 0: the sphere, slowly rotating about Y ------------------------
  vec3 sphere = position;
  float a = uTime * 0.055;
  float s = sin(a);
  float c = cos(a);
  sphere.xz = mat2(c, -s, s, c) * sphere.xz;

  // --- state 1: the stream, points flowing along their lane ----------------
  vec3 stream = aStream;
  float flow = aStream.x + uTime * (0.32 + aSeed * 0.22) + STREAM_SPAN * 0.5;
  stream.x = mod(flow, STREAM_SPAN) - STREAM_SPAN * 0.5;

  // --- state 3: the core, breathing ----------------------------------------
  vec3 core = uCoreCentre
            + (aCore - uCoreCentre) * (1.0 + 0.09 * sin(uTime * 0.85));

  // Blend. Order matches state order; each mix only opens after the last.
  vec3 pos = sphere;
  pos = mix(pos, stream, wStream);
  pos = mix(pos, aCollapse, wCollapse);
  pos = mix(pos, core, wCore);

  // Idle drift, stronger toward the rim. Quietened once the field is dimmed.
  pos += drift(position, uTime, aSeed) * 0.05 * (0.35 + aDist) * (1.0 - wCollapse * 0.75);

  // Load reveal: points arrive from the centre outward, staggered by radius.
  float appear = smoothstep(aDist - 0.35, aDist + 0.02, uReveal * 1.4);
  pos *= mix(0.45, 1.0, appear);

  // Cursor repulsion, gaussian falloff inside uMouseRadius. Eased off in the
  // collapsed state so a dim background field does not twitch under the cards.
  vec3 away = pos - uMouse;
  float d = length(away);
  float falloff = exp(-(d * d) / (2.0 * uMouseRadius * uMouseRadius));
  pos += normalize(away + vec3(0.0, 0.0, 0.0001))
       * falloff * uMouseStrength * (1.0 - wCollapse * 0.85);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mvPosition.z, 0.001));

  // Per-state brightness. Collapse drops to roughly 15% so cards read cleanly.
  float dim = 1.0;
  dim = mix(dim, 0.6, wStream);
  dim = mix(dim, 0.15, wCollapse);
  dim = mix(dim, 0.85, wCore);

  // Points wrap from one end of the stream to the other. Fading the ends
  // hides the jump, which would otherwise read as a flicker at the margins.
  float edge = 1.0 - smoothstep(STREAM_SPAN * 0.28, STREAM_SPAN * 0.5, abs(stream.x));
  dim *= mix(1.0, edge, wStream * (1.0 - wCollapse));

  vAlpha = appear;
  vDist = aDist;
  vDim = dim;

  // Which pipeline lane is lit, if any. Only meaningful in the stream state.
  vBeat = (uBeat >= 0.0 && abs(aLane - uBeat) < 0.5)
    ? wStream * (1.0 - wCollapse)
    : 0.0;
}
`;
