#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec4 s = texture(u_texture_0, coords * 20.0, 0.).rgba;
    color = s;
}
