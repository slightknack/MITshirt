#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0; // warped
uniform sampler2D u_texture_1; // image
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    float w = texture(u_texture_0, coords, 0.).x;
    float i = texture(u_texture_1, coords, 0.).x;
    float m = w * 0.28 + i * 0.7;
    color = vec4(m > 0.55);
}
