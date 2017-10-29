//import Utils
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' 
import Glitch from './postprocessing/glitch.js'
import Sound from './utils/Sound'
import Audio from '../assets/audio/gramatik.mp3' 
import Colors from './utils/Colors'
import StateManager from './utils/StateManager'
import Camera from './utils/camera'
import Animations from './utils/animations'

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

export default class App {

    constructor() {
        //Canvas
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        //Camera
        this.camera = new Camera(70, window.innerWidth / window.innerHeight, 0.1, this.resolutionZ, 250, 150, 1)
        
        //Controls
        this.controls = new OrbitControls(this.camera.pov)
        

        //Scene
        this.scene = new THREE.Scene();
        this.time = 0
        this.distance = 200
        this.resolutionX = window.innerWidth
        this.resolutionY = window.innerHeight
        this.resolutionZ = 10000

        //Axis Helper
        var axisHelper = new THREE.AxisHelper( 50 )
        //this.scene.add(axisHelper)

        //Renderer 
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        
        //Resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );

        //Colors
        this.colors = new Colors

        this.stateManager = new StateManager()
        this.animation = new Animations()
        
        this.initPostProcessing()
        this.audioManager()

        //particles / points stuff
        this.nbParticles = 20000
        this.nbPoints = 100
        this.initialRatio = 0.0055
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
        this.currentPattern = {type: "sphere", isActive: true, data: this.sphere}
        

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
        
        
         

    	



        this.animation.firstAnimation()

        


        
    }

    initPostProcessing() {
        this.glitchMode = new Glitch(this.renderer, this.scene, this.camera.pov)
    }

    checkPattern(){
        
        if((this.changingState) && ((this.currentPattern.type == 'sphere') || (this.currentPattern.type == 'torus'))){
            this.particlesMaterial.uniforms.u_frequency.value = this.audio.arrAverage(this.audio.getSpectrum())/5
        }
    }

    audioManager() {
        var button = document.querySelector('.btn')

        this.audio = new Sound(Audio, 103, .3, () => {
            this.audio._load(Audio, () => {
                button.addEventListener('click', ()=>{
                    this.audio.play()
                })
            });
        }, false);

        this.bass = this.audio.createKick({
            frequency: 3,
            decay:1,
            threshold: 255,
            onKick: () => {
               if(this.kickTempo > 10){
                    this.kickTempo = 0
                    document.querySelector('canvas').style.background = this.colors.getNewColor()
                    this.glitchMode.glitchPass.renderToScreen = true;
                }
            }
        }) 

        this.audio.between('first movement', 0, 18.5, () => {
            this.stateManager.displacement(this.nbParticles, this.sphereState.data.points, this.initial.points, this.initialRatio)
        }) 

        this.audio.between('first drop', 37, 46, () => {
            this.bass.on()
        })
        this.audio.between('normal part', 46, 121, ()=> {
            this.bass.off()
            document.querySelector('canvas').style.background = '#1a1a1a'
            this.glitchMode.glitchPass.renderToScreen = false;

        })
        
        this.audio.between('second drop', 121, 129.5, () => {
            this.bass.on();
        })
        this.audio.between('normal part', 129.5, 205.5, ()=> {
            this.bass.off()
            document.querySelector('canvas').style.background = '#1a1a1a'
            this.glitchMode.glitchPass.renderToScreen = false;
        })

        

        //Kick check
        this.kick = this.audio.createKick({
            frequency: 200,
            decay:1,
            threshold: 5,
            onKick: () => {
               if(this.kickTempo > 25){
                    this.kickTempo = 0
                    this.currentPattern = this.stateManager.getNewPattern(this.states)
                    this.changingState = true
                    this.camera.speed = 2
                    setTimeout(()=>{
                        this.camera.speed = -2
                    }, 3000)
                }
            }
        }) 
        this.kick.on()
        this.kickTempo = 0;

        //End of the sound 
        this.audio.onceAt('end', 225.3, () => {
            this.audio.pause()
            this.animation.finalAnimation()  
        })
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
            this.stateManager.displacement(this.nbParticles, this.currentPattern.data.points, this.initial.points, this.ratio)
        }

        this.camera.rotate(this.particlesField.position, this.distance, this.time )

        this.renderer.render( this.scene, this.camera.pov );
        this.glitchMode.composer.render();
        
    }

    onWindowResize() {

    	this.camera.pov.aspect = window.innerWidth / window.innerHeight;
    	this.camera.pov.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
