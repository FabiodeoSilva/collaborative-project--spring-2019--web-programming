class CurseHandler {
  constructor(cursedImg, curseArr) {
    this.curseArr = curseArr;
    this.canvasCursesArr = [];
    this.canvasCursesInstances = [];
    this.cursedImg = cursedImg;
  }
  init() {
    //this.sortCanvasCurses();
    this.activateCursedImage();
   /* this.canvasSetUp();
    this.listenForActivation();
    this.draw();*/
  }

  activateCursedImage(){
    this.cursedImg(chrome.runtime.getURL("media/gorleyes_1.png"), "https://github.com");
    console.log('here');
  }

  listenForActivation() {
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
