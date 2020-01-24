/*{
  "pixelRatio": 1,
  "frameskip": 1,
  "vertexCount": 100000,
  "vertexMode": "POINTS",
  "PASSES": [
    {
      fs: "./velocity.frag",
      TARGET: "velocityTexture",
      FLOAT: true,
    },
    {
      fs: "./position.frag",
      TARGET: "positionTexture",
      FLOAT: true,
    },
    {
      vs: "./particle.vert",
      fs: "./particle.frag",
      TARGET: "particleTexture",
      BLEND: "ADD",
    },
    {
      fs: "./density.frag",
      TARGET: "densityTexture",
    },
    {
      BLEND: "ADD",
    }
  ]
}*/
precision mediump float;
uniform vec2 resolution;
uniform sampler2D densityTexture;
uniform sampler2D backbuffer;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  // blur
  vec2 d = vec2(2) / resolution.xy;
  float c = (
      texture2D(densityTexture, uv).x * 4. +
      texture2D(densityTexture, uv + vec2(d.x, 0)).x * 2. +
      texture2D(densityTexture, uv + vec2(0, d.y)).x * 2. +
      texture2D(densityTexture, uv + vec2(-d.x, 0)).x * 2. +
      texture2D(densityTexture, uv + vec2(0, -d.y)).x * 2. +
      texture2D(densityTexture, uv + vec2(d.x, d.y)).x +
      texture2D(densityTexture, uv + vec2(d.x, -d.y)).x +
      texture2D(densityTexture, uv + vec2(-d.x, d.y)).x +
      texture2D(densityTexture, uv + vec2(-d.x, -d.y)).x
  ) / 16.;

  c = smoothstep(0., 1., c);

  gl_FragColor = vec4(.3, .7, 1.2, 1.) * c;
  gl_FragColor += texture2D(backbuffer, (uv - .5) * .99 + .5).b * .3;
  // gl_FragColor.r += texture2D(backbuffer, ((1. - uv) - .5) * .99 + .5).b * .9;
}
