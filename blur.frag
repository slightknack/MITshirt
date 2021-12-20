#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

#define STEP 0.0005
#define BLUR 10
<VERT>

void main() {
    float total = 0.0;
    for (int i = 0; i < BLUR; i++) {
        vec2 new = coords;
        float pix = i * STEP - (BLUR / 2 * STEP);
        #ifdef VERT
            new.x += pix;
        #else
            new.y += pix;
        #endif
        total += texture(u_texture_0, new, 0.).r;
    }
    color = vec4(vec3(total / BLUR), 1.);
}
