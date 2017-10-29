export default class Final {
    
    constructor(number) {
        this.points = []
        this.finalGeometry = new THREE.Geometry();
        
        for ( var i = 0; i < number; i ++ )   {

                var position = new THREE.Vector3();
                this.alpha = Math.random()*(Math.PI)
                this.theta = Math.random()*(Math.PI*2)

                position.x = Math.random()*110-55
                position.y = Math.random()*110-55
                position.z = Math.random()*110-55
        
                this.finalGeometry.vertices.push( position );
                this.points.push(position);
        }
    }
}