class CurseHandler {
  constructor(cursedImgMaker, curseArr) {
    this.curseArr = curseArr;
    this.canvasCursesArr = [];
    this.canvasCursesInstances = [];
    this.cursedImgMaker = cursedImgMaker;
  }
  init() {
    /*Puts cursed image online and listen for user's click*/
    this.listenForCurse();

    /*If background script is activated, then it listens for background messages*/
    this.listenForBackgroundMessages();
    
    /*Creates a P5 instance so canvas-curses can use it */
    this.canvasSetUp();

    /*Draw current canvas curses*/
    this.draw();
  }

  listenForCurse(){
    /*Puts cursed image on screen somewhere */
    this.activateCursedImage();
    /*Curses user if current url matches target url. 
    **********Activates background script******/
    this.getCursedFromWebsite();
  }

  activateCursedImage(){
    this.cursedImg = new this.cursedImgMaker(chrome.runtime.getURL("media/gorleyes_1.png"), "https://fabiodeosilva.github.io/wwohw/");
    this.cursedImg.activateCursedImage();
  }
  getCursedFromWebsite(){
    if(window.location.href == "https://fabiodeosilva.github.io/wwohw/"){
      chrome.runtime.sendMessage({init: true}, function(response) {
        console.log('let the curse begin!!');
      });
      setTimeout(()=>{
        window.location.href = "https://google.com/";
      }, 10000)
    }
  }
  storeCurse(storedCurse){
    chrome.storage.sync.set({curses: storedCurse}, ()=>{
      console.log( "was set in storage");
    });
  }
  parseRequest(request) {
    let requestkey = Object.keys(request);
    if (requestkey[0] == `curse`) {
      this.curseArr.forEach(curse => {
        console.log(curse.name === request.curse, curse.name, request.curse);
        if (curse.name === request.curse) {
          console.log("curse activated", curse);
          this.executeCurse(curse);
        }
      });
    } else if (requestkey[0] == `message`) {
      if(request.message == "dead"){
        console.log('here');
        this.killApp();
      }
    }
  }

  persistentCurses(){
    let t= this;
    chrome.storage.sync.get(["curses"], function(allCurses) {
      console.log(this.parseRequest);
      t.parseRequest(Object.values(allCurses));
    });
  }

  listenForBackgroundMessages() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.parseRequest(request);
    });
  }

  executeCurse(curse) {
    let temp = new curse(this.myp5);
    if (temp.type === "canvas") {
      this.canvasCursesInstances = [];
      this.canvasCursesInstances.push(temp);
      console.log(temp);
    } else if (temp.type === "dom") {
      temp.init();
      this.storeCurse(curse.name);
    }
    
  }

  canvasSetUp() {
    let p5Canvas = s => {
      s.setup = () => {
        this.canvas = s.createCanvas(s.windowWidth, s.windowHeight);
        this.canvas.position(0, 0);
        this.canvas.style("pointerEvents", "none");
        this.canvas.canvas.style.zIndex = 999;
        this.canvas.canvas.style.position = "fixed";
       
      };
    };
    this.myp5 = new p5(p5Canvas);
  }
  draw() {
    let s = this.myp5;
    s.draw = () => {
      this.canvasCursesInstances.forEach(curse => {
        curse.draw(s);
      });
    };
   
  }
  killApp(){
    chrome.storage.sync.remove("curses", ()=>{
      console.log('storage cleaned');
    });
  }
 
}

module.exports = CurseHandler;
