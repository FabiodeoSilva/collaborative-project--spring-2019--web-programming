(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const CurseHandler = require("./model/CurseHandler.js");
const test = require("./curses/test.js");

let curseHandler = new CurseHandler([test]);
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
    this.listenForActivation();
    this.curseArr[0]();
  }
  listenForActivation() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request);
    });
  }
}

module.exports = CurseHandler;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvdGVzdC5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgQ3Vyc2VIYW5kbGVyID0gcmVxdWlyZShcIi4vbW9kZWwvQ3Vyc2VIYW5kbGVyLmpzXCIpO1xyXG5jb25zdCB0ZXN0ID0gcmVxdWlyZShcIi4vY3Vyc2VzL3Rlc3QuanNcIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihbdGVzdF0pO1xyXG5jdXJzZUhhbmRsZXIuaW5pdCgpO1xyXG4iLCJsZXQgc2F5aGkgPSAoKSA9PiB7XHJcbiAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcInBpbmtcIjtcclxuICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYXloaTtcclxuIiwiY2xhc3MgQ3Vyc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvcihjdXJzZUFycikge1xyXG4gICAgdGhpcy5jdXJzZUFyciA9IGN1cnNlQXJyO1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5saXN0ZW5Gb3JBY3RpdmF0aW9uKCk7XHJcbiAgICB0aGlzLmN1cnNlQXJyWzBdKCk7XHJcbiAgfVxyXG4gIGxpc3RlbkZvckFjdGl2YXRpb24oKSB7XHJcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNlSGFuZGxlcjtcclxuIl19
