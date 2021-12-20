#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_previous;
uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec4 lerp(vec4 a, vec4 b, float t) {
    return t * a + (1.0 - t) * b;
}

void main() {
    color = lerp(
        texture(u_previous,  coords, 0.),
        texture(u_texture_0, coords, 0.),
        0.999);
}
