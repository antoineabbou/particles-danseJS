export default class Colors {
    constructor() {
        this.colors = []
        this.firstColor = {
            type : 'first', 
            isActive : false, 
            data: '#F5B076'
        }
        this.secondColor = {
            type : 'second', 
            isActive : false, 
            data: '#EB8063'
        }
        this.thirdColor = {
            type : 'third', 
            isActive : false, 
            data: '#D3475B'
        }
        this.fourthColor = {
            type : 'fourth', 
            isActive : false, 
            data: '#474889'
        }
        this.fifthColor = {
            type : 'fifth', 
            isActive : false, 
            data: '#1E1D45'
        }
        this.colors.push(this.firstColor, this.secondColor, this.thirdColor, this.fourthColor, this.fifthColor)
    }


    getNewColor() {
        let nextColors = this.colors.filter((color) => {
            return color.isActive != true;
          });
      
        let currentColor = nextColors[Math.floor(Math.random() * nextColors.length)];
      
        // Remove isActive
        this.colors.forEach((color) => {
            color.isActive = false;
        });
        currentColor.isActive = true;
        this.currentColor= currentColor;
        return this.currentColor.data

    }
}