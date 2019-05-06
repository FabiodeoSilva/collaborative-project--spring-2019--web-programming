class CurseHandler {
  constructor(curseArr) {
    this.curseArr = curseArr;
  }
  init() {
    //this.listenForActivation();
    this.canvasSetUp();
    this.draw();
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
          console.log("curse activated", curse);
          curse();
        }
      });
    } else if (key[0] == `message`) {
      //console.log(request.message);
    }
  }

  canvasSetUp() {
    let p5Canvas = s => {
      console.log(s);

      s.setup = () => {
        let h = document.body.clientHeight;
        s.createCanvas(s.windowWidth, s.windowHeight);
        /*c.position(0, 0);
        c.style("pointer-events", "none");
        c.style("position", "fixed");
        c.style("z-index", 999);*/
      };
    };
    this.myp5 = new p5(p5Canvas);
  }
  draw() {
    let s = this.myp5;
    s.draw = () => {
      s.fill("black");
      s.ellipse(100, 100, 100);
    };
  }
}

module.exports = CurseHandler;
