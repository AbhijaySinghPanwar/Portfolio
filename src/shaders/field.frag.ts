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
uniform float uLight;

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

  // On a dark ground the core reads brighter than the rim. On a light one
  // that inverts: the core has to go darker, and the rim lighter so it fades
  // into the page instead of standing off it.
  vec3 onDark = mix(uIodine * 1.25, uIodine * 0.62, vDist);
  vec3 onLight = mix(uIodine * 0.85, uIodine * 1.25, vDist);
  vec3 col = mix(onDark, onLight, uLight);
  col = mix(col, uEmber, max(uPulse, vBeat));

  float alpha = mask * vAlpha * vDim * mix(0.8, 0.14, vDist);
  alpha *= 1.0 + vBeat * 1.6;
  // Normal blending does not accumulate the way additive does, so the light
  // theme needs more alpha to reach the same density.
  alpha *= mix(1.0, 1.15, uLight);

  gl_FragColor = vec4(col, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
