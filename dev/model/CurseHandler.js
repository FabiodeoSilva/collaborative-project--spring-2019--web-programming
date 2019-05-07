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
    this.cursedImg = new this.cursedImgMaker(chrome.runtime.getURL("media/gorleyes_1.png"), "https://www.google.com/");
    this.cursedImg.activateCursedImage();
  }
  getCursedFromWebsite(){
    console.log(window.location.href == "https://www.google.com/", window.location.href, "https://www.google.com/");
    if(window.location.href == "https://www.google.com/"){
      chrome.runtime.sendMessage({init: true}, function(response) {
        console.log('let the curse begin!!');
      });
    }
  }

  listenForBackgroundMessages() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.parseRequest(request);
    });
  }
  parseRequest(request) {
    let key = Object.keys(request);
    if (key[0] == `curse`) {
      this.curseArr.forEach(curse => {
        console.log(curse.name === request.curse, curse.name, request.curse);
        if (curse.name === request.curse) {
          //console.log("curse activated", curse);
          this.executeCurse(curse);
        }
      });
    } else if (key[0] == `message`) {
      console.log(request.message);
    }
  }
  executeCurse(curse) {
    let temp = new curse(this.myp5);
    if (temp.type === "canvas") {
      this.canvasCursesInstances = [];
      this.canvasCursesInstances.push(temp);
      console.log(temp);
    } else if (temp.type === "dom") {
      temp.init();
    }
  }

  canvasSetUp() {
    let p5Canvas = s => {
      s.setup = () => {
        this.canvas = s.createCanvas(s.windowWidth, s.windowHeight);
        this.canvas.position(0, 0);
        this.canvas.style("pointer-events", "none");
        this.canvas.style("z-index", 999);
        this.canvas.style("position", "fixed");
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
}

module.exports = CurseHandler;
