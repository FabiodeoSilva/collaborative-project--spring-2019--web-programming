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
    this.listenForActivation();
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
          console.log("curse activated");
          curse();
        }
      });
    } else if (key[0] == `message`) {
      //console.log(request.message);
    }
  }
}

module.exports = CurseHandler;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvY29udGVudC5qcyIsImRldi9jdXJzZXMvdGVzdC5qcyIsImRldi9tb2RlbC9DdXJzZUhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDdXJzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9DdXJzZUhhbmRsZXIuanNcIik7XHJcbmNvbnN0IHNheWhpID0gcmVxdWlyZShcIi4vY3Vyc2VzL3Rlc3QuanNcIik7XHJcblxyXG5sZXQgY3Vyc2VIYW5kbGVyID0gbmV3IEN1cnNlSGFuZGxlcihbc2F5aGldKTtcclxuY3Vyc2VIYW5kbGVyLmluaXQoKTtcclxuIiwibGV0IHNheWhpID0gKCkgPT4ge1xyXG4gIGxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XHJcbiAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJwaW5rXCI7XHJcbiAgY29uc29sZS5sb2coXCJoaVwiKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2F5aGk7XHJcbiIsImNsYXNzIEN1cnNlSGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IoY3Vyc2VBcnIpIHtcclxuICAgIHRoaXMuY3Vyc2VBcnIgPSBjdXJzZUFycjtcclxuICB9XHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMubGlzdGVuRm9yQWN0aXZhdGlvbigpO1xyXG4gIH1cclxuICBsaXN0ZW5Gb3JBY3RpdmF0aW9uKCkge1xyXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICB0aGlzLnBhcnNlUmVxdWVzdChyZXF1ZXN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwYXJzZVJlcXVlc3QocmVxdWVzdCkge1xyXG4gICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKHJlcXVlc3QpO1xyXG4gICAgaWYgKGtleVswXSA9PSBgY3Vyc2VgKSB7XHJcbiAgICAgIHRoaXMuY3Vyc2VBcnIuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc2UubmFtZSA9PT0gcmVxdWVzdC5jdXJzZSwgY3Vyc2UubmFtZSwgcmVxdWVzdC5jdXJzZSk7XHJcbiAgICAgICAgaWYgKGN1cnNlLm5hbWUgPT09IHJlcXVlc3QuY3Vyc2UpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3Vyc2UgYWN0aXZhdGVkXCIpO1xyXG4gICAgICAgICAgY3Vyc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gYG1lc3NhZ2VgKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2cocmVxdWVzdC5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Vyc2VIYW5kbGVyO1xyXG4iXX0=
