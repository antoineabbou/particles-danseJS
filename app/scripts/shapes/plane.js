export default class Plane {
    
    constructor(number) {
        this.points = []
        for ( var i = 0; i < number; i ++ )   {
            var position = new THREE.Vector3()
            this.alpha = Math.random()*(Math.PI*2)
            this.theta = Math.random()*(Math.PI*2)
            
            position.x = Math.cos(this.alpha)
            position.y = Math.sin(this.theta)
            position.z = -(Math.sin(this.theta))
            this.points.push(position)
        }
    }
}