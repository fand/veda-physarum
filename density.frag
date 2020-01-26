/*{
  "pixelRatio": 1,
  "frameskip": 1,
  "vertexCount": 300000,
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
      TARGET: "densityTexture",
    }
  ]
}*/
precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D particleTexture;
uniform sampler2D backbuffer;
uniform vec2 mouse;

#define CELL_DIVISION 100.
#define ATTENUATION 3.5

float getCell(vec2 uv) {
  // uv = floor(uv * CELL_DIVISION) / CELL_DIVISION;
  return texture2D(particleTexture, uv).r;
}

vec2 rot(vec2 st, float t) {
    float s = sin(t), c = cos(t);
    return mat2(c, -s, s, c) * st;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec2 d = vec2(1) / resolution.xy;

  // float c = (
  //     getCell(uv) * 4. +
  //     getCell(uv + vec2(d.x, 0)) * 2. +
  //     getCell(uv + vec2(0, d.y)) * 2. +
  //     getCell(uv + vec2(-d.x, 0)) * 2. +
  //     getCell(uv + vec2(0, -d.y)) * 2. +
  //     getCell(uv + vec2(d.x, d.y)) +
  //     getCell(uv + vec2(d.x, -d.y)) +
  //     getCell(uv + vec2(-d.x, d.y)) +
  //     getCell(uv + vec2(-d.x, -d.y))
  // ) / 16.;

  float c = (
      getCell(uv) +
      getCell(uv + vec2(d.x, 0)) +
      getCell(uv + vec2(0, d.y)) +
      getCell(uv + vec2(-d.x, 0)) +
      getCell(uv + vec2(0, -d.y)) +
      getCell(uv + vec2(d.x, d.y)) +
      getCell(uv + vec2(d.x, -d.y)) +
      getCell(uv + vec2(-d.x, d.y)) +
      getCell(uv + vec2(-d.x, -d.y))
  ) / 9.;

  c *= ATTENUATION;

  vec2 p = uv * 2. - 1.;
  p.x *= resolution.x / resolution.y;
  vec2 mp = mouse *2. - 1.;
  mp.x *= resolution.x / resolution.y;
  c *= 1. - smoothstep(.1 / length(p - mp), .6, .1);

  gl_FragColor = vec4(c, c, c, 1);
}
