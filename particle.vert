/*{
    vertexCount: 1000,
    vertexMode: 'POINTS',
}*/
precision mediump float;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;
attribute float vertexId;
uniform float vertexCount;
uniform float time;
uniform vec3 mouseButtons;

#define POINTSIZE 4.0


void main(){
    vec2 uv = vec2(
        mod(vertexId, resolution.x) / resolution.x,
        floor(vertexId / resolution.x) / resolution.y
    );

    vec2 position = texture2D(positionTexture, uv).xy;
    vec2 velocity = texture2D(velocityTexture, uv).xy;

    gl_Position = vec4(position * 2. - 1., 0, 1);
    gl_PointSize = POINTSIZE;
}
