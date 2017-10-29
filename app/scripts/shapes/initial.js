export default class Initial {
    
    constructor(number) {
        this.points = []
        this.initialGeometry = new THREE.Geometry();
        
        for ( var i = 0; i < number; i ++ )   {

                var position = new THREE.Vector3();
                
                position.x = Math.random()*100-50
                position.y = Math.random()*100-50
                position.z = Math.random()*100-50
        
                this.initialGeometry.vertices.push( position );
                this.points.push(position);
        }
    }
}