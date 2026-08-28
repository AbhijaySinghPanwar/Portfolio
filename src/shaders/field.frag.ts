/**
 * Latent field fragment shader.
 *
 * Round soft point, iodine at rest. The core reads brighter and denser than
 * the rim, which is what makes the sphere look like a distribution rather than
 * a shell. Ember marks retrieval: the query pulse, and the lit pipeline lane.
 */
export const fieldFrag = /* glsl */ `
uniform vec3  uIodine;
uniform vec3  uEmber;
uniform float uPulse;

varying float vAlpha;
varying float vDist;
varying float vDim;
varying float vBeat;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  // Soft-edged disc.
  float mask = smoothstep(0.5, 0.05, d);

  // Core is brighter and slightly cooler; rim falls back to pure iodine.
  vec3 col = mix(uIodine * 1.25, uIodine * 0.62, vDist);
  col = mix(col, uEmber, max(uPulse, vBeat));

  float alpha = mask * vAlpha * vDim * mix(0.8, 0.14, vDist);
  alpha *= 1.0 + vBeat * 1.6;

  gl_FragColor = vec4(col, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
