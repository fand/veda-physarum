/*{
  "pixelRatio": 1,
  "frameskip": 1,
  "vertexCount": 100000,
  "vertexMode": "POINTS",
  glslify: true,
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
      "vs": "./particle.vert",
      TARGET: "particleTexture",
      FLOAT: true,
    },
    {
      TARGET: "densityTexture",
      FLOAT: true,
    },
  ]
}*/

precision mediump float;

#define POINTPOWER 0.5

void main() {
  gl_FragColor = vec4(POINTPOWER);
}
