// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' // eslint-disable-line import/no-webpack-loader-syntax
import vertShader from './shader.vert'
import fragShader from './shader.frag'
import Sound from './Sound'
import flume from './flume.mp3'
import {TweenMax, Power2, TimelineLite} from 'gsap';

export default class App {

    constructor() {

        this.audio = new Sound( flume, 102, .3, null, false )

        this.resolutionX = window.innerWidth
        this.resolutionY = window.innerHeight
        this.resolutionZ = 10000

        this.ratio = 0.5

        this.cubeArr = []
        this.starArr = []
        this.currArr = []
        this.torusArr = []
        
        this.kick = this.audio.createKick({
          decay: 5,
          threshold: 0.5,
          onKick: () => {},
          offKick: () => {}
        })
        this.kick.on()
        
        this.animEnter = {
            now: Date.now(),
            last : Date.now(),
            duration: 12000,
            timepast: 0
        }

        this.changingState = false;
        this.changingState2 = false;
        this.changingState3 = false;
        setTimeout(() =>{
            this.changingState = true;
        }, 11000)
        setTimeout(()=>{
            this.changingState = false;
            this.changingState2 = true
        }, 13500)
        setTimeout(()=>{
            this.changingState2 = false;
            this.changingState3 = true
        }, 17500)

       this.beat = this.audio.createBeat(4, () => {console.log('Beat!')})
        this.beat.on()
        this.audio._load(flume, () => {
          this.audio.play()
        });


        this.time = 0;
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, this.resolutionZ );

        this.camera.position.z = 250;
        this.camera.position.y = 150;

        this.controls = new OrbitControls(this.camera)

    	this.scene = new THREE.Scene();
        //var axisHelper = new THREE.AxisHelper( 50 );
        
        
        
        this.starsGeometry = new THREE.Geometry();
        
        for ( var i = 0; i < 100000; i ++ )   {

                var star = new THREE.Vector3();
                this.alpha = Math.random()*(Math.PI)
                this.theta = Math.random()*(Math.PI*2)

                star.x = Math.cos(this.alpha)*Math.sin(this.theta)
                star.y = Math.sin(this.alpha)*Math.sin(this.theta)
                star.z = Math.cos(this.theta)
        
                this.starsGeometry.vertices.push( star );
                this.currArr.push(star);
        }

        for ( var i = 0; i < 100000; i ++ )   {
            
                var star = new THREE.Vector3();
                this.alpha = Math.random()*(Math.PI)
                this.theta = Math.random()*(Math.PI*2)

                star.x = Math.cos(this.alpha)*Math.sin(this.theta)
                star.y = Math.sin(this.alpha)*Math.sin(this.theta)
                star.z = Math.cos(this.theta)
        
                this.starArr.push(star)
        }
        
        for(var i = 0; i < 100000; i++){
            var cubePosition = new THREE.Vector3()
            cubePosition.x = Math.random()*2-1
            cubePosition.y = Math.random()*2-1
            cubePosition.z = Math.random()*2-1

            this.cubeArr.push(cubePosition)
        }

        for(var i = 0; i < 100000; i++){
            var torusPosition = new THREE.Vector3()
            this.alpha = Math.random()*(Math.PI*2)
            this.theta = Math.random()*(Math.PI*2)
            torusPosition.x = (1+(1+Math.cos(this.theta)))*Math.cos(this.alpha)
            torusPosition.y = (1+(1+Math.cos(this.theta)))*Math.sin(this.alpha)
            torusPosition.z = Math.sin(this.theta)

            this.torusArr.push(torusPosition)
        }


        console.log(this.cubeArr[0].x)
            

        var uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_frequency: {type: "f", value: this.audio.getAverage()}, 
            u_resolution: {type: "f", value: window.innerWidth},
            u_enter_anim: {type: "f", value: 0}
        }

        this.starsMaterial = new THREE.ShaderMaterial( { 
            uniforms : uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader
         } );

        this.starField = new THREE.Points(this.starsGeometry , this.starsMaterial );
        this.scene.add( this.starField );
        //this.scene.add( axisHelper );

        
        this.spheres = []
        for ( var i = 0; i < 100; i ++ )   {
 
             var particle = new THREE.Vector3();

             var geometry = new THREE.SphereGeometry( 0.4, 32, 32 );
             var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
             var sphere = new THREE.Mesh( geometry, material );
             sphere.position.x = Math.random() * 1000 - 500;
             sphere.position.y = Math.random() * 1000 - 500;
             sphere.position.z = Math.random() * 1000 - 500;
             this.scene.add( sphere );
             this.spheres.push(sphere)
 
         }


    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }
    

    render() {
        this.time += 0.01;
        var now = Date.now();
        this.animEnter.timepast += now - this.animEnter.last;
        this.animEnter.last = now;

        var advance = Math.min(1.1, this.animEnter.timepast/this.animEnter.duration);

        this.starsMaterial.uniforms.u_time.value = this.time;
        this.starsMaterial.uniforms.u_time.value = this.time;        
        this.starsMaterial.uniforms.u_enter_anim.value = advance;        
        this.starsMaterial.uniforms.u_frequency.value = this.audio.getSpectrum()[0]/7;


        for(var i=0; i<this.spheres.length; i++) {
			
			var sphere = this.spheres[i]; 
				
			// and move it forward dependent on the mouseY position. 
			sphere.position.z +=  i/5;
				
			// if the particle is too close move it to the back
			if(sphere.position.z>1000) sphere.position.z-=2000; 
			
        }
        
    //console.log(this.audio.arrAverage(this.audio.getSpectrum()))
    


    this.starsGeometry.verticesNeedUpdate = true

        if(this.changingState){
            console.log('cube')
            for(var i=0; i< 100000; i++){
                
                this.currArr[i].x += (this.cubeArr[i].x - this.currArr[i].x) * 0.05
                this.currArr[i].y += (this.cubeArr[i].y - this.currArr[i].y) * 0.05
                this.currArr[i].z += (this.cubeArr[i].z - this.currArr[i].z) * 0.05
            }
            
        }

        if(this.changingState2){
            console.log('sphere')
            for(var i=0; i< 100000; i++){

                this.currArr[i].x += (this.starArr[i].x - this.currArr[i].x) * 0.05
                this.currArr[i].y += (this.starArr[i].y - this.currArr[i].y) * 0.05
                this.currArr[i].z += (this.starArr[i].z - this.currArr[i].z) * 0.05
            }
        }

        if(this.changingState3){
            console.log('torus')
            for(var i=0; i< 100000; i++){
                this.currArr[i].x += (this.torusArr[i].x - this.currArr[i].x) * 0.05
                this.currArr[i].y += (this.torusArr[i].y - this.currArr[i].y) * 0.05
                this.currArr[i].z += (this.torusArr[i].z - this.currArr[i].z) * 0.05
            }
        }


        if(this.audio.getSpectrum()[0] > 2) {
            this.camera.z += 0.1
        }
        this.camera.position.x = this.starField.position.x + 200 * Math.cos( this.time*2 );         
        this.camera.position.y = this.starField.position.z + 200 * Math.sin( this.time*2 );
        this.camera.position.z = this.starField.position.z + 200 * Math.sin( this.time );
        this.camera.lookAt( this.starField.position );

        this.renderer.render( this.scene, this.camera );
        
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
