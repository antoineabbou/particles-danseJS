export default class Camera {
    constructor (fov, aspect, near, far, positionY, positionZ, speed) {
        this.pov = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.pov.position.z = positionY;
        this.pov.position.y = positionZ;
        this.speed = speed
    }

    rotate(target, distance, time) {
        this.pov.position.x = target.x + distance * Math.cos( time*this.speed );         
        this.pov.position.y = target.y + distance * Math.sin( time*this.speed);
        this.pov.position.z = target.z + distance * Math.sin( time*this.speed);
        this.pov.lookAt( target );
    }
}