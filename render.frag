#version 140

out vec4 out_color;

// METADATA ----------

uniform vec2 u_resolution;
uniform float u_time;

// CONSTANTS ----------

#define START 0.0
#define END 1000.0
#define STEPS 100
#define EPSILON 0.001
#define FOV 1.1
#define PIXEL (1.0 / u_resolution)

// CAMERA ----------

vec3 makeRay(float fov, float ratio, vec2 st) {
    vec2 xy = st - vec2(ratio, 1.0) * 0.5;
    float z = 1.0 / tan(radians(fov) / 2.0);
    return normalize(vec3(xy, -z));
}

mat3 look(vec3 camera, vec3 target, vec3 up) {
    // Based on gluLookAt man page
    vec3 f = normalize(target - camera);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// SIGNED DISTANCE FUNCTIONS ----------

float box(vec3 point, vec3 size) {
    vec3 d = abs(point) - (size / 2.0);
    float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);
    float outsideDistance = length(max(d, 0.0));
    return insideDistance + outsideDistance;
}

float sphere(vec3 point, float radius) {
    return length(point) - radius;
}

// MIT logo
float mit_logo(vec3 point) {
    // point.y += point.z * 0.6 * sin(u_time);
    // point.x += point.y * point.z * 0.07;
    // point *= 0.9;

    float box5 = box((point + vec3(0., 2.0, -1.5)), vec3(1.0, 5, 1.0));
    float box6 = box((point + vec3(0., 1.25, -3.0)), vec3(1.0, 3.5, 1.0));
    float box7 = box((point + vec3(0., 2.0, -4.5)), vec3(1.0, 5, 1.0));
    float m = min(min(box5, box6), box7);

    float box1 = box((point + vec3(0., 0., 0.)), vec3(1.0, 1.0, 1.0));
    float box2 = box((point + vec3(0., 2.75, 0.)), vec3(1.0, 3.5, 1.0));
    float i = min(box1, box2);

    float box3 = box((point + vec3(0., 0., 2.25)), vec3(1.0, 1., 2.5));
    float box4 = box((point + vec3(0., 2.75, 1.5)), vec3(1.0, 3.5, 1.0));
    float t = min(box3, box4);

    float logo = min(min(m, i), t);

    return logo;
}

float big_sphere(vec3 point) {
    vec3 new = point;
    new.x += 10.0;
    new.y += 1.5;
    return sphere(new, 10.0);
}

// the entire scene
float scene(vec3 point) {
    float sphere = big_sphere(point);

    return min(mit_logo(point), sphere);
}

// the colors and stuff
vec4 emission(vec3 point) {
    if (length(point) > 10.0) {
        float height = sin(point.y / 20.0 + 5.0)*.5 +.5;
        return vec4(0.8, 0.85, 1.0, 1.0) * height * 1.3;
    }

    if (big_sphere(point) < EPSILON * 2.0) {
        return vec4(vec3(1.0, 1., 1.), 1.0);
    }

    return vec4(vec3(2.0, 0.4, 0.), 0.0);
}

// RAY MARCHER ----------

// depth, minimum distance, number of steps
vec3 march(vec3 camera, vec3 ray) {
    float depth = START;
    float minDistance = END;
    float steps = 0.0;

    for (steps = 0.0; steps < float(STEPS); steps++) {
        float dist = scene(camera + depth * ray);
        minDistance = min(minDistance, dist);
        depth += dist;

        if (dist < EPSILON) {
            return vec3(depth, minDistance, steps - 1.0 + (dist / EPSILON));
        }

        if (depth > END) {
            return vec3(END, minDistance, steps);
        }
    }

    return vec3(depth, minDistance, STEPS);
}

// SHADING AND COLORS ----------

vec3 normal(vec3 p) {
    return normalize(vec3(
        scene(vec3(p.x + EPSILON, p.y, p.z)) - scene(vec3(p.x - EPSILON, p.y, p.z)),
        scene(vec3(p.x, p.y + EPSILON, p.z)) - scene(vec3(p.x, p.y - EPSILON, p.z)),
        scene(vec3(p.x, p.y, p.z + EPSILON)) - scene(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 sample_sphere(in vec2 seed) {
    vec3 point = vec3(0.0);

    // sample point in unit cube, check if in unit sphere
    for (int i = 0; i < 3; i++) {
        point = vec3(
            random(seed),
            random(seed * 2.0),
            random(seed * 3.0)) * 2. - 1.;
        if (length(point) <= 1.0) {
            break;
        }
    }

    return point;
}

vec3 sample_sphere_surface(in vec2 seed) {
    return normalize(sample_sphere(seed));
}

vec3 diffuse_dir(in vec3 normal, in vec2 seed) {
    return normalize(normal + sample_sphere_surface(seed));
}

vec3 reflect_dir(in vec3 dir, in vec3 normal, in float roughness, in vec2 seed) {
    return reflect(dir, normal + sample_sphere(seed) * roughness);
}

// MAIN LOOP ----------

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 jitter = vec2(
        random(st + u_time),
        random(st + u_time * 2.0));
    st += jitter * PIXEL;

    vec3 ray = makeRay(FOV, u_resolution.x/u_resolution.y, st);
    vec3 point = vec3(50., -20.5, 50.0) * 10.0;
    // point = point + sin(u_time) * 200.0;
    mat3 view = look(point, vec3(0., -1.8, 1), normalize(vec3(0.1, 0.5, 0.0)));
    vec3 dir = view * ray;
    vec3 color = vec3(0.0);

    // five bounces
    for (int i = 0; i < 5; i++) {
        vec3 marchResults = march(point, dir);
        float depth = marchResults.x;
        float minDistance = marchResults.y;
        float steps = marchResults.z;

        point = point + (depth - EPSILON * 2.0) * dir;
        vec4 e = emission(point);
        vec3 normals = normal(point);
        if (random(st + u_time * 3.0) < e.a) {
            dir = reflect_dir(dir, normals, 0.01, st + u_time * 4.0);
        } else {
            dir = diffuse_dir(normals, st + u_time * 5.0);
        }
        float occ = 1.0 - ((steps + (random(st) * 2.0 - 1.0)) / float(STEPS));
        color += e.rgb;
        color *= occ;
    }

    color /= 5.0;
    color -= 0.5;
    color *= 5.0;
    color += 0.1;

    // float keyLight = float(smoothstep((normals.x + normals.y) / 2.0 + 0.5, 0.4, 0.6) * 0.5 + 0.5);
    // color = vec3(pow(occ, 2.0) * keyLight);

    out_color = vec4(color, 1.0);

    // gl_FragColor = vec4(color * 1.0 - (steps / float(STEPS)), 1.0);
}
