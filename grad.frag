#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    float s = texture(u_texture_0, coords, 0.).r;
    color = vec4(vec3(s < coords.y), 1.0);
}
