export default class Cube {
    
    constructor(number) {
        this.points = []
        for(var i = 0; i < number; i++){
            var position = new THREE.Vector3()
            position.x = Math.random()*2-1
            position.y = Math.random()*2-1
            position.z = Math.random()*2-1
            this.points.push(position)
        }
    }
}