precision highp float;
uniform int FRAMEINDEX;
uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 mouseButtons;
uniform float time;

#define PI 3.141593
#define PI2 (PI * 2.)

#define MDIST 0.001

vec2 reset() {
    // vec2 p = gl_FragCoord.st / resolution * 100.;
    // float s =  sin(p.y * PI);
    // float x = cos(p.x * PI2 + p.y) * s;
    // float y = -cos(p.y * PI * 8. + p.x);
    // return fract(vec2(x, y));

    // vec2 pp = vec2(x, y);
    // return mix(pp, normalize(pp) * 0.4 + 0.5, .99);

    // circle
    vec2 p = gl_FragCoord.st / resolution;
    float s =  sin(p.x * 71. + p.y * 23.);
    float x = cos(s * 2. * PI) * .2 + .5;
    float y = sin(s * 2. * PI) * .2 + .5;
    return vec2(x, y);
}

void main(){
    if (FRAMEINDEX == 0) {
        vec2 newPosition = reset();
        gl_FragColor = vec4(newPosition, 0, 1);
    }
    else {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 position = texture2D(positionTexture, uv).xy;
        vec2 velocity = texture2D(velocityTexture, uv).xy;

        vec2 newPosition = position;

        bool move = mouseButtons.x > 0.;
        if (move) {
            newPosition = position + velocity * MDIST;
        }

        newPosition = fract(newPosition);

        gl_FragColor = vec4(newPosition, 0, 1);
    }
}
