#version 140

in vec2 coords;
out vec4 color;

uniform vec2 u_resolution;
uniform float u_time;

#define CELLS 40.0

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    float scale = u_resolution.y / u_resolution.x;
    float grid =
        sin(coords.x * 3.14 * CELLS);
      // * sin(coords.y * 3.14 * CELLS * scale);
    color = vec4(grid * 0.5 + 0.5);
}
