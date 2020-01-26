/*{
  "pixelRatio": 1,
  "frameskip": 1,
  "vertexCount": 1000000,
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
uniform vec2 mouse;

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

vec2 rot(vec2 st, float t) {
    float s = sin(t), c = cos(t);
    return mat2(c, -s, s, c) * st;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uv0 = uv;

  float l = length(uv - .5);
  // uv = rot(uv - .5, sin(l *8.) * 3.14) + .5;

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

  // c = smoothstep(0., .2, c);
  // c *= .7;

  gl_FragColor = vec4(.2, .3, .8, 1.) * c;
  gl_FragColor.rgb = hueRot(gl_FragColor.rgb, c);
  // gl_FragColor += texture2D(backbuffer, (uv - .5) * .99 + .5) * .9;


  // draw mouse
  vec2 p = uv * 2. - 1.;
  p.x *= resolution.x / resolution.y;
  vec2 mp = mouse *2. - 1.;
  mp.x *= resolution.x / resolution.y;
  gl_FragColor += (.01 / length(p - mp)) * vec4(.1, .7, 1, 1);

  // add backbuffer;
  // vec4 bb = texture2D(backbuffer, uv0 + vec2(0, 0.000));
  // bb = texture2D(backbuffer, (uv0 - .5) * .999 + .5);

  vec2 d = vec2(1) / resolution.xy;
  vec4 bb = (
    texture2D(backbuffer, uv0) * -4.0 +
    texture2D(backbuffer, uv0 + vec2(d.x, 0)) * 2. +
    texture2D(backbuffer, uv0 + vec2(-d.x, 0)) * 2. +
    texture2D(backbuffer, uv0 + vec2(0, d.y)) * 2. +
    texture2D(backbuffer, uv0 + vec2(0, -d.y)) * 2. +
    texture2D(backbuffer, uv0 + vec2(d.x, d.y)) +
    texture2D(backbuffer, uv0 + vec2(d.x, -d.y)) +
    texture2D(backbuffer, uv0 + vec2(-d.x, d.y)) +
    texture2D(backbuffer, uv0 + vec2(-d.x, -d.y))
  ) / 9.;

  bb.rgb = hueRot(bb.rgb, .03).rgb;
  gl_FragColor += bb * .99;

  gl_FragColor.a = 1.;
}
