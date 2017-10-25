uniform float u_time;

vec3 colorA = vec3(0.4,0.2,0.85);
vec3 colorB = vec3(0.14,1.00,0.10);
  
void main() {

  vec3 color = vec3(0.0);

  float pct = abs(sin(u_time));

  color = mix(colorA, colorB, pct); 

  gl_FragColor = vec4(color,0.1);
  
}