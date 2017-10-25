uniform float u_time;
uniform float u_random_pos;


void main() {
    gl_PointSize = 4.7;
	vec3 newPosition = position * u_random_pos;

  	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
