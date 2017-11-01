//import Utils
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' 
import Glitch from './postprocessing/glitch.js'
import Sound from './utils/Sound'
import Audio from '../assets/audio/gramatik.mp3' 
import Colors from './utils/Colors'
import StateManager from './utils/StateManager'
import Camera from './utils/camera'
import Animations from './utils/animations'
import Controls from './utils/controls'

//import Shaders 
import vertParticles from './glsl/shaders/particles/particles.vert'
import fragParticles from './glsl/shaders/particles/particles.frag'

// import first shape and stars
import Initial from './shapes/initial'
import Particles from './shapes/particles'
import Final from './shapes/final'


export default class App {

    constructor() {
        
        //Canvas
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        //Camera
        this.camera = new Camera(70, window.innerWidth / window.innerHeight, 0.1, this.resolutionZ, 250, 150, 1)
        
        //Scene
        this.scene = new THREE.Scene();
        this.time = 0
        this.distance = 200
        this.resolutionX = window.innerWidth
        this.resolutionY = window.innerHeight
        this.resolutionZ = 10000


        //Renderer 
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        
        //Resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );

        //Utils stuff instanciation
        this.colors = new Colors()
        this.animations = new Animations()
        this.controls = new Controls()
        

        //Postprocessing
        this.initPostProcessing()
        
        //Audio
        this.audioManager()

        //particles / points
        this.nbParticles = 10000
        this.nbPoints = 80


        //state | shape Manager 
        this.stateManager = new StateManager(this.nbParticles)

        //Ratio - Speed of particles when changing
        this.initialRatio = 0.0055 
        this.ratio = 0.06
        
        //Instances of white particles
        this.particles = new Particles(this.nbPoints)
        for(var i = 0; i < this.nbPoints; i++){
            this.scene.add(this.particles.particles[i]);
        }

        //instance of the first shape 
        this.initial = new Initial(this.nbParticles)
        this.final = new Final(this.nbParticles)


        //First pattern is the sphere
        this.currentPattern = {type: "sphere", isActive: true, data: this.stateManager.sphereState.data}       

        //Particles representing the shape - creation
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
        
        
        // Launching first animation 
       
    }

    initPostProcessing() {
        this.glitchMode = new Glitch(this.renderer, this.scene, this.camera.pov)
    }

    checkPattern(){ // Check if torus,sphere or plane, if it's the case, shape is noisy
        if((this.changingState) && ((this.currentPattern.type == 'sphere') || (this.currentPattern.type == 'torus'))){
            this.particlesMaterial.uniforms.u_frequency.value = this.audio.arrAverage(this.audio.getSpectrum())/5
        }
    }

     //AudioManager instanciation
    audioManager() {
        var button = document.querySelector('.btn')
        var onSound = document.querySelector('.sound_on')
        var offSound = document.querySelector('.sound_off')

        this.kickTempo = 0;

        this.audio = new Sound(Audio, 103, .3, () => {
            this.audio._load(Audio, () => {
                this.animations.firstAnimation()
                button.addEventListener('click', ()=>{
                    this.audio.play()
                })
            });
        }, false);


        this.audio.between('first movement', 0, 18.5, () => {
            this.stateManager.displacement(this.nbParticles, this.stateManager.sphereState.data.points, this.initial.points, this.initialRatio)
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
        this.audio.between('normal part', 129.5, 204.5, ()=> {
            this.bass.off()
            document.querySelector('canvas').style.background = '#1a1a1a'
            this.glitchMode.glitchPass.renderToScreen = false;
        })

        this.audio.after('normal part', 205, ()=> {
            this.stateManager.displacement(this.nbParticles, this.final.points, this.currentPattern.data.points, this.initialRatio)
        })

        //End of the sound 
        this.audio.onceAt('end', 224, () => {
            this.audio.pause()
            this.animations.finalAnimation()  
        })

        //Bass check
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
        

        //Kick check
        this.kick = this.audio.createKick({
            frequency: 200,
            decay:1,
            threshold: 5,
            onKick: () => {
               if(this.kickTempo > 25){
                    this.kickTempo = 0
                    this.currentPattern = this.stateManager.getNewPattern(this.stateManager.states)
                    this.changingState = true
                    this.camera.speed = 2
                    setTimeout(()=>{
                        this.camera.speed = -2
                    }, 3000)
                }
            }
        }) 
        this.kick.on()

        onSound.addEventListener('click', () => {
            this.audio.pause()
            onSound.style.display = 'none'
            offSound.style.display = 'inline-block'
        })

        offSound.addEventListener('click', () => {
            this.audio.play()
            onSound.style.display = 'inline-block'
            offSound.style.display = 'none'
        })
    }
    

    render() {

        this.kickTempo += 1
        this.time += 0.01;

        this.particlesMaterial.uniforms.u_time.value = this.time;
        this.particlesMaterial.uniforms.u_frequency.value = 1

        this.checkPattern() 
        this.particles.moveParticles() //White particles constantly move       

        this.initial.initialGeometry.verticesNeedUpdate = true 

        if(this.changingState){ //If we are on a kick then we change shapes this way :
            this.stateManager.displacement(this.nbParticles, this.currentPattern.data.points, this.initial.points, this.ratio)
        }

        this.camera.rotate(this.particlesField.position, this.distance, this.time ) //Constantly rotate around the shape

        this.renderer.render( this.scene, this.camera.pov );

        this.glitchMode.composer.render(); //Glitch mode on drop
    }

    onWindowResize() { //Resize stuff
    	this.camera.pov.aspect = window.innerWidth / window.innerHeight;
    	this.camera.pov.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
