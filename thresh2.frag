#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0; // warped
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    float w = texture(u_texture_0, coords, 0.).x;
    if (w > 0.51) {
        color = vec4(vec3(0.64, 0.12, 0.2), 1.0);
    } else if (w > 0.08) {
        color = vec4(vec3(1.0, 0.95, 0.8), 1.0);
    } else {
        color = vec4(0.0);
    }
}
