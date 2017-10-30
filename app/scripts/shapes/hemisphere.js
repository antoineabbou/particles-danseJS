export default class Hemisphere {
    
    constructor(number) {
        this.points = []
        for ( var i = 0; i < number; i ++ )   {
            var position = new THREE.Vector3();
            this.alpha = Math.random()*(Math.PI*2)
            this.theta = Math.random()*(Math.PI/2)

            position.x = Math.cos(this.alpha)*Math.sin(this.theta)
            position.y = Math.sin(this.alpha)*Math.sin(this.theta)
            position.z = Math.cos(this.theta)
    
            this.points.push(position)
        }
    }
}