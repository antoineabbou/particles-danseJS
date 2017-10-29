import EffectComposer from 'imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer' 
import RenderPass from 'imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass'
import MaskPass from 'imports-loader?THREE=three!exports-loader?THREE.MaskPass!three/examples/js/postprocessing/MaskPass'
import ShaderPass from 'imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass'
import GlitchPass from 'imports-loader?THREE=three!exports-loader?THREE.GlitchPass!three/examples/js/postprocessing/GlitchPass'

import CopyShader from 'imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader'
import DigitalGlitch from 'imports-loader?THREE=three!exports-loader?THREE.DigitalGlitch!three/examples/js/shaders/DigitalGlitch'

export default class Glitch {
    constructor (renderer, scene, camera){
        this.composer = new EffectComposer( renderer );
        this.composer.setSize( window.innerWidth, window.innerHeight );        
        this.renderScene = new RenderPass(scene, camera);
        this.copyShader = new ShaderPass(THREE.CopyShader);
        this.composer.addPass( new RenderPass( scene, camera ) );

        this.glitchPass = new GlitchPass();
        this.composer.addPass( this.glitchPass );
        this.copyShader.renderToScreen = true;
    }
}