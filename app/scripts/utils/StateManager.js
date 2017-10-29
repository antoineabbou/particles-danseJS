export default class StateManager {
    constructor() {
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