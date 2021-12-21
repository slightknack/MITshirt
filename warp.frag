#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0; // noise
uniform sampler2D u_texture_1; // grid
uniform vec2 u_resolution;
uniform float u_time;

#define SCALE 1.0

// warps the griddo!
void main() {
    vec2 s = texture(u_texture_0, coords, 0.).xy;
    vec4 warped = texture(u_texture_1, coords + s * SCALE, 0.).rgba;
    color = warped;
}
