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
        console.log(TweenMax)

        this.audio = new Sound( flume, 102, .3, null, false )
        
        this.kick = this.audio.createKick({
          decay: 1,
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

       this.beat = this.audio.createBeat(4, () => {console.log('Beat!')})
        this.beat.on()
        this.audio._load(flume, () => {
          this.audio.play()
        });


        this.time = 0;
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100000 );

        this.camera.position.z = 250;
        this.camera.position.y = 150;

        this.controls = new OrbitControls(this.camera)

    	this.scene = new THREE.Scene();
        var axisHelper = new THREE.AxisHelper( 50 );
        
        
        
        var starsGeometry = new THREE.Geometry();
       for ( var i = 0; i < 100000; i ++ )   {

            var star = new THREE.Vector3();
            this.alpha = Math.random()*(Math.PI)
            this.theta = Math.random()*(Math.PI*2)

            star.x = Math.cos(this.alpha)*Math.sin(this.theta)
            star.y = Math.sin(this.alpha)*Math.sin(this.theta)
            star.z = Math.cos(this.theta)
    
            starsGeometry.vertices.push( star );
        }       


        console.log(starsGeometry.vertices[0].x)

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

        this.starField = new THREE.Points( starsGeometry, this.starsMaterial );
        this.scene.add( this.starField );
        this.scene.add( axisHelper );

         

        var particlesGeometry = new THREE.Geometry();
        for ( var i = 0; i < 10000; i ++ )   {
 
             var particle = new THREE.Vector3();

             particle.x = Math.random()*100-50
             particle.y = Math.random()*100-50
             particle.z = Math.random()*100-50       
 
             particlesGeometry.vertices.push( particle );
 
         }

         this.particlesMaterial = new THREE.ShaderMaterial( { 
            uniforms : uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader
         } );
        this.particlesField = new THREE.Points( particlesGeometry, this.particlesMaterial );
        this.scene.add( this.particlesField );


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
        if(this.audio.getSpectrum()[0] > 2) {
            this.camera.z += 0.1
        }
        this.camera.position.x = this.starField.position.x + 200 * Math.cos( this.time );         
        this.camera.position.y = this.starField.position.z + 200 * Math.sin( this.time );
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
