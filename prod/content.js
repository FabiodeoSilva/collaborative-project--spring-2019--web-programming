(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");
const CursedImg = require("./curses/cursed-image");

let curseHandler = new CurseHandler(CursedImg, [Swarm, sayhi, Blood, Swarm, Blood]);
curseHandler.init();

},{"./curses/bloodyScreen":2,"./curses/cursed-image":3,"./curses/cursorSwarm":4,"./curses/test.js":5,"./model/CurseHandler.js":6}],2:[function(require,module,exports){
class Blood {
  constructor(s) {
    this.type = "canvas";
    this.bloodArr = [];
    this.setup(s);
  }
  setup(s) {
    for (let i = 0; i <= s.width; i++) {
      this.bloodArr.push({
        xPos: i,
        yPos: 0,
        red: Math.floor(this.random(155, 255)),
        SpeedRate: 1 / this.getRndBias(1, 10, 5, 1)
      });
    }
  }

  draw(s) {
    s.push();
    this.bloodArr.forEach(drop => {
      s.stroke(s.color(drop.red, 0, 0));
      s.point(drop.xPos, drop.yPos);
      if (drop.yPos <= s.height) drop.yPos += drop.SpeedRate;
    });
    s.pop();
  }

  getRndBias(min, max, bias, influence) {
    let rnd = Math.random() * (max - min) + min, // random in range
      mix = Math.random() * influence; // random mixer
    return rnd * (1 - mix) + bias * mix; // mix full range and bias
  }

  random(min, max, decimal = false) {
    if (!decimal) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      min = min;
      max = max;
      return Math.random() * (max - min + 1) + min;
    }
  }
}

let bloodScreenRandom = (s, beat) => {
  s.stroke(s.color(random(100, 255), 0, 0));
  for (let i = 0; i <= s.width; i++) {
    if (beat <= s.height) yPos = random(0, beat);
    else yPos = random(0, s.height);
    s.point(i, yPos);
  }
};

module.exports = Blood;

},{}],3:[function(require,module,exports){
class CursedImg{
  constructor(imgUrl = chrome.runtime.getURL("media/gorleyes_1.png"), destinationURL){
    this.type = 'dom';
    this.imgUrl = imgUrl;
    this.destinationURL = destinationURL;
  }
  activateCursedImage() {
    let body = document.querySelector("body");
    let imgsArr = document.querySelectorAll("img");
    let bigImgs = [];
    imgsArr.forEach(img => {
      if (img.width > 50 && img.height > 50) bigImgs.push(img);
    });
  
    let eyes = document.createElement("img");
    eyes.style.position = "absolute";
    eyes.src = chrome.runtime.getURL("media/gorleyes_2.png");
  
    if (bigImgs.length > 3) {
      let cursedImg = bigImgs[this.random(2, bigImgs.length - 1)];
      console.log(
        cursedImg,
        window.getComputedStyle(cursedImg.parentNode).width,
        window.getComputedStyle(cursedImg.parentNode).height
      );
      let frame = document.createElement("div");
      frame.style.width = window.getComputedStyle(cursedImg.parentNode).width;
      frame.style.height = window.getComputedStyle(cursedImg.parentNode).height;
      frame.style.position = "absolute";
      frame.style.top = "0px";
      frame.style.zIndex = "2";
      frame.style.backgroundPosition = "top center";
      frame.style.backgroundImage = `url('${this.imgUrl}')`;
      frame.style.backgroundRepeat = "no-repeat";
      frame.style.backgroundSize = "contain";
      cursedImg.parentNode.style.position = "relative";
      cursedImg.parentNode.append(frame);
      eyes.style.width = `calc(${frame.style.width}/2.2)`;
      eyes.style.top = `calc(${frame.style.height}/4.5)`;
      eyes.style.left = `calc(${frame.style.width}/3.5)`;
      cursedImg.parentNode.append(eyes);
      if (cursedImg.srcset) cursedImg.removeAttribute("srcset");
      if (cursedImg.parentElement.tagName === "A") {
        cursedImg.parentElement.href =this. destinationURL;
      }
      cursedImg.parentElement.addEventListener("click", () => {
        window.location.href =this. destinationURL;
      });
  
      body.addEventListener("mousemove", e => {
        eyes.style.transform = `translate(${e.clientX /
          (window.innerWidth / 5)}px, ${e.clientY / (window.innerHeight / 5)}px)`;
        console.log(e.clientX / (window.innerWidth / 5));
      });
    }
  };
  random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}


/*activateCursedImage(
  chrome.runtime.getURL("uncompressed-images/gorleyes_1.png"),
  "https://github.com/"
);*/


module.exports = CursedImg;

},{}],4:[function(require,module,exports){
class Cursor {
  constructor(positionCoor, speeds, angles, amplitude, s) {
    this.amplitude = amplitude;
    this.angleX = angles[0];
    this.angleY = angles[1];
    this.speedX = speeds[0];
    this.speedY = speeds[1];

    if (true) {
          this.cursorStroke = "white";
          this.cursorColor = "black";
    } else {
          this.cursorStroke = "black";
          this.cursorColor = "white";
    }
    this.update(positionCoor[0], positionCoor[1], s);
  }

  trace(s) {
    s.fill(this.cursorColor);
    s.stroke(this.cursorStroke);
    s.beginShape();
    this.vertices.forEach(coor => {
          s.vertex(coor[0], coor[1]);
    });
    s.endShape(s.CLOSE);
  }

  circle(s) {
    let px = s.sin(this.angleX) * this.amplitude + s.windowWidth / 2;
    let py = s.cos(this.angleY) * this.amplitude + s.windowHeight / 2;
    this.update(px, py, s);
    this.angleX += this.speedX;
    this.angleY += this.speedY;
  }

  update(x, y, s) {
    let prop = 13;
    this.vertices = [
      [x, y],
      [x, y + 167 / prop],
      [x + 39 / prop, y + 129 / prop],
      [x + 75 / prop, y + 214 / prop],
      [x + 100 / prop, y + 201 / prop],
      [x + 66 / prop, y + 115 / prop],
      [x + 122 / prop, y + 115 / prop]
    ];
    this.trace(s);
  }

  random(min, max, decimal = false) {
    if (!decimal) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      min = min;
      max = max;
      return Math.random() * (max - min + 1) + min;
    }
  }

  swarmRandom(s) {
    this.swarmArr.forEach(cursor => {
      cursor.cricle(s);
    });
  }
}

class Swarm{
  constructor(s){
    this.type = 'canvas';
    this.swarmArr = [];
    this.init(s);
  }

  init(s){
    let temp,
    positionCoor = [],
    speeds = [],
    angles = [],
    r,
    amount = 300, 
    amplitude;

    for (let i = 0; i < amount; i++) {

      positionCoor = [0, 0];
      speeds = [
        Math.abs(this.random(0, 0.2, true) / 50),
        Math.abs(this.random(0, 0.2, true) / 50)
      ];
      angles = [0, 0];
      amplitude = this.random(20, 1000);
      temp = new Cursor(positionCoor, speeds, angles, amplitude, s);
      this.swarmArr.push(temp);
    }
  }
  random(min, max, decimal = false) {
    if (!decimal) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      min = min;
      max = max;
      return Math.random() * (max - min + 1) + min;
    }
  }
  draw(s){
    s.push();
    s.clear();
    this.swarmArr.forEach((cursor)=>{
      cursor.circle(s);
    });
    s.pop();
  }
}

module.exports = Cursor;
module.exports = Swarm;


},{}],5:[function(require,module,exports){
class sayhi {
  constructor() {
    this.type = "dom";
  }

  init() {
    let body = document.querySelector("body");
    body.style.background = "pink";
    console.log("hi");
  }
}

module.exports = sayhi;

},{}],6:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvYmxvb2R5U2NyZWVuLmpzIiwiZGV2L2N1cnNlcy9jdXJzZWQtaW1hZ2UuanMiLCJkZXYvY3Vyc2VzL2N1cnNvclN3YXJtLmpzIiwiZGV2L2N1cnNlcy90ZXN0LmpzIiwiZGV2L21vZGVsL0N1cnNlSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDdXJzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9DdXJzZUhhbmRsZXIuanNcIik7XHJcbmNvbnN0IHNheWhpID0gcmVxdWlyZShcIi4vY3Vyc2VzL3Rlc3QuanNcIik7XHJcbmNvbnN0IEJsb29kID0gcmVxdWlyZShcIi4vY3Vyc2VzL2Jsb29keVNjcmVlblwiKTtcclxuY29uc3QgU3dhcm0gPSByZXF1aXJlKFwiLi9jdXJzZXMvY3Vyc29yU3dhcm1cIik7XHJcbmNvbnN0IEN1cnNlZEltZyA9IHJlcXVpcmUoXCIuL2N1cnNlcy9jdXJzZWQtaW1hZ2VcIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihDdXJzZWRJbWcsIFtTd2FybSwgc2F5aGksIEJsb29kLCBTd2FybSwgQmxvb2RdKTtcclxuY3Vyc2VIYW5kbGVyLmluaXQoKTtcclxuIiwiY2xhc3MgQmxvb2Qge1xyXG4gIGNvbnN0cnVjdG9yKHMpIHtcclxuICAgIHRoaXMudHlwZSA9IFwiY2FudmFzXCI7XHJcbiAgICB0aGlzLmJsb29kQXJyID0gW107XHJcbiAgICB0aGlzLnNldHVwKHMpO1xyXG4gIH1cclxuICBzZXR1cChzKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzLndpZHRoOyBpKyspIHtcclxuICAgICAgdGhpcy5ibG9vZEFyci5wdXNoKHtcclxuICAgICAgICB4UG9zOiBpLFxyXG4gICAgICAgIHlQb3M6IDAsXHJcbiAgICAgICAgcmVkOiBNYXRoLmZsb29yKHRoaXMucmFuZG9tKDE1NSwgMjU1KSksXHJcbiAgICAgICAgU3BlZWRSYXRlOiAxIC8gdGhpcy5nZXRSbmRCaWFzKDEsIDEwLCA1LCAxKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRyYXcocykge1xyXG4gICAgcy5wdXNoKCk7XHJcbiAgICB0aGlzLmJsb29kQXJyLmZvckVhY2goZHJvcCA9PiB7XHJcbiAgICAgIHMuc3Ryb2tlKHMuY29sb3IoZHJvcC5yZWQsIDAsIDApKTtcclxuICAgICAgcy5wb2ludChkcm9wLnhQb3MsIGRyb3AueVBvcyk7XHJcbiAgICAgIGlmIChkcm9wLnlQb3MgPD0gcy5oZWlnaHQpIGRyb3AueVBvcyArPSBkcm9wLlNwZWVkUmF0ZTtcclxuICAgIH0pO1xyXG4gICAgcy5wb3AoKTtcclxuICB9XHJcblxyXG4gIGdldFJuZEJpYXMobWluLCBtYXgsIGJpYXMsIGluZmx1ZW5jZSkge1xyXG4gICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbiwgLy8gcmFuZG9tIGluIHJhbmdlXHJcbiAgICAgIG1peCA9IE1hdGgucmFuZG9tKCkgKiBpbmZsdWVuY2U7IC8vIHJhbmRvbSBtaXhlclxyXG4gICAgcmV0dXJuIHJuZCAqICgxIC0gbWl4KSArIGJpYXMgKiBtaXg7IC8vIG1peCBmdWxsIHJhbmdlIGFuZCBiaWFzXHJcbiAgfVxyXG5cclxuICByYW5kb20obWluLCBtYXgsIGRlY2ltYWwgPSBmYWxzZSkge1xyXG4gICAgaWYgKCFkZWNpbWFsKSB7XHJcbiAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWluID0gbWluO1xyXG4gICAgICBtYXggPSBtYXg7XHJcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubGV0IGJsb29kU2NyZWVuUmFuZG9tID0gKHMsIGJlYXQpID0+IHtcclxuICBzLnN0cm9rZShzLmNvbG9yKHJhbmRvbSgxMDAsIDI1NSksIDAsIDApKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8PSBzLndpZHRoOyBpKyspIHtcclxuICAgIGlmIChiZWF0IDw9IHMuaGVpZ2h0KSB5UG9zID0gcmFuZG9tKDAsIGJlYXQpO1xyXG4gICAgZWxzZSB5UG9zID0gcmFuZG9tKDAsIHMuaGVpZ2h0KTtcclxuICAgIHMucG9pbnQoaSwgeVBvcyk7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9vZDtcclxuIiwiY2xhc3MgQ3Vyc2VkSW1ne1xyXG4gIGNvbnN0cnVjdG9yKGltZ1VybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIm1lZGlhL2dvcmxleWVzXzEucG5nXCIpLCBkZXN0aW5hdGlvblVSTCl7XHJcbiAgICB0aGlzLnR5cGUgPSAnZG9tJztcclxuICAgIHRoaXMuaW1nVXJsID0gaW1nVXJsO1xyXG4gICAgdGhpcy5kZXN0aW5hdGlvblVSTCA9IGRlc3RpbmF0aW9uVVJMO1xyXG4gIH1cclxuICBhY3RpdmF0ZUN1cnNlZEltYWdlKCkge1xyXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgIGxldCBpbWdzQXJyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICAgIGxldCBiaWdJbWdzID0gW107XHJcbiAgICBpbWdzQXJyLmZvckVhY2goaW1nID0+IHtcclxuICAgICAgaWYgKGltZy53aWR0aCA+IDUwICYmIGltZy5oZWlnaHQgPiA1MCkgYmlnSW1ncy5wdXNoKGltZyk7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGxldCBleWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGV5ZXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICBleWVzLnNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIm1lZGlhL2dvcmxleWVzXzIucG5nXCIpO1xyXG4gIFxyXG4gICAgaWYgKGJpZ0ltZ3MubGVuZ3RoID4gMykge1xyXG4gICAgICBsZXQgY3Vyc2VkSW1nID0gYmlnSW1nc1t0aGlzLnJhbmRvbSgyLCBiaWdJbWdzLmxlbmd0aCAtIDEpXTtcclxuICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgY3Vyc2VkSW1nLFxyXG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGN1cnNlZEltZy5wYXJlbnROb2RlKS53aWR0aCxcclxuICAgICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjdXJzZWRJbWcucGFyZW50Tm9kZSkuaGVpZ2h0XHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGZyYW1lLnN0eWxlLndpZHRoID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3Vyc2VkSW1nLnBhcmVudE5vZGUpLndpZHRoO1xyXG4gICAgICBmcmFtZS5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjdXJzZWRJbWcucGFyZW50Tm9kZSkuaGVpZ2h0O1xyXG4gICAgICBmcmFtZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgZnJhbWUuc3R5bGUudG9wID0gXCIwcHhcIjtcclxuICAgICAgZnJhbWUuc3R5bGUuekluZGV4ID0gXCIyXCI7XHJcbiAgICAgIGZyYW1lLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwidG9wIGNlbnRlclwiO1xyXG4gICAgICBmcmFtZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke3RoaXMuaW1nVXJsfScpYDtcclxuICAgICAgZnJhbWUuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9IFwibm8tcmVwZWF0XCI7XHJcbiAgICAgIGZyYW1lLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb250YWluXCI7XHJcbiAgICAgIGN1cnNlZEltZy5wYXJlbnROb2RlLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgICBjdXJzZWRJbWcucGFyZW50Tm9kZS5hcHBlbmQoZnJhbWUpO1xyXG4gICAgICBleWVzLnN0eWxlLndpZHRoID0gYGNhbGMoJHtmcmFtZS5zdHlsZS53aWR0aH0vMi4yKWA7XHJcbiAgICAgIGV5ZXMuc3R5bGUudG9wID0gYGNhbGMoJHtmcmFtZS5zdHlsZS5oZWlnaHR9LzQuNSlgO1xyXG4gICAgICBleWVzLnN0eWxlLmxlZnQgPSBgY2FsYygke2ZyYW1lLnN0eWxlLndpZHRofS8zLjUpYDtcclxuICAgICAgY3Vyc2VkSW1nLnBhcmVudE5vZGUuYXBwZW5kKGV5ZXMpO1xyXG4gICAgICBpZiAoY3Vyc2VkSW1nLnNyY3NldCkgY3Vyc2VkSW1nLnJlbW92ZUF0dHJpYnV0ZShcInNyY3NldFwiKTtcclxuICAgICAgaWYgKGN1cnNlZEltZy5wYXJlbnRFbGVtZW50LnRhZ05hbWUgPT09IFwiQVwiKSB7XHJcbiAgICAgICAgY3Vyc2VkSW1nLnBhcmVudEVsZW1lbnQuaHJlZiA9dGhpcy4gZGVzdGluYXRpb25VUkw7XHJcbiAgICAgIH1cclxuICAgICAgY3Vyc2VkSW1nLnBhcmVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9dGhpcy4gZGVzdGluYXRpb25VUkw7XHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZSA9PiB7XHJcbiAgICAgICAgZXllcy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7ZS5jbGllbnRYIC9cclxuICAgICAgICAgICh3aW5kb3cuaW5uZXJXaWR0aCAvIDUpfXB4LCAke2UuY2xpZW50WSAvICh3aW5kb3cuaW5uZXJIZWlnaHQgLyA1KX1weClgO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUuY2xpZW50WCAvICh3aW5kb3cuaW5uZXJXaWR0aCAvIDUpKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICByYW5kb20obWluLCBtYXgpIHtcclxuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyphY3RpdmF0ZUN1cnNlZEltYWdlKFxyXG4gIGNocm9tZS5ydW50aW1lLmdldFVSTChcInVuY29tcHJlc3NlZC1pbWFnZXMvZ29ybGV5ZXNfMS5wbmdcIiksXHJcbiAgXCJodHRwczovL2dpdGh1Yi5jb20vXCJcclxuKTsqL1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Vyc2VkSW1nO1xyXG4iLCJjbGFzcyBDdXJzb3Ige1xyXG4gIGNvbnN0cnVjdG9yKHBvc2l0aW9uQ29vciwgc3BlZWRzLCBhbmdsZXMsIGFtcGxpdHVkZSwgcykge1xyXG4gICAgdGhpcy5hbXBsaXR1ZGUgPSBhbXBsaXR1ZGU7XHJcbiAgICB0aGlzLmFuZ2xlWCA9IGFuZ2xlc1swXTtcclxuICAgIHRoaXMuYW5nbGVZID0gYW5nbGVzWzFdO1xyXG4gICAgdGhpcy5zcGVlZFggPSBzcGVlZHNbMF07XHJcbiAgICB0aGlzLnNwZWVkWSA9IHNwZWVkc1sxXTtcclxuXHJcbiAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JTdHJva2UgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvckNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY3Vyc29yU3Ryb2tlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JDb2xvciA9IFwid2hpdGVcIjtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlKHBvc2l0aW9uQ29vclswXSwgcG9zaXRpb25Db29yWzFdLCBzKTtcclxuICB9XHJcblxyXG4gIHRyYWNlKHMpIHtcclxuICAgIHMuZmlsbCh0aGlzLmN1cnNvckNvbG9yKTtcclxuICAgIHMuc3Ryb2tlKHRoaXMuY3Vyc29yU3Ryb2tlKTtcclxuICAgIHMuYmVnaW5TaGFwZSgpO1xyXG4gICAgdGhpcy52ZXJ0aWNlcy5mb3JFYWNoKGNvb3IgPT4ge1xyXG4gICAgICAgICAgcy52ZXJ0ZXgoY29vclswXSwgY29vclsxXSk7XHJcbiAgICB9KTtcclxuICAgIHMuZW5kU2hhcGUocy5DTE9TRSk7XHJcbiAgfVxyXG5cclxuICBjaXJjbGUocykge1xyXG4gICAgbGV0IHB4ID0gcy5zaW4odGhpcy5hbmdsZVgpICogdGhpcy5hbXBsaXR1ZGUgKyBzLndpbmRvd1dpZHRoIC8gMjtcclxuICAgIGxldCBweSA9IHMuY29zKHRoaXMuYW5nbGVZKSAqIHRoaXMuYW1wbGl0dWRlICsgcy53aW5kb3dIZWlnaHQgLyAyO1xyXG4gICAgdGhpcy51cGRhdGUocHgsIHB5LCBzKTtcclxuICAgIHRoaXMuYW5nbGVYICs9IHRoaXMuc3BlZWRYO1xyXG4gICAgdGhpcy5hbmdsZVkgKz0gdGhpcy5zcGVlZFk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoeCwgeSwgcykge1xyXG4gICAgbGV0IHByb3AgPSAxMztcclxuICAgIHRoaXMudmVydGljZXMgPSBbXHJcbiAgICAgIFt4LCB5XSxcclxuICAgICAgW3gsIHkgKyAxNjcgLyBwcm9wXSxcclxuICAgICAgW3ggKyAzOSAvIHByb3AsIHkgKyAxMjkgLyBwcm9wXSxcclxuICAgICAgW3ggKyA3NSAvIHByb3AsIHkgKyAyMTQgLyBwcm9wXSxcclxuICAgICAgW3ggKyAxMDAgLyBwcm9wLCB5ICsgMjAxIC8gcHJvcF0sXHJcbiAgICAgIFt4ICsgNjYgLyBwcm9wLCB5ICsgMTE1IC8gcHJvcF0sXHJcbiAgICAgIFt4ICsgMTIyIC8gcHJvcCwgeSArIDExNSAvIHByb3BdXHJcbiAgICBdO1xyXG4gICAgdGhpcy50cmFjZShzKTtcclxuICB9XHJcblxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzd2FybVJhbmRvbShzKSB7XHJcbiAgICB0aGlzLnN3YXJtQXJyLmZvckVhY2goY3Vyc29yID0+IHtcclxuICAgICAgY3Vyc29yLmNyaWNsZShzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgU3dhcm17XHJcbiAgY29uc3RydWN0b3Iocyl7XHJcbiAgICB0aGlzLnR5cGUgPSAnY2FudmFzJztcclxuICAgIHRoaXMuc3dhcm1BcnIgPSBbXTtcclxuICAgIHRoaXMuaW5pdChzKTtcclxuICB9XHJcblxyXG4gIGluaXQocyl7XHJcbiAgICBsZXQgdGVtcCxcclxuICAgIHBvc2l0aW9uQ29vciA9IFtdLFxyXG4gICAgc3BlZWRzID0gW10sXHJcbiAgICBhbmdsZXMgPSBbXSxcclxuICAgIHIsXHJcbiAgICBhbW91bnQgPSAzMDAsIFxyXG4gICAgYW1wbGl0dWRlO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcclxuXHJcbiAgICAgIHBvc2l0aW9uQ29vciA9IFswLCAwXTtcclxuICAgICAgc3BlZWRzID0gW1xyXG4gICAgICAgIE1hdGguYWJzKHRoaXMucmFuZG9tKDAsIDAuMiwgdHJ1ZSkgLyA1MCksXHJcbiAgICAgICAgTWF0aC5hYnModGhpcy5yYW5kb20oMCwgMC4yLCB0cnVlKSAvIDUwKVxyXG4gICAgICBdO1xyXG4gICAgICBhbmdsZXMgPSBbMCwgMF07XHJcbiAgICAgIGFtcGxpdHVkZSA9IHRoaXMucmFuZG9tKDIwLCAxMDAwKTtcclxuICAgICAgdGVtcCA9IG5ldyBDdXJzb3IocG9zaXRpb25Db29yLCBzcGVlZHMsIGFuZ2xlcywgYW1wbGl0dWRlLCBzKTtcclxuICAgICAgdGhpcy5zd2FybUFyci5wdXNoKHRlbXApO1xyXG4gICAgfVxyXG4gIH1cclxuICByYW5kb20obWluLCBtYXgsIGRlY2ltYWwgPSBmYWxzZSkge1xyXG4gICAgaWYgKCFkZWNpbWFsKSB7XHJcbiAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWluID0gbWluO1xyXG4gICAgICBtYXggPSBtYXg7XHJcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluO1xyXG4gICAgfVxyXG4gIH1cclxuICBkcmF3KHMpe1xyXG4gICAgcy5wdXNoKCk7XHJcbiAgICBzLmNsZWFyKCk7XHJcbiAgICB0aGlzLnN3YXJtQXJyLmZvckVhY2goKGN1cnNvcik9PntcclxuICAgICAgY3Vyc29yLmNpcmNsZShzKTtcclxuICAgIH0pO1xyXG4gICAgcy5wb3AoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Vyc29yO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFN3YXJtO1xyXG5cclxuIiwiY2xhc3Mgc2F5aGkge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50eXBlID0gXCJkb21cIjtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJwaW5rXCI7XHJcbiAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYXloaTtcclxuIiwiY2xhc3MgQ3Vyc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvcihjdXJzZWRJbWdNYWtlciwgY3Vyc2VBcnIpIHtcclxuICAgIHRoaXMuY3Vyc2VBcnIgPSBjdXJzZUFycjtcclxuICAgIHRoaXMuY2FudmFzQ3Vyc2VzQXJyID0gW107XHJcbiAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcyA9IFtdO1xyXG4gICAgdGhpcy5jdXJzZWRJbWdNYWtlciA9IGN1cnNlZEltZ01ha2VyO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgLypQdXRzIGN1cnNlZCBpbWFnZSBvbmxpbmUgYW5kIGxpc3RlbiBmb3IgdXNlcidzIGNsaWNrKi9cclxuICAgIHRoaXMubGlzdGVuRm9yQ3Vyc2UoKTtcclxuXHJcbiAgICAvKklmIGJhY2tncm91bmQgc2NyaXB0IGlzIGFjdGl2YXRlZCwgdGhlbiBpdCBsaXN0ZW5zIGZvciBiYWNrZ3JvdW5kIG1lc3NhZ2VzKi9cclxuICAgIHRoaXMubGlzdGVuRm9yQmFja2dyb3VuZE1lc3NhZ2VzKCk7XHJcbiAgICBcclxuICAgIC8qQ3JlYXRlcyBhIFA1IGluc3RhbmNlIHNvIGNhbnZhcy1jdXJzZXMgY2FuIHVzZSBpdCAqL1xyXG4gICAgdGhpcy5jYW52YXNTZXRVcCgpO1xyXG5cclxuICAgIC8qRHJhdyBjdXJyZW50IGNhbnZhcyBjdXJzZXMqL1xyXG4gICAgdGhpcy5kcmF3KCk7XHJcbiAgfVxyXG5cclxuICBsaXN0ZW5Gb3JDdXJzZSgpe1xyXG4gICAgLypQdXRzIGN1cnNlZCBpbWFnZSBvbiBzY3JlZW4gc29tZXdoZXJlICovXHJcbiAgICB0aGlzLmFjdGl2YXRlQ3Vyc2VkSW1hZ2UoKTtcclxuICAgIC8qQ3Vyc2VzIHVzZXIgaWYgY3VycmVudCB1cmwgbWF0Y2hlcyB0YXJnZXQgdXJsLiBcclxuICAgICoqKioqKioqKipBY3RpdmF0ZXMgYmFja2dyb3VuZCBzY3JpcHQqKioqKiovXHJcbiAgICB0aGlzLmdldEN1cnNlZEZyb21XZWJzaXRlKCk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZUN1cnNlZEltYWdlKCl7XHJcbiAgICB0aGlzLmN1cnNlZEltZyA9IG5ldyB0aGlzLmN1cnNlZEltZ01ha2VyKGNocm9tZS5ydW50aW1lLmdldFVSTChcIm1lZGlhL2dvcmxleWVzXzEucG5nXCIpLCBcImh0dHBzOi8vZmFiaW9kZW9zaWx2YS5naXRodWIuaW8vd3dvaHcvXCIpO1xyXG4gICAgdGhpcy5jdXJzZWRJbWcuYWN0aXZhdGVDdXJzZWRJbWFnZSgpO1xyXG4gIH1cclxuICBnZXRDdXJzZWRGcm9tV2Vic2l0ZSgpe1xyXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYgPT0gXCJodHRwczovL2ZhYmlvZGVvc2lsdmEuZ2l0aHViLmlvL3d3b2h3L1wiKXtcclxuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2luaXQ6IHRydWV9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdsZXQgdGhlIGN1cnNlIGJlZ2luISEnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0ZW5Gb3JCYWNrZ3JvdW5kTWVzc2FnZXMoKSB7XHJcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHRoaXMucGFyc2VSZXF1ZXN0KHJlcXVlc3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHBhcnNlUmVxdWVzdChyZXF1ZXN0KSB7XHJcbiAgICBsZXQga2V5ID0gT2JqZWN0LmtleXMocmVxdWVzdCk7XHJcbiAgICBpZiAoa2V5WzBdID09IGBjdXJzZWApIHtcclxuICAgICAgdGhpcy5jdXJzZUFyci5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjdXJzZS5uYW1lID09PSByZXF1ZXN0LmN1cnNlLCBjdXJzZS5uYW1lLCByZXF1ZXN0LmN1cnNlKTtcclxuICAgICAgICBpZiAoY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSkge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcImN1cnNlIGFjdGl2YXRlZFwiLCBjdXJzZSk7XHJcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVDdXJzZShjdXJzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoa2V5WzBdID09IGBtZXNzYWdlYCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0Lm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuICBleGVjdXRlQ3Vyc2UoY3Vyc2UpIHtcclxuICAgIGxldCB0ZW1wID0gbmV3IGN1cnNlKHRoaXMubXlwNSk7XHJcbiAgICBpZiAodGVtcC50eXBlID09PSBcImNhbnZhc1wiKSB7XHJcbiAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzID0gW107XHJcbiAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzLnB1c2godGVtcCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRlbXApO1xyXG4gICAgfSBlbHNlIGlmICh0ZW1wLnR5cGUgPT09IFwiZG9tXCIpIHtcclxuICAgICAgdGVtcC5pbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjYW52YXNTZXRVcCgpIHtcclxuICAgIGxldCBwNUNhbnZhcyA9IHMgPT4ge1xyXG4gICAgICBzLnNldHVwID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gcy5jcmVhdGVDYW52YXMocy53aW5kb3dXaWR0aCwgcy53aW5kb3dIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnBvc2l0aW9uKDAsIDApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwiei1pbmRleFwiLCA5OTkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwicG9zaXRpb25cIiwgXCJmaXhlZFwiKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgICB0aGlzLm15cDUgPSBuZXcgcDUocDVDYW52YXMpO1xyXG4gIH1cclxuICBkcmF3KCkge1xyXG4gICAgbGV0IHMgPSB0aGlzLm15cDU7XHJcbiAgICBzLmRyYXcgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAgIGN1cnNlLmRyYXcocyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Vyc2VIYW5kbGVyO1xyXG4iXX0=
