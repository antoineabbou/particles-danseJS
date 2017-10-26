export default class Tear {
    
    constructor(number) {
        this.points = []
        for ( var i = 0; i < number; i ++ )   {
            var position = new THREE.Vector3()
            
            this.alpha =Math.random()*2*Math.PI;
            this.theta = Math.random()*Math.PI;
    
            position.x = 0.7*(Math.cos(this.theta)*Math.sin(this.theta)*Math.cos(this.alpha))*2;
            position.y = -Math.sin(this.theta)*2+1;
            position.z = 0.7*(Math.cos(this.theta)*Math.sin(this.theta)*Math.sin(this.alpha))*2;

            this.points.push(position)
        }
    }
}