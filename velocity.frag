precision highp float;
uniform int FRAMEINDEX;
uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform sampler2D densityTexture;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 mouseButtons;
uniform float time;

#define PI 3.141593

#define SDIST 0.03
#define SENSOR_ROT 15.
#define TURN_ROT 40.

vec2 rot(vec2 st, float t) {
    float tt = t / 180. * PI;
    float c = cos(tt), s = sin(tt);
    return mat2(c, -s, s, c) * st;
}

void main(){
    if (FRAMEINDEX == 0) {
        gl_FragColor = vec4(0, 1, 0, 1);
        return;
    }

    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 position = texture2D(positionTexture, uv).rg; // (0, 0) to (1, 1)
    vec2 velocity = texture2D(velocityTexture, uv).rg;

    vec2 newVelocity = velocity;

    bool move = mouseButtons.x > 0.;
    if (move) {
        // Get sensor positions
        vec2 scpos = position + velocity * SDIST;
        vec2 slpos = position + rot(velocity, SENSOR_ROT) * SDIST;
        vec2 srpos = position + rot(velocity, -SENSOR_ROT) * SDIST;

        // wrap
        scpos = fract(scpos);
        slpos = fract(slpos);
        srpos = fract(srpos);

        // どのセンサーが一番濃いか判定する
        float sc = texture2D(densityTexture, scpos).r;
        float sl = texture2D(densityTexture, slpos).r;
        float sr = texture2D(densityTexture, srpos).r;

        if (sc > sl && sc > sr) {
            // no turn
        }
        else if (sl > sc && sl > sr) {
            // turn left
            newVelocity = rot(velocity, TURN_ROT);
        }
        else if (sr > sc && sr > sl) {
            // turn right
            newVelocity = rot(velocity, -TURN_ROT);
        }
        else {
            // random
            if (sin(time * 3208. + uv.x * 842. + uv.y * 472.) > .0) {
                newVelocity = rot(velocity, TURN_ROT);
            }
            else {
                newVelocity = rot(velocity, -TURN_ROT);
            }
        }
    }

    gl_FragColor = vec4(newVelocity, 0, 1);
}
