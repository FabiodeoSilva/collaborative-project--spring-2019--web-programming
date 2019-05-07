(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const BlackBG = require("./curses/BlackBG.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");
const CursedImg = require("./curses/cursed-image");
const Zalgo = require("./curses/zalgo");

let curseHandler = new CurseHandler(CursedImg, [BlackBG, Zalgo, Blood, Swarm]);
curseHandler.init();
curseHandler.persistentCurses();

},{"./curses/BlackBG.js":2,"./curses/bloodyScreen":3,"./curses/cursed-image":4,"./curses/cursorSwarm":5,"./curses/zalgo":6,"./model/CurseHandler.js":7}],2:[function(require,module,exports){
class BlackBG {
  constructor() {
    this.type = "dom";
  }

  init() {
    let body = document.querySelector("body");
    let a = document.querySelectorAll("a");
    body.style.background = "black";
   a.forEach((link)=>{
    link.style.color = "red";
   })
  }
}

module.exports = BlackBG;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
class Zalgo{
    constructor(){
        this.type = "dom";

    }
    init(){
        this.zalgofy("a");
    }
    zalgofy(querySelectorTarget){
        let elems = document.querySelectorAll(querySelectorTarget);
        let elemArr;
        elems.forEach((elem)=>{
            let elemArr = elem.innerHTML.split(" ");
            
            let weirdWord = "";
    
            elemArr.forEach(word => {
              weirdWord += this.zalgoText(word);
            });
        
            elem.innerHTML = weirdWord;
        })
    
    };

    zalgoText(word){
        let retWord = [],
          weirdChar;
    
        [...word].forEach(char => {
          let r = this.random(0, 30),
            weirdChar = "";
    
          for (let i = 0; i <= r; i++) {
            weirdChar += `&#${this.random(768, 879)};`;
          }
    
          char += weirdChar;
          retWord.push(char);
        });
    
        return retWord.join("");
      };

    getRndBias(min, max, bias, influence){
        let rnd = Math.random() * (max - min) + min, // random in range
          mix = Math.random() * influence; // random mixer
        return rnd * (1 - mix) + bias * mix; // mix full range and bias
    };

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
    
module.exports = Zalgo;
},{}],7:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvQmxhY2tCRy5qcyIsImRldi9jdXJzZXMvYmxvb2R5U2NyZWVuLmpzIiwiZGV2L2N1cnNlcy9jdXJzZWQtaW1hZ2UuanMiLCJkZXYvY3Vyc2VzL2N1cnNvclN3YXJtLmpzIiwiZGV2L2N1cnNlcy96YWxnby5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgQ3Vyc2VIYW5kbGVyID0gcmVxdWlyZShcIi4vbW9kZWwvQ3Vyc2VIYW5kbGVyLmpzXCIpO1xyXG5jb25zdCBCbGFja0JHID0gcmVxdWlyZShcIi4vY3Vyc2VzL0JsYWNrQkcuanNcIik7XHJcbmNvbnN0IEJsb29kID0gcmVxdWlyZShcIi4vY3Vyc2VzL2Jsb29keVNjcmVlblwiKTtcclxuY29uc3QgU3dhcm0gPSByZXF1aXJlKFwiLi9jdXJzZXMvY3Vyc29yU3dhcm1cIik7XHJcbmNvbnN0IEN1cnNlZEltZyA9IHJlcXVpcmUoXCIuL2N1cnNlcy9jdXJzZWQtaW1hZ2VcIik7XHJcbmNvbnN0IFphbGdvID0gcmVxdWlyZShcIi4vY3Vyc2VzL3phbGdvXCIpO1xyXG5cclxubGV0IGN1cnNlSGFuZGxlciA9IG5ldyBDdXJzZUhhbmRsZXIoQ3Vyc2VkSW1nLCBbQmxhY2tCRywgWmFsZ28sIEJsb29kLCBTd2FybV0pO1xyXG5jdXJzZUhhbmRsZXIuaW5pdCgpO1xyXG5jdXJzZUhhbmRsZXIucGVyc2lzdGVudEN1cnNlcygpO1xyXG4iLCJjbGFzcyBCbGFja0JHIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudHlwZSA9IFwiZG9tXCI7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgIGxldCBhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFcIik7XHJcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcImJsYWNrXCI7XHJcbiAgIGEuZm9yRWFjaCgobGluayk9PntcclxuICAgIGxpbmsuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gICB9KVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbGFja0JHO1xyXG4iLCJjbGFzcyBCbG9vZCB7XHJcbiAgY29uc3RydWN0b3Iocykge1xyXG4gICAgdGhpcy50eXBlID0gXCJjYW52YXNcIjtcclxuICAgIHRoaXMuYmxvb2RBcnIgPSBbXTtcclxuICAgIHRoaXMuc2V0dXAocyk7XHJcbiAgfVxyXG4gIHNldHVwKHMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHMud2lkdGg7IGkrKykge1xyXG4gICAgICB0aGlzLmJsb29kQXJyLnB1c2goe1xyXG4gICAgICAgIHhQb3M6IGksXHJcbiAgICAgICAgeVBvczogMCxcclxuICAgICAgICByZWQ6IE1hdGguZmxvb3IodGhpcy5yYW5kb20oMTU1LCAyNTUpKSxcclxuICAgICAgICBTcGVlZFJhdGU6IDEgLyB0aGlzLmdldFJuZEJpYXMoMSwgMTAsIDUsIDEpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHJhdyhzKSB7XHJcbiAgICBzLnB1c2goKTtcclxuICAgIHRoaXMuYmxvb2RBcnIuZm9yRWFjaChkcm9wID0+IHtcclxuICAgICAgcy5zdHJva2Uocy5jb2xvcihkcm9wLnJlZCwgMCwgMCkpO1xyXG4gICAgICBzLnBvaW50KGRyb3AueFBvcywgZHJvcC55UG9zKTtcclxuICAgICAgaWYgKGRyb3AueVBvcyA8PSBzLmhlaWdodCkgZHJvcC55UG9zICs9IGRyb3AuU3BlZWRSYXRlO1xyXG4gICAgfSk7XHJcbiAgICBzLnBvcCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Um5kQmlhcyhtaW4sIG1heCwgYmlhcywgaW5mbHVlbmNlKSB7XHJcbiAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluLCAvLyByYW5kb20gaW4gcmFuZ2VcclxuICAgICAgbWl4ID0gTWF0aC5yYW5kb20oKSAqIGluZmx1ZW5jZTsgLy8gcmFuZG9tIG1peGVyXHJcbiAgICByZXR1cm4gcm5kICogKDEgLSBtaXgpICsgYmlhcyAqIG1peDsgLy8gbWl4IGZ1bGwgcmFuZ2UgYW5kIGJpYXNcclxuICB9XHJcblxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgYmxvb2RTY3JlZW5SYW5kb20gPSAocywgYmVhdCkgPT4ge1xyXG4gIHMuc3Ryb2tlKHMuY29sb3IocmFuZG9tKDEwMCwgMjU1KSwgMCwgMCkpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IHMud2lkdGg7IGkrKykge1xyXG4gICAgaWYgKGJlYXQgPD0gcy5oZWlnaHQpIHlQb3MgPSByYW5kb20oMCwgYmVhdCk7XHJcbiAgICBlbHNlIHlQb3MgPSByYW5kb20oMCwgcy5oZWlnaHQpO1xyXG4gICAgcy5wb2ludChpLCB5UG9zKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb29kO1xyXG4iLCJjbGFzcyBDdXJzZWRJbWd7XHJcbiAgY29uc3RydWN0b3IoaW1nVXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwibWVkaWEvZ29ybGV5ZXNfMS5wbmdcIiksIGRlc3RpbmF0aW9uVVJMKXtcclxuICAgIHRoaXMudHlwZSA9ICdkb20nO1xyXG4gICAgdGhpcy5pbWdVcmwgPSBpbWdVcmw7XHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uVVJMID0gZGVzdGluYXRpb25VUkw7XHJcbiAgfVxyXG4gIGFjdGl2YXRlQ3Vyc2VkSW1hZ2UoKSB7XHJcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgbGV0IGltZ3NBcnIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gICAgbGV0IGJpZ0ltZ3MgPSBbXTtcclxuICAgIGltZ3NBcnIuZm9yRWFjaChpbWcgPT4ge1xyXG4gICAgICBpZiAoaW1nLndpZHRoID4gNTAgJiYgaW1nLmhlaWdodCA+IDUwKSBiaWdJbWdzLnB1c2goaW1nKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgbGV0IGV5ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgZXllcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgIGV5ZXMuc3JjID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwibWVkaWEvZ29ybGV5ZXNfMi5wbmdcIik7XHJcbiAgXHJcbiAgICBpZiAoYmlnSW1ncy5sZW5ndGggPiAzKSB7XHJcbiAgICAgIGxldCBjdXJzZWRJbWcgPSBiaWdJbWdzW3RoaXMucmFuZG9tKDIsIGJpZ0ltZ3MubGVuZ3RoIC0gMSldO1xyXG4gICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBjdXJzZWRJbWcsXHJcbiAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoY3Vyc2VkSW1nLnBhcmVudE5vZGUpLndpZHRoLFxyXG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGN1cnNlZEltZy5wYXJlbnROb2RlKS5oZWlnaHRcclxuICAgICAgKTtcclxuICAgICAgbGV0IGZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgZnJhbWUuc3R5bGUud2lkdGggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjdXJzZWRJbWcucGFyZW50Tm9kZSkud2lkdGg7XHJcbiAgICAgIGZyYW1lLnN0eWxlLmhlaWdodCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGN1cnNlZEltZy5wYXJlbnROb2RlKS5oZWlnaHQ7XHJcbiAgICAgIGZyYW1lLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICBmcmFtZS5zdHlsZS50b3AgPSBcIjBweFwiO1xyXG4gICAgICBmcmFtZS5zdHlsZS56SW5kZXggPSBcIjJcIjtcclxuICAgICAgZnJhbWUuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gXCJ0b3AgY2VudGVyXCI7XHJcbiAgICAgIGZyYW1lLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJyR7dGhpcy5pbWdVcmx9JylgO1xyXG4gICAgICBmcmFtZS5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcclxuICAgICAgZnJhbWUuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvbnRhaW5cIjtcclxuICAgICAgY3Vyc2VkSW1nLnBhcmVudE5vZGUuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgIGN1cnNlZEltZy5wYXJlbnROb2RlLmFwcGVuZChmcmFtZSk7XHJcbiAgICAgIGV5ZXMuc3R5bGUud2lkdGggPSBgY2FsYygke2ZyYW1lLnN0eWxlLndpZHRofS8yLjIpYDtcclxuICAgICAgZXllcy5zdHlsZS50b3AgPSBgY2FsYygke2ZyYW1lLnN0eWxlLmhlaWdodH0vNC41KWA7XHJcbiAgICAgIGV5ZXMuc3R5bGUubGVmdCA9IGBjYWxjKCR7ZnJhbWUuc3R5bGUud2lkdGh9LzMuNSlgO1xyXG4gICAgICBjdXJzZWRJbWcucGFyZW50Tm9kZS5hcHBlbmQoZXllcyk7XHJcbiAgICAgIGlmIChjdXJzZWRJbWcuc3Jjc2V0KSBjdXJzZWRJbWcucmVtb3ZlQXR0cmlidXRlKFwic3Jjc2V0XCIpO1xyXG4gICAgICBpZiAoY3Vyc2VkSW1nLnBhcmVudEVsZW1lbnQudGFnTmFtZSA9PT0gXCJBXCIpIHtcclxuICAgICAgICBjdXJzZWRJbWcucGFyZW50RWxlbWVudC5ocmVmID10aGlzLiBkZXN0aW5hdGlvblVSTDtcclxuICAgICAgfVxyXG4gICAgICBjdXJzZWRJbWcucGFyZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID10aGlzLiBkZXN0aW5hdGlvblVSTDtcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlID0+IHtcclxuICAgICAgICBleWVzLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtlLmNsaWVudFggL1xyXG4gICAgICAgICAgKHdpbmRvdy5pbm5lcldpZHRoIC8gNSl9cHgsICR7ZS5jbGllbnRZIC8gKHdpbmRvdy5pbm5lckhlaWdodCAvIDUpfXB4KWA7XHJcbiAgICAgICAgY29uc29sZS5sb2coZS5jbGllbnRYIC8gKHdpbmRvdy5pbm5lcldpZHRoIC8gNSkpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIHJhbmRvbShtaW4sIG1heCkge1xyXG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKmFjdGl2YXRlQ3Vyc2VkSW1hZ2UoXHJcbiAgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwidW5jb21wcmVzc2VkLWltYWdlcy9nb3JsZXllc18xLnBuZ1wiKSxcclxuICBcImh0dHBzOi8vZ2l0aHViLmNvbS9cIlxyXG4pOyovXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdXJzZWRJbWc7XHJcbiIsImNsYXNzIEN1cnNvciB7XHJcbiAgY29uc3RydWN0b3IocG9zaXRpb25Db29yLCBzcGVlZHMsIGFuZ2xlcywgYW1wbGl0dWRlLCBzKSB7XHJcbiAgICB0aGlzLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcclxuICAgIHRoaXMuYW5nbGVYID0gYW5nbGVzWzBdO1xyXG4gICAgdGhpcy5hbmdsZVkgPSBhbmdsZXNbMV07XHJcbiAgICB0aGlzLnNwZWVkWCA9IHNwZWVkc1swXTtcclxuICAgIHRoaXMuc3BlZWRZID0gc3BlZWRzWzFdO1xyXG5cclxuICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvclN0cm9rZSA9IFwid2hpdGVcIjtcclxuICAgICAgICAgIHRoaXMuY3Vyc29yQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JTdHJva2UgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvckNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGUocG9zaXRpb25Db29yWzBdLCBwb3NpdGlvbkNvb3JbMV0sIHMpO1xyXG4gIH1cclxuXHJcbiAgdHJhY2Uocykge1xyXG4gICAgcy5maWxsKHRoaXMuY3Vyc29yQ29sb3IpO1xyXG4gICAgcy5zdHJva2UodGhpcy5jdXJzb3JTdHJva2UpO1xyXG4gICAgcy5iZWdpblNoYXBlKCk7XHJcbiAgICB0aGlzLnZlcnRpY2VzLmZvckVhY2goY29vciA9PiB7XHJcbiAgICAgICAgICBzLnZlcnRleChjb29yWzBdLCBjb29yWzFdKTtcclxuICAgIH0pO1xyXG4gICAgcy5lbmRTaGFwZShzLkNMT1NFKTtcclxuICB9XHJcblxyXG4gIGNpcmNsZShzKSB7XHJcbiAgICBsZXQgcHggPSBzLnNpbih0aGlzLmFuZ2xlWCkgKiB0aGlzLmFtcGxpdHVkZSArIHMud2luZG93V2lkdGggLyAyO1xyXG4gICAgbGV0IHB5ID0gcy5jb3ModGhpcy5hbmdsZVkpICogdGhpcy5hbXBsaXR1ZGUgKyBzLndpbmRvd0hlaWdodCAvIDI7XHJcbiAgICB0aGlzLnVwZGF0ZShweCwgcHksIHMpO1xyXG4gICAgdGhpcy5hbmdsZVggKz0gdGhpcy5zcGVlZFg7XHJcbiAgICB0aGlzLmFuZ2xlWSArPSB0aGlzLnNwZWVkWTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSh4LCB5LCBzKSB7XHJcbiAgICBsZXQgcHJvcCA9IDEzO1xyXG4gICAgdGhpcy52ZXJ0aWNlcyA9IFtcclxuICAgICAgW3gsIHldLFxyXG4gICAgICBbeCwgeSArIDE2NyAvIHByb3BdLFxyXG4gICAgICBbeCArIDM5IC8gcHJvcCwgeSArIDEyOSAvIHByb3BdLFxyXG4gICAgICBbeCArIDc1IC8gcHJvcCwgeSArIDIxNCAvIHByb3BdLFxyXG4gICAgICBbeCArIDEwMCAvIHByb3AsIHkgKyAyMDEgLyBwcm9wXSxcclxuICAgICAgW3ggKyA2NiAvIHByb3AsIHkgKyAxMTUgLyBwcm9wXSxcclxuICAgICAgW3ggKyAxMjIgLyBwcm9wLCB5ICsgMTE1IC8gcHJvcF1cclxuICAgIF07XHJcbiAgICB0aGlzLnRyYWNlKHMpO1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tKG1pbiwgbWF4LCBkZWNpbWFsID0gZmFsc2UpIHtcclxuICAgIGlmICghZGVjaW1hbCkge1xyXG4gICAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1pbiA9IG1pbjtcclxuICAgICAgbWF4ID0gbWF4O1xyXG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN3YXJtUmFuZG9tKHMpIHtcclxuICAgIHRoaXMuc3dhcm1BcnIuZm9yRWFjaChjdXJzb3IgPT4ge1xyXG4gICAgICBjdXJzb3IuY3JpY2xlKHMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBTd2FybXtcclxuICBjb25zdHJ1Y3RvcihzKXtcclxuICAgIHRoaXMudHlwZSA9ICdjYW52YXMnO1xyXG4gICAgdGhpcy5zd2FybUFyciA9IFtdO1xyXG4gICAgdGhpcy5pbml0KHMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdChzKXtcclxuICAgIGxldCB0ZW1wLFxyXG4gICAgcG9zaXRpb25Db29yID0gW10sXHJcbiAgICBzcGVlZHMgPSBbXSxcclxuICAgIGFuZ2xlcyA9IFtdLFxyXG4gICAgcixcclxuICAgIGFtb3VudCA9IDMwMCwgXHJcbiAgICBhbXBsaXR1ZGU7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKykge1xyXG5cclxuICAgICAgcG9zaXRpb25Db29yID0gWzAsIDBdO1xyXG4gICAgICBzcGVlZHMgPSBbXHJcbiAgICAgICAgTWF0aC5hYnModGhpcy5yYW5kb20oMCwgMC4yLCB0cnVlKSAvIDUwKSxcclxuICAgICAgICBNYXRoLmFicyh0aGlzLnJhbmRvbSgwLCAwLjIsIHRydWUpIC8gNTApXHJcbiAgICAgIF07XHJcbiAgICAgIGFuZ2xlcyA9IFswLCAwXTtcclxuICAgICAgYW1wbGl0dWRlID0gdGhpcy5yYW5kb20oMjAsIDEwMDApO1xyXG4gICAgICB0ZW1wID0gbmV3IEN1cnNvcihwb3NpdGlvbkNvb3IsIHNwZWVkcywgYW5nbGVzLCBhbXBsaXR1ZGUsIHMpO1xyXG4gICAgICB0aGlzLnN3YXJtQXJyLnB1c2godGVtcCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRyYXcocyl7XHJcbiAgICBzLnB1c2goKTtcclxuICAgIHMuY2xlYXIoKTtcclxuICAgIHRoaXMuc3dhcm1BcnIuZm9yRWFjaCgoY3Vyc29yKT0+e1xyXG4gICAgICBjdXJzb3IuY2lyY2xlKHMpO1xyXG4gICAgfSk7XHJcbiAgICBzLnBvcCgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdXJzb3I7XHJcbm1vZHVsZS5leHBvcnRzID0gU3dhcm07XHJcblxyXG4iLCJjbGFzcyBaYWxnb3tcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJkb21cIjtcclxuXHJcbiAgICB9XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy56YWxnb2Z5KFwiYVwiKTtcclxuICAgIH1cclxuICAgIHphbGdvZnkocXVlcnlTZWxlY3RvclRhcmdldCl7XHJcbiAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeVNlbGVjdG9yVGFyZ2V0KTtcclxuICAgICAgICBsZXQgZWxlbUFycjtcclxuICAgICAgICBlbGVtcy5mb3JFYWNoKChlbGVtKT0+e1xyXG4gICAgICAgICAgICBsZXQgZWxlbUFyciA9IGVsZW0uaW5uZXJIVE1MLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB3ZWlyZFdvcmQgPSBcIlwiO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGVsZW1BcnIuZm9yRWFjaCh3b3JkID0+IHtcclxuICAgICAgICAgICAgICB3ZWlyZFdvcmQgKz0gdGhpcy56YWxnb1RleHQod29yZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHdlaXJkV29yZDtcclxuICAgICAgICB9KVxyXG4gICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHphbGdvVGV4dCh3b3JkKXtcclxuICAgICAgICBsZXQgcmV0V29yZCA9IFtdLFxyXG4gICAgICAgICAgd2VpcmRDaGFyO1xyXG4gICAgXHJcbiAgICAgICAgWy4uLndvcmRdLmZvckVhY2goY2hhciA9PiB7XHJcbiAgICAgICAgICBsZXQgciA9IHRoaXMucmFuZG9tKDAsIDMwKSxcclxuICAgICAgICAgICAgd2VpcmRDaGFyID0gXCJcIjtcclxuICAgIFxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHdlaXJkQ2hhciArPSBgJiMke3RoaXMucmFuZG9tKDc2OCwgODc5KX07YDtcclxuICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgY2hhciArPSB3ZWlyZENoYXI7XHJcbiAgICAgICAgICByZXRXb3JkLnB1c2goY2hhcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gcmV0V29yZC5qb2luKFwiXCIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIGdldFJuZEJpYXMobWluLCBtYXgsIGJpYXMsIGluZmx1ZW5jZSl7XHJcbiAgICAgICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbiwgLy8gcmFuZG9tIGluIHJhbmdlXHJcbiAgICAgICAgICBtaXggPSBNYXRoLnJhbmRvbSgpICogaW5mbHVlbmNlOyAvLyByYW5kb20gbWl4ZXJcclxuICAgICAgICByZXR1cm4gcm5kICogKDEgLSBtaXgpICsgYmlhcyAqIG1peDsgLy8gbWl4IGZ1bGwgcmFuZ2UgYW5kIGJpYXNcclxuICAgIH07XHJcblxyXG4gICAgcmFuZG9tKG1pbiwgbWF4LCBkZWNpbWFsID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgICAgICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1pbiA9IG1pbjtcclxuICAgICAgICAgIG1heCA9IG1heDtcclxuICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4gICAgXHJcbm1vZHVsZS5leHBvcnRzID0gWmFsZ287IiwiY2xhc3MgQ3Vyc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvcihjdXJzZWRJbWdNYWtlciwgY3Vyc2VBcnIpIHtcclxuICAgIHRoaXMuY3Vyc2VBcnIgPSBjdXJzZUFycjtcclxuICAgIHRoaXMuY2FudmFzQ3Vyc2VzQXJyID0gW107XHJcbiAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcyA9IFtdO1xyXG4gICAgdGhpcy5jdXJzZWRJbWdNYWtlciA9IGN1cnNlZEltZ01ha2VyO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgLypQdXRzIGN1cnNlZCBpbWFnZSBvbmxpbmUgYW5kIGxpc3RlbiBmb3IgdXNlcidzIGNsaWNrKi9cclxuICAgIHRoaXMubGlzdGVuRm9yQ3Vyc2UoKTtcclxuXHJcbiAgICAvKklmIGJhY2tncm91bmQgc2NyaXB0IGlzIGFjdGl2YXRlZCwgdGhlbiBpdCBsaXN0ZW5zIGZvciBiYWNrZ3JvdW5kIG1lc3NhZ2VzKi9cclxuICAgIHRoaXMubGlzdGVuRm9yQmFja2dyb3VuZE1lc3NhZ2VzKCk7XHJcbiAgICBcclxuICAgIC8qQ3JlYXRlcyBhIFA1IGluc3RhbmNlIHNvIGNhbnZhcy1jdXJzZXMgY2FuIHVzZSBpdCAqL1xyXG4gICAgdGhpcy5jYW52YXNTZXRVcCgpO1xyXG5cclxuICAgIC8qRHJhdyBjdXJyZW50IGNhbnZhcyBjdXJzZXMqL1xyXG4gICAgdGhpcy5kcmF3KCk7XHJcbiAgfVxyXG5cclxuICBsaXN0ZW5Gb3JDdXJzZSgpe1xyXG4gICAgLypQdXRzIGN1cnNlZCBpbWFnZSBvbiBzY3JlZW4gc29tZXdoZXJlICovXHJcbiAgICB0aGlzLmFjdGl2YXRlQ3Vyc2VkSW1hZ2UoKTtcclxuICAgIC8qQ3Vyc2VzIHVzZXIgaWYgY3VycmVudCB1cmwgbWF0Y2hlcyB0YXJnZXQgdXJsLiBcclxuICAgICoqKioqKioqKipBY3RpdmF0ZXMgYmFja2dyb3VuZCBzY3JpcHQqKioqKiovXHJcbiAgICB0aGlzLmdldEN1cnNlZEZyb21XZWJzaXRlKCk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZUN1cnNlZEltYWdlKCl7XHJcbiAgICB0aGlzLmN1cnNlZEltZyA9IG5ldyB0aGlzLmN1cnNlZEltZ01ha2VyKGNocm9tZS5ydW50aW1lLmdldFVSTChcIm1lZGlhL2dvcmxleWVzXzEucG5nXCIpLCBcImh0dHBzOi8vZmFiaW9kZW9zaWx2YS5naXRodWIuaW8vd3dvaHcvXCIpO1xyXG4gICAgdGhpcy5jdXJzZWRJbWcuYWN0aXZhdGVDdXJzZWRJbWFnZSgpO1xyXG4gIH1cclxuICBnZXRDdXJzZWRGcm9tV2Vic2l0ZSgpe1xyXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYgPT0gXCJodHRwczovL2ZhYmlvZGVvc2lsdmEuZ2l0aHViLmlvL3d3b2h3L1wiKXtcclxuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2luaXQ6IHRydWV9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdsZXQgdGhlIGN1cnNlIGJlZ2luISEnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiaHR0cHM6Ly9nb29nbGUuY29tL1wiO1xyXG4gICAgICB9LCAxMDAwMClcclxuICAgIH1cclxuICB9XHJcbiAgc3RvcmVDdXJzZShzdG9yZWRDdXJzZSl7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7Y3Vyc2VzOiBzdG9yZWRDdXJzZX0sICgpPT57XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcIndhcyBzZXQgaW4gc3RvcmFnZVwiKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwYXJzZVJlcXVlc3QocmVxdWVzdCkge1xyXG4gICAgbGV0IHJlcXVlc3RrZXkgPSBPYmplY3Qua2V5cyhyZXF1ZXN0KTtcclxuICAgIGlmIChyZXF1ZXN0a2V5WzBdID09IGBjdXJzZWApIHtcclxuICAgICAgdGhpcy5jdXJzZUFyci5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjdXJzZS5uYW1lID09PSByZXF1ZXN0LmN1cnNlLCBjdXJzZS5uYW1lLCByZXF1ZXN0LmN1cnNlKTtcclxuICAgICAgICBpZiAoY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJjdXJzZSBhY3RpdmF0ZWRcIiwgY3Vyc2UpO1xyXG4gICAgICAgICAgdGhpcy5leGVjdXRlQ3Vyc2UoY3Vyc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3RrZXlbMF0gPT0gYG1lc3NhZ2VgKSB7XHJcbiAgICAgIGlmKHJlcXVlc3QubWVzc2FnZSA9PSBcImRlYWRcIil7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hlcmUnKTtcclxuICAgICAgICB0aGlzLmtpbGxBcHAoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGVyc2lzdGVudEN1cnNlcygpe1xyXG4gICAgbGV0IHQ9IHRoaXM7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbXCJjdXJzZXNcIl0sIGZ1bmN0aW9uKGFsbEN1cnNlcykge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnBhcnNlUmVxdWVzdCk7XHJcbiAgICAgIHQucGFyc2VSZXF1ZXN0KE9iamVjdC52YWx1ZXMoYWxsQ3Vyc2VzKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxpc3RlbkZvckJhY2tncm91bmRNZXNzYWdlcygpIHtcclxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcclxuICAgICAgdGhpcy5wYXJzZVJlcXVlc3QocmVxdWVzdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGV4ZWN1dGVDdXJzZShjdXJzZSkge1xyXG4gICAgbGV0IHRlbXAgPSBuZXcgY3Vyc2UodGhpcy5teXA1KTtcclxuICAgIGlmICh0ZW1wLnR5cGUgPT09IFwiY2FudmFzXCIpIHtcclxuICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMucHVzaCh0ZW1wKTtcclxuICAgICAgY29uc29sZS5sb2codGVtcCk7XHJcbiAgICB9IGVsc2UgaWYgKHRlbXAudHlwZSA9PT0gXCJkb21cIikge1xyXG4gICAgICB0ZW1wLmluaXQoKTtcclxuICAgICAgdGhpcy5zdG9yZUN1cnNlKGN1cnNlLm5hbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICBjYW52YXNTZXRVcCgpIHtcclxuICAgIGxldCBwNUNhbnZhcyA9IHMgPT4ge1xyXG4gICAgICBzLnNldHVwID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gcy5jcmVhdGVDYW52YXMocy53aW5kb3dXaWR0aCwgcy53aW5kb3dIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnBvc2l0aW9uKDAsIDApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuY2FudmFzLnN0eWxlLnpJbmRleCA9IDk5OTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5jYW52YXMuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XHJcbiAgICAgICBcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgICB0aGlzLm15cDUgPSBuZXcgcDUocDVDYW52YXMpO1xyXG4gIH1cclxuICBkcmF3KCkge1xyXG4gICAgbGV0IHMgPSB0aGlzLm15cDU7XHJcbiAgICBzLmRyYXcgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAgIGN1cnNlLmRyYXcocyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgXHJcbiAgfVxyXG4gIGtpbGxBcHAoKXtcclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKFwiY3Vyc2VzXCIsICgpPT57XHJcbiAgICAgIGNvbnNvbGUubG9nKCdzdG9yYWdlIGNsZWFuZWQnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNlSGFuZGxlcjtcclxuIl19
