(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const blood = require("./curses/bloodyScreen");

let curseHandler = new CurseHandler([blood, sayhi]);
curseHandler.init();

},{"./curses/bloodyScreen":2,"./curses/test.js":3,"./model/CurseHandler.js":4}],2:[function(require,module,exports){
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
    this.bloodArr.forEach(drop => {
      s.stroke(s.color(drop.red, 0, 0));
      s.point(drop.xPos, drop.yPos);
      if (drop.yPos <= s.height) drop.yPos += drop.SpeedRate;
    });
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

},{}],4:[function(require,module,exports){
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
          // console.log("curse activated", curse);
          this.executeCurse(curse);
        }
      });
    } else if (key[0] == `message`) {
      //console.log(request.message);
    }
  }
  executeCurse(curse) {
    let temp = new curse(this.myp5);
    if (temp.type === "canvas") {
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
        /*this.canvasCursesArr.forEach(curse => {
          this.canvasCursesInstances.push(new curse(s));
        });*/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvYmxvb2R5U2NyZWVuLmpzIiwiZGV2L2N1cnNlcy90ZXN0LmpzIiwiZGV2L21vZGVsL0N1cnNlSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgQ3Vyc2VIYW5kbGVyID0gcmVxdWlyZShcIi4vbW9kZWwvQ3Vyc2VIYW5kbGVyLmpzXCIpO1xyXG5jb25zdCBzYXloaSA9IHJlcXVpcmUoXCIuL2N1cnNlcy90ZXN0LmpzXCIpO1xyXG5jb25zdCBibG9vZCA9IHJlcXVpcmUoXCIuL2N1cnNlcy9ibG9vZHlTY3JlZW5cIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihbYmxvb2QsIHNheWhpXSk7XHJcbmN1cnNlSGFuZGxlci5pbml0KCk7XHJcbiIsImNsYXNzIEJsb29kIHtcclxuICBjb25zdHJ1Y3RvcihzKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBcImNhbnZhc1wiO1xyXG4gICAgdGhpcy5ibG9vZEFyciA9IFtdO1xyXG4gICAgdGhpcy5zZXR1cChzKTtcclxuICB9XHJcbiAgc2V0dXAocykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcy53aWR0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYmxvb2RBcnIucHVzaCh7XHJcbiAgICAgICAgeFBvczogaSxcclxuICAgICAgICB5UG9zOiAwLFxyXG4gICAgICAgIHJlZDogTWF0aC5mbG9vcih0aGlzLnJhbmRvbSgxNTUsIDI1NSkpLFxyXG4gICAgICAgIFNwZWVkUmF0ZTogMSAvIHRoaXMuZ2V0Um5kQmlhcygxLCAxMCwgNSwgMSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3KHMpIHtcclxuICAgIHRoaXMuYmxvb2RBcnIuZm9yRWFjaChkcm9wID0+IHtcclxuICAgICAgcy5zdHJva2Uocy5jb2xvcihkcm9wLnJlZCwgMCwgMCkpO1xyXG4gICAgICBzLnBvaW50KGRyb3AueFBvcywgZHJvcC55UG9zKTtcclxuICAgICAgaWYgKGRyb3AueVBvcyA8PSBzLmhlaWdodCkgZHJvcC55UG9zICs9IGRyb3AuU3BlZWRSYXRlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSbmRCaWFzKG1pbiwgbWF4LCBiaWFzLCBpbmZsdWVuY2UpIHtcclxuICAgIGxldCBybmQgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4sIC8vIHJhbmRvbSBpbiByYW5nZVxyXG4gICAgICBtaXggPSBNYXRoLnJhbmRvbSgpICogaW5mbHVlbmNlOyAvLyByYW5kb20gbWl4ZXJcclxuICAgIHJldHVybiBybmQgKiAoMSAtIG1peCkgKyBiaWFzICogbWl4OyAvLyBtaXggZnVsbCByYW5nZSBhbmQgYmlhc1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tKG1pbiwgbWF4LCBkZWNpbWFsID0gZmFsc2UpIHtcclxuICAgIGlmICghZGVjaW1hbCkge1xyXG4gICAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1pbiA9IG1pbjtcclxuICAgICAgbWF4ID0gbWF4O1xyXG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmxldCBibG9vZFNjcmVlblJhbmRvbSA9IChzLCBiZWF0KSA9PiB7XHJcbiAgcy5zdHJva2Uocy5jb2xvcihyYW5kb20oMTAwLCAyNTUpLCAwLCAwKSk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcy53aWR0aDsgaSsrKSB7XHJcbiAgICBpZiAoYmVhdCA8PSBzLmhlaWdodCkgeVBvcyA9IHJhbmRvbSgwLCBiZWF0KTtcclxuICAgIGVsc2UgeVBvcyA9IHJhbmRvbSgwLCBzLmhlaWdodCk7XHJcbiAgICBzLnBvaW50KGksIHlQb3MpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvb2Q7XHJcbiIsImNsYXNzIHNheWhpIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudHlwZSA9IFwiZG9tXCI7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9IFwicGlua1wiO1xyXG4gICAgY29uc29sZS5sb2coXCJoaVwiKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2F5aGk7XHJcbiIsImNsYXNzIEN1cnNlSGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IoY3Vyc2VBcnIpIHtcclxuICAgIHRoaXMuY3Vyc2VBcnIgPSBjdXJzZUFycjtcclxuICAgIHRoaXMuY2FudmFzQ3Vyc2VzQXJyID0gW107XHJcbiAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcyA9IFtdO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgLy90aGlzLnNvcnRDYW52YXNDdXJzZXMoKTtcclxuICAgIHRoaXMuY2FudmFzU2V0VXAoKTtcclxuICAgIHRoaXMubGlzdGVuRm9yQWN0aXZhdGlvbigpO1xyXG4gICAgdGhpcy5kcmF3KCk7XHJcbiAgfVxyXG4gIGxpc3RlbkZvckFjdGl2YXRpb24oKSB7XHJcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHRoaXMucGFyc2VSZXF1ZXN0KHJlcXVlc3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHBhcnNlUmVxdWVzdChyZXF1ZXN0KSB7XHJcbiAgICBsZXQga2V5ID0gT2JqZWN0LmtleXMocmVxdWVzdCk7XHJcbiAgICBpZiAoa2V5WzBdID09IGBjdXJzZWApIHtcclxuICAgICAgdGhpcy5jdXJzZUFyci5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjdXJzZS5uYW1lID09PSByZXF1ZXN0LmN1cnNlLCBjdXJzZS5uYW1lLCByZXF1ZXN0LmN1cnNlKTtcclxuICAgICAgICBpZiAoY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSkge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjdXJzZSBhY3RpdmF0ZWRcIiwgY3Vyc2UpO1xyXG4gICAgICAgICAgdGhpcy5leGVjdXRlQ3Vyc2UoY3Vyc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBgbWVzc2FnZWApIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhyZXF1ZXN0Lm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuICBleGVjdXRlQ3Vyc2UoY3Vyc2UpIHtcclxuICAgIGxldCB0ZW1wID0gbmV3IGN1cnNlKHRoaXMubXlwNSk7XHJcbiAgICBpZiAodGVtcC50eXBlID09PSBcImNhbnZhc1wiKSB7XHJcbiAgICAgIHRoaXMuY2FudmFzQ3Vyc2VzSW5zdGFuY2VzLnB1c2godGVtcCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRlbXApO1xyXG4gICAgfSBlbHNlIGlmICh0ZW1wLnR5cGUgPT09IFwiZG9tXCIpIHtcclxuICAgICAgdGVtcC5pbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzb3J0Q2FudmFzQ3Vyc2VzKCkge1xyXG4gICAgdGhpcy5jdXJzZUFyci5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgaWYgKGN1cnNlLnR5cGUgPT09IFwiY2FudmFzXCIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhc0N1cnNlc0Fyci5wdXNoKGN1cnNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjYW52YXNTZXRVcCgpIHtcclxuICAgIGxldCBwNUNhbnZhcyA9IHMgPT4ge1xyXG4gICAgICBzLnNldHVwID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gcy5jcmVhdGVDYW52YXMocy53aW5kb3dXaWR0aCwgcy53aW5kb3dIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnBvc2l0aW9uKDAsIDApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwiei1pbmRleFwiLCA5OTkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlKFwicG9zaXRpb25cIiwgXCJmaXhlZFwiKTtcclxuICAgICAgICAvKnRoaXMuY2FudmFzQ3Vyc2VzQXJyLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jYW52YXNDdXJzZXNJbnN0YW5jZXMucHVzaChuZXcgY3Vyc2UocykpO1xyXG4gICAgICAgIH0pOyovXHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgdGhpcy5teXA1ID0gbmV3IHA1KHA1Q2FudmFzKTtcclxuICB9XHJcbiAgZHJhdygpIHtcclxuICAgIGxldCBzID0gdGhpcy5teXA1O1xyXG4gICAgcy5kcmF3ID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmNhbnZhc0N1cnNlc0luc3RhbmNlcy5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgICBjdXJzZS5kcmF3KHMpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNlSGFuZGxlcjtcclxuIl19
