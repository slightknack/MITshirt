#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    float scale = u_resolution.y / u_resolution.x;

    vec4 s = texture(u_texture_0, coords, 0.).rgba;
    color = s;

    float gridx = floor(coords.x * 50.0);
    float gridy = floor(coords.y * scale * 50.0);

    if (gridx == -0 || gridx == 49) {
        color = vec4(0.0);
    } else if (gridy == 0 || gridy == 39) {
        color = vec4(0.0);
    }

    if (gridx >= 41 && gridx <= 47 && gridy >= 2 && gridy <= 8) {
        color = vec4(0.0);
    }

    if (gridx >= 2 && gridx <= 8 && gridy >= 31 && gridy <= 37) {
        color = vec4(0.0);
    }
}
