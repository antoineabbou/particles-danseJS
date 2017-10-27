// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats


//import Utils
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' 
import EffectComposer from 'imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer' 
import RenderPass from 'imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass'
import MaskPass from 'imports-loader?THREE=three!exports-loader?THREE.MaskPass!three/examples/js/postprocessing/MaskPass'
import ShaderPass from 'imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass'
import GlitchPass from 'imports-loader?THREE=three!exports-loader?THREE.GlitchPass!three/examples/js/postprocessing/GlitchPass'
import UnrealBloomPass from 'imports-loader?THREE=three!exports-loader?THREE.UnrealBloomPass!three/examples/js/postprocessing/UnrealBloomPass' // eslint-disable-line


import FXAAShader from 'imports-loader?THREE=three!exports-loader?THREE.FXAAShader!three/examples/js/shaders/FXAAShader' // eslint-disable-line
import CopyShader from 'imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader'
import DigitalGlitch from 'imports-loader?THREE=three!exports-loader?THREE.DigitalGlitch!three/examples/js/shaders/DigitalGlitch'
import ConvolutionShader from 'imports-loader?THREE=three!exports-loader?THREE.ConvolutionShader!three/examples/js/shaders/ConvolutionShader' // eslint-disable-line
import LuminosityHighPassShader from 'imports-loader?THREE=three!exports-loader?THREE.LuminosityHighPassShader!three/examples/js/shaders/LuminosityHighPassShader' // eslint-disable-line

import Sound from './utils/Sound'
import Audio from '../assets/audio/gramatik.mp3' 
import Colors from './utils/Colors'

//import Shaders 
import vertParticles from './glsl/shaders/particles/particles.vert'
import fragParticles from './glsl/shaders/particles/particles.frag'

// import Shapes
import Initial from './shapes/initial'
import Cube from './shapes/cube'
import Octa from './shapes/octa'
import Sphere from './shapes/sphere'
import Tear from './shapes/tear'
import Torus from './shapes/torus'
import Particles from './shapes/particles'

// import tween
import {TweenMax, Power2, TimelineLite} from 'gsap'
export default class App {

    constructor() {
        //Canvas
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        //Camera
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, this.resolutionZ );
        this.camera.position.z = 250;
        this.camera.position.y = 150;
        this.speedCamera = 1
        
        //Controls
        this.controls = new OrbitControls(this.camera)
        

        //Scene
        this.scene = new THREE.Scene();
        this.time = 0
        this.resolutionX = window.innerWidth
        this.resolutionY = window.innerHeight
        this.resolutionZ = 10000
        

        //Axis Helper
        var axisHelper = new THREE.AxisHelper( 50 )
        //this.scene.add(axisHelper)

        //Colors
        this.colors = new Colors

        //Audio
        this.audio = new Sound( Audio, 103, .3, null, false )
        this.audio._load(Audio, () => {
            this.audio.play()
        });

        //console.log(this.audio.between()) 
        this.bass = this.audio.createKick({
            frequency: 3,
            decay:1,
            threshold: 255,
            onKick: () => {
               if(this.kickTempo > 10){
                    this.kickTempo = 0
                    document.querySelector('body').style.background = this.colors.getNewColor()
                    this.glitchPass.renderToScreen = true;
                }
            }
        }) 


        this.audio.between('firstDrop', 37, 46, () => {
            //document.querySelector('body').style.background = '#D66D75'
            this.bass.on()
        })
        this.audio.between('chillOut', 46, 121, ()=> {
            this.bass.off()
            document.querySelector('body').style.background = '#1a1a1a'
            this.glitchPass.renderToScreen = false;

        })
        
        this.audio.between('secondDrop', 121, 129.5, () => {
            this.bass.on();
        })
        this.audio.after('secondDrop', 129.5, ()=> {
            this.bass.off()
            document.querySelector('body').style.background = '#1a1a1a'
            this.glitchPass.renderToScreen = false;
        })
        

        //Beat check
        this.beat = this.audio.createBeat(4, () => {
            //console.log('Beat!')
        })
        this.beat.on()

        //Kick check
        this.kick = this.audio.createKick({
            frequency: 200,
            decay:1,
            threshold: 5,
            onKick: () => {
               if(this.kickTempo > 50){
                    this.kickTempo = 0
                    this.getNewPattern()
                    this.changingState = true
                    this.speedCamera = 2
                    setTimeout(()=>{
                        this.speedCamera = -2
                    }, 3000)
                }
            }
        }) 
        this.kick.on()
        this.kickTempo = 0;

        //End of the sound 
        this.audio.onceAt('end', 228.3, () => {
            this.audio.pause()
        })

        //particles / points stuff
        this.nbParticles = 80000
        this.nbPoints = 100
        this.ratio = 0.05

        
        //instance of the first shape 
        this.initial = new Initial(this.nbParticles)

        //instances of shapes
        this.cube = new Cube(this.nbParticles);
        this.octa = new Octa(this.nbParticles)
        this.sphere = new Sphere(this.nbParticles)
        this.tear = new Tear(this.nbParticles)
        this.torus = new Torus(this.nbParticles)
        this.particles = new Particles(this.nbPoints)

        //States Manager
        
        this.states = []
        this.cubeState = {
            type : 'cube', 
            isActive : false, 
            data: this.cube
        }
        this.octaState = {
            type : 'octa', 
            isActive : false, 
            data: this.octa
        }
        this.sphereState = {
            type : 'sphere', 
            isActive : false, 
            data: this.sphere
        }
        this.tearState = {
            type : 'tear', 
            isActive : false, 
            data: this.tear
        }
        this.torusState = {
            type : 'torus', 
            isActive : false, 
            data: this.torus
        }
        this.states.push(this.cubeState, this.octaState, this.sphereState, this.tearState, this.torusState)
    

        //Instances of white particles
        for(var i = 0; i < this.nbPoints; i++){
            this.scene.add(this.particles.particles[i]);
        }

        var uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_frequency: {type: "f", value: this.audio.arrAverage(this.audio.getSpectrum())}, 
            u_resolution: {type: "f", value: window.innerWidth},
            u_enter_anim: {type: "f", value: 0}
        }

        this.particlesMaterial = new THREE.ShaderMaterial( { 
            uniforms : uniforms,
            vertexShader: vertParticles,
            fragmentShader: fragParticles
         } );

        this.particlesField = new THREE.Points(this.initial.initialGeometry , this.particlesMaterial );

        this.scene.add( this.particlesField );
        this.scene.fog = new THREE.Fog( 0x000000, 0.1, this.resolutionZ );

    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        

        this.initPostProcessing()

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    initPostProcessing() {
        this.composer = new EffectComposer( this.renderer );
        this.composer.setSize( window.innerWidth, window.innerHeight );        
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.copyShader = new ShaderPass(THREE.CopyShader);
     

        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.glitchPass = new GlitchPass();
        this.composer.addPass( this.glitchPass );


        


        // this.composer.addPass(this.renderScene);
        // this.composer.addPass(this.effectFXAA);
        // this.composer.addPass(this.bloomPass);
        // this.composer.addPass(this.copyShader); 

        //console.log(this.composer)
        //console.log(this.glitchPass)


        //Create Shader Passes
        
        
        //Add Shader Passes to Composer - order is important
        
        //set last pass in composer chain to renderToScreen
        this.copyShader.renderToScreen = true;

    }
    
    displacement() {
            for(var i=0; i< this.nbParticles; i++){
                
                this.initial.points[i].x += (this.currentPattern.data.points[i].x - this.initial.points[i].x) * this.ratio
                this.initial.points[i].y += (this.currentPattern.data.points[i].y - this.initial.points[i].y) * this.ratio
                this.initial.points[i].z += (this.currentPattern.data.points[i].z - this.initial.points[i].z) * this.ratio
            }
            
    }

    getNewPattern() {
        let nextPatterns = this.states.filter((state) => {
            return state.isActive != true;
          });
      
        let currentPattern = nextPatterns[Math.floor(Math.random() * nextPatterns.length)];
      
        // Remove isActive
        this.states.forEach((state) => {
            state.isActive = false;
        });
      
        currentPattern.isActive = true;
      
        this.currentPattern = currentPattern;

    }

    checkPattern(){
        
        if((this.changingState) && ((this.currentPattern.type == 'sphere') || (this.currentPattern.type == 'torus'))){
            this.particlesMaterial.uniforms.u_frequency.value = this.audio.arrAverage(this.audio.getSpectrum())/5
        }
    }

    render() {

        this.kickTempo += 1
        this.time += 0.01;

        
        

        this.particlesMaterial.uniforms.u_time.value = this.time;
        this.particlesMaterial.uniforms.u_frequency.value = 1
        this.checkPattern()      

        this.particles.moveParticles()        

        this.initial.initialGeometry.verticesNeedUpdate = true

        if(this.changingState){
            this.displacement()
        }
    
        this.camera.position.x = this.particlesField.position.x + 200 * Math.cos( this.time*this.speedCamera );         
        this.camera.position.y = this.particlesField.position.z + 200 * Math.sin( this.time*this.speedCamera);
        this.camera.position.z = this.particlesField.position.z + 200 * Math.sin( this.time*this.speedCamera);
        this.camera.lookAt( this.particlesField.position );

        this.renderer.render( this.scene, this.camera );
        this.composer.render();
        
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
