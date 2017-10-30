import Cube from '../shapes/cube'
import Hemisphere from '../shapes/hemisphere'
import Octa from '../shapes/octa'
import Plane from '../shapes/plane'
import Cylinder from '../shapes/cylinder'
import Sphere from '../shapes/sphere'
import Tear from '../shapes/tear'
import Torus from '../shapes/torus'

export default class StateManager {
    constructor(nb) {

        //Instanciation of my shapes 
        this.cube = new Cube(nb)
        this.cylinder = new Cylinder(nb)
        this.hemisphere = new Hemisphere(nb)
        this.octa = new Octa(nb)
        this.plane = new Plane(nb)
        this.sphere = new Sphere(nb)
        this.tear = new Tear(nb)
        this.torus = new Torus(nb)

        //We are putting all the shapes in an array to manage them
        this.states = []
        this.cubeState = {
            type : 'cube', 
            isActive : false, 
            data: this.cube
        }
        this.cylinderState = {
            type : 'cylinder', 
            isActive : false, 
            data: this.cylinder
        }
        this.hemisphereState = {
            type : 'hemisphere', 
            isActive : false, 
            data: this.hemisphere
        }
        this.planeState = {
            type : 'plane', 
            isActive : false, 
            data: this.plane
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
        this.states.push(this.cubeState, this.cylinderState, this.hemisphereState, this.planeState, this.octaState, this.sphereState, this.tearState, this.torusState)
    }

    displacement(nb, departure, arrival, ratio) {
        for(var i=0; i< nb; i++){
            arrival[i].x += (departure[i].x - arrival[i].x) * ratio
            arrival[i].y += (departure[i].y - arrival[i].y) * ratio
            arrival[i].z += (departure[i].z - arrival[i].z) * ratio
        }
            
    }

    getNewPattern(arrStates) {
        let nextPatterns = arrStates.filter((state) => {
            return state.isActive != true;
          });
      
        let currentPattern = nextPatterns[Math.floor(Math.random() * nextPatterns.length)];

        arrStates.forEach((state) => {
            state.isActive = false;
        });
      
        currentPattern.isActive = true;
      
        return currentPattern;

    }

} 