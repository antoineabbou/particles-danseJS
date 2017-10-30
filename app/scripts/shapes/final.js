export default class Final {
    
    constructor(number) {
        this.points = []
        this.finalGeometry = new THREE.Geometry();
        
        for ( var i = 0; i < number; i ++ )   {

                var position = new THREE.Vector3();
                
                position.x = Math.random()*100-50
                position.y = Math.random()*100-50
                position.z = Math.random()*100-50
        
                this.finalGeometry.vertices.push( position );
                this.points.push(position);
        }
    }
}