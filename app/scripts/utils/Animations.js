import {TweenMax, Power2, TimelineLite} from 'gsap'

export default class Animations {
    
    constructor () {
        this.wrapper = document.getElementById('wrapper')
        this.container = document.getElementById('container')
        this.title = document.querySelector('.title')
        this.canvas = document.querySelector('canvas')
        this.subtitle = document.querySelector('h3')
        this.description = document.querySelector('h5')
        this.subtitles = document.querySelector('.first-part')
        this.author = document.querySelector('.author')
        this.button = document.querySelector('.btn')
        this.song = document.querySelector('.song')
        this.github = document.querySelector('.github')
        this.tools = document.querySelector('.tools')
        this.controls = document.querySelector('.controls')
        this.textContent = document.querySelector('.text-content')

        this.endWrapper = document.getElementById('end-wrapper')
        this.endContent = document.querySelector(".end-content")
        this.endContainer = document.getElementById("end-container")
        this.endTitle = document.querySelector(".end-title")

        this.tl = new TimelineMax(); 
        this.endTl = new TimelineMax()


        setTimeout(()=>{
            var body = document.querySelector('body')
            var btnFS = document.querySelector('.full_screen')
            btnFS.addEventListener('click', () => {
                this.requestFullScreen(body)
            })

            document.addEventListener( 'keydown', (e)=> {
                if (e.keyCode === 27) {
                    this.showControls() // esc
                    console.log('rioezoiru')
                }
            });
        }, 1000)     

    }

    firstAnimation() {
        if(window.innerWidth<=500){
            this.tl.to(this.container, 1, {width:'91%',ease: Expo.easeOut}, '+=1')
            this.tl.to(this.container, 1, {height:'95%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>500 && window.innerWidth<=767){
            this.tl.to(this.container, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.tl.to(this.container, 1, {height:'96%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>767 && window.innerWidth<=1024){
            this.tl.to(this.container, 1, {width:'95%',ease: Expo.easeOut}, '+=1')
            this.tl.to(this.container, 1, {height:'96%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>1024 && window.innerWidth<=1439){
            this.tl.to(this.container, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.tl.to(this.container, 1, {height:'93%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>1439){
            this.tl.to(this.container, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.tl.to(this.container, 1, {height:'93%',ease: Expo.easeOut})
        }
        this.tl.to(this.title, 1, {opacity:1, y:'-90', ease: Expo.easeOut})
        this.tl.to(this.subtitle, 1, {opacity:1, ease: Expo.easeOut})
        this.tl.to(this.description, 1.2, {opacity:1, ease: Expo.easeOut})
        this.tl.to(this.subtitles, 0.7, {opacity:0, ease: Expo.easeOut}, '+=0.8')
        this.tl.to(this.button, 1, {display: 'inline-block'})
        this.tl.to(this.author, 1.5, {opacity:1, ease: Expo.easeOut})
        this.tl.to(this.button, 1.5, {opacity:1, ease: Expo.easeOut}, '-=1.5')

        this.button.addEventListener('click', () => {
            this.tl.to(this.author, 1, {opacity:0, ease: Expo.easeOut})
            this.tl.to(this.button, 1, {opacity:0, ease: Expo.easeOut}, '-=1')
            this.tl.to(this.container, 0.75, {height:'0.5px',ease: Expo.easeOut})
            this.tl.to(this.container, 0.75, {width:'0%',ease: Expo.easeOut})
            setTimeout(()=> {
                this.wrapper.style.display = 'none'
                this.tl.to(this.canvas, 1, {opacity: 1, ease: Expo.easeOut}, '+=0.5')
                this.tl.to(this.song, 1, {opacity: 1, ease: Expo.easeOut}, '+=1.5')
                this.tl.to(this.github, 1, {opacity: 1, ease: Expo.easeOut}, '-=1')
                this.tl.to(this.tools, 1, {opacity: 1, ease: Expo.easeOut}, '-=1')                
                
                 
            },2700) 
            
        })
    }

    finalAnimation() {
        this.endWrapper.style.background = '#1a1a1a'
        this.tl.to(this.song, 1, {opacity:0})
        this.tl.to(this.github, 1, {opacity:0}, '-=1')
        this.endWrapper.style.display = 'flex'
        this.endContainer.style.display = 'block'     
        
        
        if(window.innerWidth<=500){
            this.endTl.to(this.endContainer, 1, {width:'91%',ease: Expo.easeOut}, '+=1')
            this.endTl.to(this.endContainer, 1, {height:'95%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>500 && window.innerWidth<=767){
            this.endTl.to(this.endContainer, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.endTl.to(this.endContainer, 1, {height:'96%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>767 && window.innerWidth<=1024){
            this.endTl.to(this.endContainer, 1, {width:'95%',ease: Expo.easeOut}, '+=1')
            this.endTl.to(this.endContainer, 1, {height:'96%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>1024 && window.innerWidth<=1439){
            this.endTl.to(this.endContainer, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.endTl.to(this.endContainer, 1, {height:'93%',ease: Expo.easeOut})
        }
        else if(window.innerWidth>1439){
            this.endTl.to(this.endContainer, 1, {width:'96%',ease: Expo.easeOut}, '+=1')
            this.endTl.to(this.endContainer, 1, {height:'93%',ease: Expo.easeOut})
        }
        this.endTl.to(this.endTitle, 1, {opacity:1, y:-40, ease:Power4.easeOut})
        this.endTl.staggerFrom(".social", 1.5, {scale:0.5, opacity:0, ease:Elastic.easeOut, force3D:true}, 0.2)  
    }

    requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        var textContent = document.querySelector('.text-content')
        
        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }

        this.tools.style.opacity = 0
        
    }

    showControls() {
        this.tools.style.opacity = 1
    }

}