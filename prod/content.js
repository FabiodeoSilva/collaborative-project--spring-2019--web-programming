(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");

let curseHandler = new CurseHandler([Swarm, sayhi, Blood]);
curseHandler.init();

},{"./curses/bloodyScreen":2,"./curses/cursorSwarm":3,"./curses/test.js":4,"./model/CurseHandler.js":5}],2:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
class CurseHandler {
  constructor(curseArr) {
    this.curseArr = curseArr;
    this.canvasCursesArr = [];
    this.canvasCursesInstances = [];
  }
  init() {
    //this.sortCanvasCurses();
    this.canvasSetUp();
    this.listenForActivation();
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

  sortCanvasCurses() {
    this.curseArr.forEach(curse => {
      if (curse.type === "canvas") {
        this.canvasCursesArr.push(curse);
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvYmxvb2R5U2NyZWVuLmpzIiwiZGV2L2N1cnNlcy9jdXJzb3JTd2FybS5qcyIsImRldi9jdXJzZXMvdGVzdC5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDdXJzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9DdXJzZUhhbmRsZXIuanNcIik7XHJcbmNvbnN0IHNheWhpID0gcmVxdWlyZShcIi4vY3Vyc2VzL3Rlc3QuanNcIik7XHJcbmNvbnN0IEJsb29kID0gcmVxdWlyZShcIi4vY3Vyc2VzL2Jsb29keVNjcmVlblwiKTtcclxuY29uc3QgU3dhcm0gPSByZXF1aXJlKFwiLi9jdXJzZXMvY3Vyc29yU3dhcm1cIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihbU3dhcm0sIHNheWhpLCBCbG9vZF0pO1xyXG5jdXJzZUhhbmRsZXIuaW5pdCgpO1xyXG4iLCJjbGFzcyBCbG9vZCB7XHJcbiAgY29uc3RydWN0b3Iocykge1xyXG4gICAgdGhpcy50eXBlID0gXCJjYW52YXNcIjtcclxuICAgIHRoaXMuYmxvb2RBcnIgPSBbXTtcclxuICAgIHRoaXMuc2V0dXAocyk7XHJcbiAgfVxyXG4gIHNldHVwKHMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHMud2lkdGg7IGkrKykge1xyXG4gICAgICB0aGlzLmJsb29kQXJyLnB1c2goe1xyXG4gICAgICAgIHhQb3M6IGksXHJcbiAgICAgICAgeVBvczogMCxcclxuICAgICAgICByZWQ6IE1hdGguZmxvb3IodGhpcy5yYW5kb20oMTU1LCAyNTUpKSxcclxuICAgICAgICBTcGVlZFJhdGU6IDEgLyB0aGlzLmdldFJuZEJpYXMoMSwgMTAsIDUsIDEpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHJhdyhzKSB7XHJcbiAgICBzLnB1c2goKTtcclxuICAgIHRoaXMuYmxvb2RBcnIuZm9yRWFjaChkcm9wID0+IHtcclxuICAgICAgcy5zdHJva2Uocy5jb2xvcihkcm9wLnJlZCwgMCwgMCkpO1xyXG4gICAgICBzLnBvaW50KGRyb3AueFBvcywgZHJvcC55UG9zKTtcclxuICAgICAgaWYgKGRyb3AueVBvcyA8PSBzLmhlaWdodCkgZHJvcC55UG9zICs9IGRyb3AuU3BlZWRSYXRlO1xyXG4gICAgfSk7XHJcbiAgICBzLnBvcCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Um5kQmlhcyhtaW4sIG1heCwgYmlhcywgaW5mbHVlbmNlKSB7XHJcbiAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluLCAvLyByYW5kb20gaW4gcmFuZ2VcclxuICAgICAgbWl4ID0gTWF0aC5yYW5kb20oKSAqIGluZmx1ZW5jZTsgLy8gcmFuZG9tIG1peGVyXHJcbiAgICByZXR1cm4gcm5kICogKDEgLSBtaXgpICsgYmlhcyAqIG1peDsgLy8gbWl4IGZ1bGwgcmFuZ2UgYW5kIGJpYXNcclxuICB9XHJcblxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgYmxvb2RTY3JlZW5SYW5kb20gPSAocywgYmVhdCkgPT4ge1xyXG4gIHMuc3Ryb2tlKHMuY29sb3IocmFuZG9tKDEwMCwgMjU1KSwgMCwgMCkpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IHMud2lkdGg7IGkrKykge1xyXG4gICAgaWYgKGJlYXQgPD0gcy5oZWlnaHQpIHlQb3MgPSByYW5kb20oMCwgYmVhdCk7XHJcbiAgICBlbHNlIHlQb3MgPSByYW5kb20oMCwgcy5oZWlnaHQpO1xyXG4gICAgcy5wb2ludChpLCB5UG9zKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb29kO1xyXG4iLCJjbGFzcyBDdXJzb3Ige1xyXG4gIGNvbnN0cnVjdG9yKHBvc2l0aW9uQ29vciwgc3BlZWRzLCBhbmdsZXMsIGFtcGxpdHVkZSwgcykge1xyXG4gICAgdGhpcy5hbXBsaXR1ZGUgPSBhbXBsaXR1ZGU7XHJcbiAgICB0aGlzLmFuZ2xlWCA9IGFuZ2xlc1swXTtcclxuICAgIHRoaXMuYW5nbGVZID0gYW5nbGVzWzFdO1xyXG4gICAgdGhpcy5zcGVlZFggPSBzcGVlZHNbMF07XHJcbiAgICB0aGlzLnNwZWVkWSA9IHNwZWVkc1sxXTtcclxuXHJcbiAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JTdHJva2UgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvckNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY3Vyc29yU3Ryb2tlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JDb2xvciA9IFwid2hpdGVcIjtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlKHBvc2l0aW9uQ29vclswXSwgcG9zaXRpb25Db29yWzFdLCBzKTtcclxuICB9XHJcblxyXG4gIHRyYWNlKHMpIHtcclxuICAgIHMuZmlsbCh0aGlzLmN1cnNvckNvbG9yKTtcclxuICAgIHMuc3Ryb2tlKHRoaXMuY3Vyc29yU3Ryb2tlKTtcclxuICAgIHMuYmVnaW5TaGFwZSgpO1xyXG4gICAgdGhpcy52ZXJ0aWNlcy5mb3JFYWNoKGNvb3IgPT4ge1xyXG4gICAgICAgICAgcy52ZXJ0ZXgoY29vclswXSwgY29vclsxXSk7XHJcbiAgICB9KTtcclxuICAgIHMuZW5kU2hhcGUocy5DTE9TRSk7XHJcbiAgfVxyXG5cclxuICBjaXJjbGUocykge1xyXG4gICAgbGV0IHB4ID0gcy5zaW4odGhpcy5hbmdsZVgpICogdGhpcy5hbXBsaXR1ZGUgKyBzLndpbmRvd1dpZHRoIC8gMjtcclxuICAgIGxldCBweSA9IHMuY29zKHRoaXMuYW5nbGVZKSAqIHRoaXMuYW1wbGl0dWRlICsgcy53aW5kb3dIZWlnaHQgLyAyO1xyXG4gICAgdGhpcy51cGRhdGUocHgsIHB5LCBzKTtcclxuICAgIHRoaXMuYW5nbGVYICs9IHRoaXMuc3BlZWRYO1xyXG4gICAgdGhpcy5hbmdsZVkgKz0gdGhpcy5zcGVlZFk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoeCwgeSwgcykge1xyXG4gICAgbGV0IHByb3AgPSAxMztcclxuICAgIHRoaXMudmVydGljZXMgPSBbXHJcbiAgICAgIFt4LCB5XSxcclxuICAgICAgW3gsIHkgKyAxNjcgLyBwcm9wXSxcclxuICAgICAgW3ggKyAzOSAvIHByb3AsIHkgKyAxMjkgLyBwcm9wXSxcclxuICAgICAgW3ggKyA3NSAvIHByb3AsIHkgKyAyMTQgLyBwcm9wXSxcclxuICAgICAgW3ggKyAxMDAgLyBwcm9wLCB5ICsgMjAxIC8gcHJvcF0sXHJcbiAgICAgIFt4ICsgNjYgLyBwcm9wLCB5ICsgMTE1IC8gcHJvcF0sXHJcbiAgICAgIFt4ICsgMTIyIC8gcHJvcCwgeSArIDExNSAvIHByb3BdXHJcbiAgICBdO1xyXG4gICAgdGhpcy50cmFjZShzKTtcclxuICB9XHJcblxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzd2FybVJhbmRvbShzKSB7XHJcbiAgICB0aGlzLnN3YXJtQXJyLmZvckVhY2goY3Vyc29yID0+IHtcclxuICAgICAgY3Vyc29yLmNyaWNsZShzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgU3dhcm17XHJcbiAgY29uc3RydWN0b3Iocyl7XHJcbiAgICB0aGlzLnR5cGUgPSAnY2FudmFzJztcclxuICAgIHRoaXMuc3dhcm1BcnIgPSBbXTtcclxuICAgIHRoaXMuaW5pdChzKTtcclxuICB9XHJcblxyXG4gIGluaXQocyl7XHJcbiAgICBsZXQgdGVtcCxcclxuICAgIHBvc2l0aW9uQ29vciA9IFtdLFxyXG4gICAgc3BlZWRzID0gW10sXHJcbiAgICBhbmdsZXMgPSBbXSxcclxuICAgIHIsXHJcbiAgICBhbW91bnQgPSAzMDAsIFxyXG4gICAgYW1wbGl0dWRlO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcclxuXHJcbiAgICAgIHBvc2l0aW9uQ29vciA9IFswLCAwXTtcclxuICAgICAgc3BlZWRzID0gW1xyXG4gICAgICAgIE1hdGguYWJzKHRoaXMucmFuZG9tKDAsIDAuMiwgdHJ1ZSkgLyA1MCksXHJcbiAgICAgICAgTWF0aC5hYnModGhpcy5yYW5kb20oMCwgMC4yLCB0cnVlKSAvIDUwKVxyXG4gICAgICBdO1xyXG4gICAgICBhbmdsZXMgPSBbMCwgMF07XHJcbiAgICAgIGFtcGxpdHVkZSA9IHRoaXMucmFuZG9tKDIwLCAxMDAwKTtcclxuICAgICAgdGVtcCA9IG5ldyBDdXJzb3IocG9zaXRpb25Db29yLCBzcGVlZHMsIGFuZ2xlcywgYW1wbGl0dWRlLCBzKTtcclxuICAgICAgdGhpcy5zd2FybUFyci5wdXNoKHRlbXApO1xyXG4gICAgfVxyXG4gIH1cclxuICByYW5kb20obWluLCBtYXgsIGRlY2ltYWwgPSBmYWxzZSkge1xyXG4gICAgaWYgKCFkZWNpbWFsKSB7XHJcbiAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWluID0gbWluO1xyXG4gICAgICBtYXggPSBtYXg7XHJcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluO1xyXG4gICAgfVxyXG4gIH1cclxuICBkcmF3KHMpe1xyXG4gICAgcy5wdXNoKCk7XHJcbiAgICBzLmNsZWFyKCk7XHJcbiAgICB0aGlzLnN3YXJtQXJyLmZvckVhY2goKGN1cnNvcik9PntcclxuICAgICAgY3Vyc29yLmNpcmNsZShzKTtcclxuICAgIH0pO1xyXG4gICAgcy5wb3AoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Vyc29yO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFN3YXJtO1xyXG5cclxuIiwiY2xhc3Mgc2F5aGkge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50eXBlID0gXCJkb21cIjtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJwaW5rXCI7XHJcbiAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYXloaTtcclxuIiwiY2xhc3MgQ3Vyc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvcihjdXJzZUFycikge1xyXG4gICAgdGhpcy5jdXJzZUFyciA9IGN1cnNlQXJyO1xyXG4gICAgdGhpcy5jYW52YXNDdXJzZXNBcnIgPSBbXTtcclxuICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzID0gW107XHJcbiAgfVxyXG4gIGluaXQoKSB7XHJcbiAgICAvL3RoaXMuc29ydENhbnZhc0N1cnNlcygpO1xyXG4gICAgdGhpcy5jYW52YXNTZXRVcCgpO1xyXG4gICAgdGhpcy5saXN0ZW5Gb3JBY3RpdmF0aW9uKCk7XHJcbiAgICB0aGlzLmRyYXcoKTtcclxuICB9XHJcbiAgbGlzdGVuRm9yQWN0aXZhdGlvbigpIHtcclxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcclxuICAgICAgdGhpcy5wYXJzZVJlcXVlc3QocmVxdWVzdCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcGFyc2VSZXF1ZXN0KHJlcXVlc3QpIHtcclxuICAgIGxldCBrZXkgPSBPYmplY3Qua2V5cyhyZXF1ZXN0KTtcclxuICAgIGlmIChrZXlbMF0gPT0gYGN1cnNlYCkge1xyXG4gICAgICB0aGlzLmN1cnNlQXJyLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnNlLm5hbWUgPT09IHJlcXVlc3QuY3Vyc2UsIGN1cnNlLm5hbWUsIHJlcXVlc3QuY3Vyc2UpO1xyXG4gICAgICAgIGlmIChjdXJzZS5uYW1lID09PSByZXF1ZXN0LmN1cnNlKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3Vyc2UgYWN0aXZhdGVkXCIsIGN1cnNlKTtcclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUN1cnNlKGN1cnNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gYG1lc3NhZ2VgKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QubWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGV4ZWN1dGVDdXJzZShjdXJzZSkge1xyXG4gICAgbGV0IHRlbXAgPSBuZXcgY3Vyc2UodGhpcy5teXA1KTtcclxuICAgIGlmICh0ZW1wLnR5cGUgPT09IFwiY2FudmFzXCIpIHtcclxuICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMgPSBbXTtcclxuICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMucHVzaCh0ZW1wKTtcclxuICAgICAgY29uc29sZS5sb2codGVtcCk7XHJcbiAgICB9IGVsc2UgaWYgKHRlbXAudHlwZSA9PT0gXCJkb21cIikge1xyXG4gICAgICB0ZW1wLmluaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNvcnRDYW52YXNDdXJzZXMoKSB7XHJcbiAgICB0aGlzLmN1cnNlQXJyLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICBpZiAoY3Vyc2UudHlwZSA9PT0gXCJjYW52YXNcIikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzQXJyLnB1c2goY3Vyc2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbnZhc1NldFVwKCkge1xyXG4gICAgbGV0IHA1Q2FudmFzID0gcyA9PiB7XHJcbiAgICAgIHMuc2V0dXAgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBzLmNyZWF0ZUNhbnZhcyhzLndpbmRvd1dpZHRoLCBzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucG9zaXRpb24oMCwgMCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUoXCJ6LWluZGV4XCIsIDk5OSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUoXCJwb3NpdGlvblwiLCBcImZpeGVkXCIpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIHRoaXMubXlwNSA9IG5ldyBwNShwNUNhbnZhcyk7XHJcbiAgfVxyXG4gIGRyYXcoKSB7XHJcbiAgICBsZXQgcyA9IHRoaXMubXlwNTtcclxuICAgIHMuZHJhdyA9ICgpID0+IHtcclxuICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgICAgY3Vyc2UuZHJhdyhzKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdXJzZUhhbmRsZXI7XHJcbiJdfQ==
