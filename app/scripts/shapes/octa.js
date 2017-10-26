export default class Octa {
    
    constructor(number) {
        this.points = []
        for(var i = 0; i < number; i++){
            var position = new THREE.Vector3()

            this.alpha = Math.random()*(Math.PI*2)-(Math.random()*Math.PI*2)
            this.theta = Math.random()*(Math.PI)-(Math.random()*Math.PI*2)

            position.x = Math.pow(Math.cos(this.alpha)*Math.cos(this.theta), 3)
            position.y = Math.pow(Math.sin(this.alpha)*Math.cos(this.theta), 3)
            position.z = Math.pow(Math.sin(this.theta), 3)

            this.points.push(position)

        }
    }
}