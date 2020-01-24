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
uniform sampler2D particleTexture;
uniform sampler2D backbuffer;

#define CELL_DIVISION 1000.

float getCell(vec2 uv) {
  uv = floor(uv * CELL_DIVISION) / CELL_DIVISION;
  return texture2D(particleTexture, uv).r;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec2 d = vec2(1) / resolution.xy;

  float c = (
      getCell(uv) * 4. +
      getCell(uv + vec2(d.x, 0)) * 2. +
      getCell(uv + vec2(0, d.y)) * 2. +
      getCell(uv + vec2(-d.x, 0)) * 2. +
      getCell(uv + vec2(0, -d.y)) * 2. +
      getCell(uv + vec2(d.x, d.y)) +
      getCell(uv + vec2(d.x, -d.y)) +
      getCell(uv + vec2(-d.x, d.y)) +
      getCell(uv + vec2(-d.x, -d.y))
  ) / 16.;

  gl_FragColor = vec4(c, c, c, 1);
}
