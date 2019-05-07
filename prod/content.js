(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");

let curseHandler = new CurseHandler([Swarm, sayhi, Blood, Swarm, Blood]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvYmxvb2R5U2NyZWVuLmpzIiwiZGV2L2N1cnNlcy9jdXJzb3JTd2FybS5qcyIsImRldi9jdXJzZXMvdGVzdC5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDdXJzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9DdXJzZUhhbmRsZXIuanNcIik7XHJcbmNvbnN0IHNheWhpID0gcmVxdWlyZShcIi4vY3Vyc2VzL3Rlc3QuanNcIik7XHJcbmNvbnN0IEJsb29kID0gcmVxdWlyZShcIi4vY3Vyc2VzL2Jsb29keVNjcmVlblwiKTtcclxuY29uc3QgU3dhcm0gPSByZXF1aXJlKFwiLi9jdXJzZXMvY3Vyc29yU3dhcm1cIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihbU3dhcm0sIHNheWhpLCBCbG9vZCwgU3dhcm0sIEJsb29kXSk7XHJcbmN1cnNlSGFuZGxlci5pbml0KCk7XHJcbiIsImNsYXNzIEJsb29kIHtcclxuICBjb25zdHJ1Y3RvcihzKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBcImNhbnZhc1wiO1xyXG4gICAgdGhpcy5ibG9vZEFyciA9IFtdO1xyXG4gICAgdGhpcy5zZXR1cChzKTtcclxuICB9XHJcbiAgc2V0dXAocykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYmxvb2RBcnIucHVzaCh7XHJcbiAgICAgICAgeFBvczogaSxcclxuICAgICAgICB5UG9zOiAwLFxyXG4gICAgICAgIHJlZDogTWF0aC5mbG9vcih0aGlzLnJhbmRvbSgxNTUsIDI1NSkpLFxyXG4gICAgICAgIFNwZWVkUmF0ZTogMSAvIHRoaXMuZ2V0Um5kQmlhcygxLCAxMCwgNSwgMSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3KHMpIHtcclxuICAgIHMucHVzaCgpO1xyXG4gICAgdGhpcy5ibG9vZEFyci5mb3JFYWNoKGRyb3AgPT4ge1xyXG4gICAgICBzLnN0cm9rZShzLmNvbG9yKGRyb3AucmVkLCAwLCAwKSk7XHJcbiAgICAgIHMucG9pbnQoZHJvcC54UG9zLCBkcm9wLnlQb3MpO1xyXG4gICAgICBpZiAoZHJvcC55UG9zIDw9IHMuaGVpZ2h0KSBkcm9wLnlQb3MgKz0gZHJvcC5TcGVlZFJhdGU7XHJcbiAgICB9KTtcclxuICAgIHMucG9wKCk7XHJcbiAgfVxyXG5cclxuICBnZXRSbmRCaWFzKG1pbiwgbWF4LCBiaWFzLCBpbmZsdWVuY2UpIHtcclxuICAgIGxldCBybmQgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4sIC8vIHJhbmRvbSBpbiByYW5nZVxyXG4gICAgICBtaXggPSBNYXRoLnJhbmRvbSgpICogaW5mbHVlbmNlOyAvLyByYW5kb20gbWl4ZXJcclxuICAgIHJldHVybiBybmQgKiAoMSAtIG1peCkgKyBiaWFzICogbWl4OyAvLyBtaXggZnVsbCByYW5nZSBhbmQgYmlhc1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tKG1pbiwgbWF4LCBkZWNpbWFsID0gZmFsc2UpIHtcclxuICAgIGlmICghZGVjaW1hbCkge1xyXG4gICAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1pbiA9IG1pbjtcclxuICAgICAgbWF4ID0gbWF4O1xyXG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmxldCBibG9vZFNjcmVlblJhbmRvbSA9IChzLCBiZWF0KSA9PiB7XHJcbiAgcy5zdHJva2Uocy5jb2xvcihyYW5kb20oMTAwLCAyNTUpLCAwLCAwKSk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcy53aWR0aDsgaSsrKSB7XHJcbiAgICBpZiAoYmVhdCA8PSBzLmhlaWdodCkgeVBvcyA9IHJhbmRvbSgwLCBiZWF0KTtcclxuICAgIGVsc2UgeVBvcyA9IHJhbmRvbSgwLCBzLmhlaWdodCk7XHJcbiAgICBzLnBvaW50KGksIHlQb3MpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvb2Q7XHJcbiIsImNsYXNzIEN1cnNvciB7XHJcbiAgY29uc3RydWN0b3IocG9zaXRpb25Db29yLCBzcGVlZHMsIGFuZ2xlcywgYW1wbGl0dWRlLCBzKSB7XHJcbiAgICB0aGlzLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcclxuICAgIHRoaXMuYW5nbGVYID0gYW5nbGVzWzBdO1xyXG4gICAgdGhpcy5hbmdsZVkgPSBhbmdsZXNbMV07XHJcbiAgICB0aGlzLnNwZWVkWCA9IHNwZWVkc1swXTtcclxuICAgIHRoaXMuc3BlZWRZID0gc3BlZWRzWzFdO1xyXG5cclxuICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvclN0cm9rZSA9IFwid2hpdGVcIjtcclxuICAgICAgICAgIHRoaXMuY3Vyc29yQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jdXJzb3JTdHJva2UgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICB0aGlzLmN1cnNvckNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGUocG9zaXRpb25Db29yWzBdLCBwb3NpdGlvbkNvb3JbMV0sIHMpO1xyXG4gIH1cclxuXHJcbiAgdHJhY2Uocykge1xyXG4gICAgcy5maWxsKHRoaXMuY3Vyc29yQ29sb3IpO1xyXG4gICAgcy5zdHJva2UodGhpcy5jdXJzb3JTdHJva2UpO1xyXG4gICAgcy5iZWdpblNoYXBlKCk7XHJcbiAgICB0aGlzLnZlcnRpY2VzLmZvckVhY2goY29vciA9PiB7XHJcbiAgICAgICAgICBzLnZlcnRleChjb29yWzBdLCBjb29yWzFdKTtcclxuICAgIH0pO1xyXG4gICAgcy5lbmRTaGFwZShzLkNMT1NFKTtcclxuICB9XHJcblxyXG4gIGNpcmNsZShzKSB7XHJcbiAgICBsZXQgcHggPSBzLnNpbih0aGlzLmFuZ2xlWCkgKiB0aGlzLmFtcGxpdHVkZSArIHMud2luZG93V2lkdGggLyAyO1xyXG4gICAgbGV0IHB5ID0gcy5jb3ModGhpcy5hbmdsZVkpICogdGhpcy5hbXBsaXR1ZGUgKyBzLndpbmRvd0hlaWdodCAvIDI7XHJcbiAgICB0aGlzLnVwZGF0ZShweCwgcHksIHMpO1xyXG4gICAgdGhpcy5hbmdsZVggKz0gdGhpcy5zcGVlZFg7XHJcbiAgICB0aGlzLmFuZ2xlWSArPSB0aGlzLnNwZWVkWTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSh4LCB5LCBzKSB7XHJcbiAgICBsZXQgcHJvcCA9IDEzO1xyXG4gICAgdGhpcy52ZXJ0aWNlcyA9IFtcclxuICAgICAgW3gsIHldLFxyXG4gICAgICBbeCwgeSArIDE2NyAvIHByb3BdLFxyXG4gICAgICBbeCArIDM5IC8gcHJvcCwgeSArIDEyOSAvIHByb3BdLFxyXG4gICAgICBbeCArIDc1IC8gcHJvcCwgeSArIDIxNCAvIHByb3BdLFxyXG4gICAgICBbeCArIDEwMCAvIHByb3AsIHkgKyAyMDEgLyBwcm9wXSxcclxuICAgICAgW3ggKyA2NiAvIHByb3AsIHkgKyAxMTUgLyBwcm9wXSxcclxuICAgICAgW3ggKyAxMjIgLyBwcm9wLCB5ICsgMTE1IC8gcHJvcF1cclxuICAgIF07XHJcbiAgICB0aGlzLnRyYWNlKHMpO1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tKG1pbiwgbWF4LCBkZWNpbWFsID0gZmFsc2UpIHtcclxuICAgIGlmICghZGVjaW1hbCkge1xyXG4gICAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1pbiA9IG1pbjtcclxuICAgICAgbWF4ID0gbWF4O1xyXG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN3YXJtUmFuZG9tKHMpIHtcclxuICAgIHRoaXMuc3dhcm1BcnIuZm9yRWFjaChjdXJzb3IgPT4ge1xyXG4gICAgICBjdXJzb3IuY3JpY2xlKHMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBTd2FybXtcclxuICBjb25zdHJ1Y3RvcihzKXtcclxuICAgIHRoaXMudHlwZSA9ICdjYW52YXMnO1xyXG4gICAgdGhpcy5zd2FybUFyciA9IFtdO1xyXG4gICAgdGhpcy5pbml0KHMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdChzKXtcclxuICAgIGxldCB0ZW1wLFxyXG4gICAgcG9zaXRpb25Db29yID0gW10sXHJcbiAgICBzcGVlZHMgPSBbXSxcclxuICAgIGFuZ2xlcyA9IFtdLFxyXG4gICAgcixcclxuICAgIGFtb3VudCA9IDMwMCwgXHJcbiAgICBhbXBsaXR1ZGU7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKykge1xyXG5cclxuICAgICAgcG9zaXRpb25Db29yID0gWzAsIDBdO1xyXG4gICAgICBzcGVlZHMgPSBbXHJcbiAgICAgICAgTWF0aC5hYnModGhpcy5yYW5kb20oMCwgMC4yLCB0cnVlKSAvIDUwKSxcclxuICAgICAgICBNYXRoLmFicyh0aGlzLnJhbmRvbSgwLCAwLjIsIHRydWUpIC8gNTApXHJcbiAgICAgIF07XHJcbiAgICAgIGFuZ2xlcyA9IFswLCAwXTtcclxuICAgICAgYW1wbGl0dWRlID0gdGhpcy5yYW5kb20oMjAsIDEwMDApO1xyXG4gICAgICB0ZW1wID0gbmV3IEN1cnNvcihwb3NpdGlvbkNvb3IsIHNwZWVkcywgYW5nbGVzLCBhbXBsaXR1ZGUsIHMpO1xyXG4gICAgICB0aGlzLnN3YXJtQXJyLnB1c2godGVtcCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJhbmRvbShtaW4sIG1heCwgZGVjaW1hbCA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIWRlY2ltYWwpIHtcclxuICAgICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtaW4gPSBtaW47XHJcbiAgICAgIG1heCA9IG1heDtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW47XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRyYXcocyl7XHJcbiAgICBzLnB1c2goKTtcclxuICAgIHMuY2xlYXIoKTtcclxuICAgIHRoaXMuc3dhcm1BcnIuZm9yRWFjaCgoY3Vyc29yKT0+e1xyXG4gICAgICBjdXJzb3IuY2lyY2xlKHMpO1xyXG4gICAgfSk7XHJcbiAgICBzLnBvcCgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdXJzb3I7XHJcbm1vZHVsZS5leHBvcnRzID0gU3dhcm07XHJcblxyXG4iLCJjbGFzcyBzYXloaSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBcImRvbVwiO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XHJcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcInBpbmtcIjtcclxuICAgIGNvbnNvbGUubG9nKFwiaGlcIik7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNheWhpO1xyXG4iLCJjbGFzcyBDdXJzZUhhbmRsZXIge1xyXG4gIGNvbnN0cnVjdG9yKGN1cnNlQXJyKSB7XHJcbiAgICB0aGlzLmN1cnNlQXJyID0gY3Vyc2VBcnI7XHJcbiAgICB0aGlzLmNhbnZhc0N1cnNlc0FyciA9IFtdO1xyXG4gICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMgPSBbXTtcclxuICB9XHJcbiAgaW5pdCgpIHtcclxuICAgIC8vdGhpcy5zb3J0Q2FudmFzQ3Vyc2VzKCk7XHJcbiAgICB0aGlzLmNhbnZhc1NldFVwKCk7XHJcbiAgICB0aGlzLmxpc3RlbkZvckFjdGl2YXRpb24oKTtcclxuICAgIHRoaXMuZHJhdygpO1xyXG4gIH1cclxuICBsaXN0ZW5Gb3JBY3RpdmF0aW9uKCkge1xyXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICB0aGlzLnBhcnNlUmVxdWVzdChyZXF1ZXN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwYXJzZVJlcXVlc3QocmVxdWVzdCkge1xyXG4gICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKHJlcXVlc3QpO1xyXG4gICAgaWYgKGtleVswXSA9PSBgY3Vyc2VgKSB7XHJcbiAgICAgIHRoaXMuY3Vyc2VBcnIuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSwgY3Vyc2UubmFtZSwgcmVxdWVzdC5jdXJzZSk7XHJcbiAgICAgICAgaWYgKGN1cnNlLm5hbWUgPT09IHJlcXVlc3QuY3Vyc2UpIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjdXJzZSBhY3RpdmF0ZWRcIiwgY3Vyc2UpO1xyXG4gICAgICAgICAgdGhpcy5leGVjdXRlQ3Vyc2UoY3Vyc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBgbWVzc2FnZWApIHtcclxuICAgICAgY29uc29sZS5sb2cocmVxdWVzdC5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbiAgZXhlY3V0ZUN1cnNlKGN1cnNlKSB7XHJcbiAgICBsZXQgdGVtcCA9IG5ldyBjdXJzZSh0aGlzLm15cDUpO1xyXG4gICAgaWYgKHRlbXAudHlwZSA9PT0gXCJjYW52YXNcIikge1xyXG4gICAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcyA9IFtdO1xyXG4gICAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcy5wdXNoKHRlbXApO1xyXG4gICAgICBjb25zb2xlLmxvZyh0ZW1wKTtcclxuICAgIH0gZWxzZSBpZiAodGVtcC50eXBlID09PSBcImRvbVwiKSB7XHJcbiAgICAgIHRlbXAuaW5pdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc29ydENhbnZhc0N1cnNlcygpIHtcclxuICAgIHRoaXMuY3Vyc2VBcnIuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgIGlmIChjdXJzZS50eXBlID09PSBcImNhbnZhc1wiKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDdXJzZXNBcnIucHVzaChjdXJzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2FudmFzU2V0VXAoKSB7XHJcbiAgICBsZXQgcDVDYW52YXMgPSBzID0+IHtcclxuICAgICAgcy5zZXR1cCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHMuY3JlYXRlQ2FudmFzKHMud2luZG93V2lkdGgsIHMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5wb3NpdGlvbigwLCAwKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZShcInotaW5kZXhcIiwgOTk5KTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZShcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgdGhpcy5teXA1ID0gbmV3IHA1KHA1Q2FudmFzKTtcclxuICB9XHJcbiAgZHJhdygpIHtcclxuICAgIGxldCBzID0gdGhpcy5teXA1O1xyXG4gICAgcy5kcmF3ID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcy5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgICBjdXJzZS5kcmF3KHMpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNlSGFuZGxlcjtcclxuIl19
