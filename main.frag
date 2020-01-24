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


vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hueRot(vec3 rgb, float c) {
  vec3 hsv = rgb2hsv(rgb);
  hsv.x = fract(hsv.x + c);
  return hsv2rgb(hsv);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;


  float c = texture2D(densityTexture, uv).x;

  // blur
  // vec2 d = vec2(2) / resolution.xy;
  // c = (
  //     texture2D(densityTexture, uv).x * 4. +
  //     texture2D(densityTexture, uv + vec2(d.x, 0)).x * 2. +
  //     texture2D(densityTexture, uv + vec2(0, d.y)).x * 2. +
  //     texture2D(densityTexture, uv + vec2(-d.x, 0)).x * 2. +
  //     texture2D(densityTexture, uv + vec2(0, -d.y)).x * 2. +
  //     texture2D(densityTexture, uv + vec2(d.x, d.y)).x +
  //     texture2D(densityTexture, uv + vec2(d.x, -d.y)).x +
  //     texture2D(densityTexture, uv + vec2(-d.x, d.y)).x +
  //     texture2D(densityTexture, uv + vec2(-d.x, -d.y)).x
  // ) / 16.;

  // c = smoothstep(0., 1., c);

  gl_FragColor = vec4(.2, .8, .5, 1.) * c;
  // gl_FragColor += texture2D(backbuffer, (uv - .5) * .99 + .5) * .9;

  // add backbuffer;
  vec4 bb = texture2D(backbuffer, uv + vec2(0, 0.002));
  // bb = texture2D(backbuffer, (uv - .5) * .9999 + .5);

  bb.rgb = hueRot(bb.rgb, .04).rgb;
  gl_FragColor += bb * .9;

}
