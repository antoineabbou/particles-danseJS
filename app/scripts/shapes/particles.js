export default class Particles {
            
    constructor(number) {
        this.particles = []
        for(var i = 0; i < number; i++){
            var particle = new THREE.Vector3();
            var geometry = new THREE.SphereGeometry( 0.4, 32, 32 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            var particle = new THREE.Mesh( geometry, material );
            particle.position.x = Math.random() * 1000 - 500;
            particle.position.y = Math.random() * 1000 - 500;
            particle.position.z = Math.random() * 1000 - 500;
            this.particles.push(particle)
        }
    }

    moveParticles() {
        for(var i=0; i<this.particles.length; i++) {
			
		    var particle = this.particles[i]; 
			particle.position.z +=  i/5;
			if(particle.position.z>1000) particle.position.z-=2000; 
			
        }
    }
}