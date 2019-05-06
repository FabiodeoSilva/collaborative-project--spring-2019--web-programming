(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");

let curseHandler = new CurseHandler([sayhi]);
curseHandler.init();

},{"./curses/test.js":2,"./model/CurseHandler.js":3}],2:[function(require,module,exports){
let sayhi = () => {
  let body = document.querySelector("body");
  body.style.background = "pink";
  console.log("hi");
};

module.exports = sayhi;

},{}],3:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvdGVzdC5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IEN1cnNlSGFuZGxlciA9IHJlcXVpcmUoXCIuL21vZGVsL0N1cnNlSGFuZGxlci5qc1wiKTtcclxuY29uc3Qgc2F5aGkgPSByZXF1aXJlKFwiLi9jdXJzZXMvdGVzdC5qc1wiKTtcclxuXHJcbmxldCBjdXJzZUhhbmRsZXIgPSBuZXcgQ3Vyc2VIYW5kbGVyKFtzYXloaV0pO1xyXG5jdXJzZUhhbmRsZXIuaW5pdCgpO1xyXG4iLCJsZXQgc2F5aGkgPSAoKSA9PiB7XHJcbiAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcInBpbmtcIjtcclxuICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYXloaTtcclxuIiwiY2xhc3MgQ3Vyc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvcihjdXJzZUFycikge1xyXG4gICAgdGhpcy5jdXJzZUFyciA9IGN1cnNlQXJyO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgLy90aGlzLmxpc3RlbkZvckFjdGl2YXRpb24oKTtcclxuICAgIHRoaXMuY2FudmFzU2V0VXAoKTtcclxuICAgIHRoaXMuZHJhdygpO1xyXG4gIH1cclxuICBsaXN0ZW5Gb3JBY3RpdmF0aW9uKCkge1xyXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICB0aGlzLnBhcnNlUmVxdWVzdChyZXF1ZXN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwYXJzZVJlcXVlc3QocmVxdWVzdCkge1xyXG4gICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKHJlcXVlc3QpO1xyXG4gICAgaWYgKGtleVswXSA9PSBgY3Vyc2VgKSB7XHJcbiAgICAgIHRoaXMuY3Vyc2VBcnIuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSwgY3Vyc2UubmFtZSwgcmVxdWVzdC5jdXJzZSk7XHJcbiAgICAgICAgaWYgKGN1cnNlLm5hbWUgPT09IHJlcXVlc3QuY3Vyc2UpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3Vyc2UgYWN0aXZhdGVkXCIsIGN1cnNlKTtcclxuICAgICAgICAgIGN1cnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoa2V5WzBdID09IGBtZXNzYWdlYCkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHJlcXVlc3QubWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjYW52YXNTZXRVcCgpIHtcclxuICAgIGxldCBwNUNhbnZhcyA9IHMgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhzKTtcclxuXHJcbiAgICAgIHMuc2V0dXAgPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGggPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuICAgICAgICBzLmNyZWF0ZUNhbnZhcyhzLndpbmRvd1dpZHRoLCBzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgLypjLnBvc2l0aW9uKDAsIDApO1xyXG4gICAgICAgIGMuc3R5bGUoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgYy5zdHlsZShcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XHJcbiAgICAgICAgYy5zdHlsZShcInotaW5kZXhcIiwgOTk5KTsqL1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIHRoaXMubXlwNSA9IG5ldyBwNShwNUNhbnZhcyk7XHJcbiAgfVxyXG4gIGRyYXcoKSB7XHJcbiAgICBsZXQgcyA9IHRoaXMubXlwNTtcclxuICAgIHMuZHJhdyA9ICgpID0+IHtcclxuICAgICAgcy5maWxsKFwiYmxhY2tcIik7XHJcbiAgICAgIHMuZWxsaXBzZSgxMDAsIDEwMCwgMTAwKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNlSGFuZGxlcjtcclxuIl19
