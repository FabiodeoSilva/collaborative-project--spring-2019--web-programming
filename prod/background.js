(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["say", "cry", "why","fry", "bye"];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, arr, false);
let dryStage = new Stage(2, 33, arr, true);

const haunter = new Haunter(30, [sayStage, cryStage, dryStage]);
haunter.init();


console.log("background running");

/*function answer(response) {
  console.log(response);
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
});

let x = 0;
setInterval(() => {
  console.log(x);
  x++;
}, 1000);*/

},{"./model/haunter":2,"./model/stage":3}],2:[function(require,module,exports){
const Stage = require("./stage");

class Haunter {
  constructor(maxSecs, stages) {
    this.stages = stages;
    this.currStage = this.stages[0];
    this.currSecs = 0;
    this.maxSecs = maxSecs;
    this.checkStageTimeLimit();
    this.setStageTimeRange();
  }
  sendMessage(message){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {message: message}, (response) => {
      });
    });
  }

  checkStageTimeLimit() {
    if (this.stages.length > 0) {
      let totalPercent = 0;

      this.stages.forEach(stage => {
        totalPercent += stage.percent;
        if (this.currStage.percent <= 100 && totalPercent <= 100) {
        } else {
          console.log(
            `The total time limit for the run does not add up to 100%; All stages will have equal lengths.`
          );
          let newPercent = (1 / this.stages.length) * 100;
          this.stages.forEach(stage2 => {
            stage2.percent = newPercent;
          });
          return;
        }
      });
    }
  }
  setStageTimeRange() {
    this.stages.forEach((stage, i) => {
      let start = 0,
        end = 0;
      if (stage == this.stages[0]) {
        end = stage.getTimeLength(this.maxSecs);

        stage.getRange([start, end]);
      } else {
        start = this.stages[i - 1].range[1];
        end = start + stage.getTimeLength(this.maxSecs);

        stage.getRange([start, end]);
      }
      console.log(stage.range);
    });
  }

  setTimer() {
    this.timerID = setInterval(() => {
      if (this.currSecs < this.maxSecs) {
        this.currSecs += 1;
        this.sendMessage(this.currSecs);
        this.update();
      } else {
        this.killTimer();
      }
    }, 1000);
  }

  killTimer() {
    clearInterval(this.timerID);
    this.currSecs = 0;
  }

  nextStage() {
    let i = this.stages.indexOf(this.currStage);
    if (i < this.stages.length - 1) this.currStage = this.stages[i + 1];
  }

  checkCurrStage() {
    /* if (
      this.currSecs > this.currStage.range[0] &&
      this.currSecs < this.currStage.range[1]
    ) {
    }*/
    let except = this.stages[0].range[1];
    if (this.currSecs === 1) {
      console.log(
        "Stage " + this.currStage.id + ": activated",
        this.currStage.order
      );
     this.currStage.activate();

    } else if (
      this.currSecs === except ||
      this.currSecs === this.currStage.range[1]
    ) {
      this.nextStage();
      console.log(
        "Stage " + this.currStage.id + ": activates",
        this.currStage.order
      );
      //this.currStage.executeAllCurses();
      this.currStage.activate();

    }
  }
  executeActivatedStages() {
    this.stages.forEach(stage => {
      if (stage.activation) {
        stage.execute(this.currSecs);
      }
    });
  }

  update() {
    this.checkCurrStage();
    this.executeActivatedStages();
    console.log(this.currSecs, this.currStage.id);
  }

  init() {
    //console.log(this.currStage.getTimeLength(this.maxSecs));
    this.setTimer();
  }
}

module.exports = Haunter;

},{"./stage":3}],3:[function(require,module,exports){
class Stage {
  constructor(id, timeLengthPercentage, curses, randomInvocation) {
    this.id = id;
    this.percent = timeLengthPercentage;
    this.activation = false;
    this.curses = curses;
    this.currCurseIndex = 0;
    this.transition;
    this.range = [];
    this.randomInvocation = randomInvocation;
  }

  sendMessage(curse, paramenter){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {curse: curse, para: paramenter}, (response) => {
        console.log('message sent from background:', curse);
      });
    });
  }
  getTimeLength(maxSeconds) {
    return (this.time = Math.round((maxSeconds * this.percent) / 100));
  }
  getRange(rangeArr) {
    this.range = rangeArr;
  }
  addCurse(curseFunc) {
    this.curses.push(curseFunc);
  }
  executeAllCurses() {
    this.curses.forEach(curse => {
      curse();
    });
  }
  randomCurse(...parameter) {
    let i = Math.floor(Math.random() * this.curses.length);
   // this.curses[i](...parameter);
    this.sendMessage(this.curses[i](...parameter), [...para]);
  }
  activate() {
    if (!this.activation) {
      this.activation = true;
      this.randomActivationOrder();
    }
  }
  deactivate() {
    this.activation = false;
  }
  executeAllCursesAtOnce(...para) {
    this.curses.forEach(curse => {
      //curse(...para);
      this.sendMessage(curse, [...para]);
    });
  }
  randomActivationOrder() {
    this.order = [];
    for (let i = 0; i <= this.curses.length; i++) {
      this.order[i] = this.random(this.range[0], this.range[1]);
    }
  }
  random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  execute(t) {
    if (this.activation) {
      for (let i = 0; i <= this.order.length; i++) {
        if (t === this.order[i]) {
          if (this.randomInvocation) {
            this.randomCurse(this.id);
          } else {
            //this.curses[this.currCurseIndex](this.id);
            this.sendMessage(this.curses[this.currCurseIndex], this.id);
            if (this.currCurseIndex < this.curses.length - 1)
              this.currCurseIndex++;
          }
        }
      }
    }
  }
}

module.exports = Stage;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L21vZGVsL2hhdW50ZXIuanMiLCJkZXYvbW9kZWwvc3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IEhhdW50ZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9oYXVudGVyXCIpO1xyXG5jb25zdCBTdGFnZSA9IHJlcXVpcmUoXCIuL21vZGVsL3N0YWdlXCIpO1xyXG5cclxuKFwidXNpbmcgbmFtZXNwYWNlXCIpO1xyXG5cclxubGV0IGFyciA9IFtcInNheVwiLCBcImNyeVwiLCBcIndoeVwiLFwiZnJ5XCIsIFwiYnllXCJdO1xyXG5sZXQgc2F5U3RhZ2UgPSBuZXcgU3RhZ2UoMCwgMzMsIGFyciwgZmFsc2UpO1xyXG5sZXQgY3J5U3RhZ2UgPSBuZXcgU3RhZ2UoMSwgMzMsIGFyciwgZmFsc2UpO1xyXG5sZXQgZHJ5U3RhZ2UgPSBuZXcgU3RhZ2UoMiwgMzMsIGFyciwgdHJ1ZSk7XHJcblxyXG5jb25zdCBoYXVudGVyID0gbmV3IEhhdW50ZXIoMzAsIFtzYXlTdGFnZSwgY3J5U3RhZ2UsIGRyeVN0YWdlXSk7XHJcbmhhdW50ZXIuaW5pdCgpO1xyXG5cclxuXHJcbmNvbnNvbGUubG9nKFwiYmFja2dyb3VuZCBydW5uaW5nXCIpO1xyXG5cclxuLypmdW5jdGlvbiBhbnN3ZXIocmVzcG9uc2UpIHtcclxuICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbn1cclxuXHJcbmNocm9tZS5leHRlbnNpb24ub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbmxldCB4ID0gMDtcclxuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKHgpO1xyXG4gIHgrKztcclxufSwgMTAwMCk7Ki9cclxuIiwiY29uc3QgU3RhZ2UgPSByZXF1aXJlKFwiLi9zdGFnZVwiKTtcclxuXHJcbmNsYXNzIEhhdW50ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG1heFNlY3MsIHN0YWdlcykge1xyXG4gICAgdGhpcy5zdGFnZXMgPSBzdGFnZXM7XHJcbiAgICB0aGlzLmN1cnJTdGFnZSA9IHRoaXMuc3RhZ2VzWzBdO1xyXG4gICAgdGhpcy5jdXJyU2VjcyA9IDA7XHJcbiAgICB0aGlzLm1heFNlY3MgPSBtYXhTZWNzO1xyXG4gICAgdGhpcy5jaGVja1N0YWdlVGltZUxpbWl0KCk7XHJcbiAgICB0aGlzLnNldFN0YWdlVGltZVJhbmdlKCk7XHJcbiAgfVxyXG4gIHNlbmRNZXNzYWdlKG1lc3NhZ2Upe1xyXG4gICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XHJcbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHttZXNzYWdlOiBtZXNzYWdlfSwgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGVja1N0YWdlVGltZUxpbWl0KCkge1xyXG4gICAgaWYgKHRoaXMuc3RhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IHRvdGFsUGVyY2VudCA9IDA7XHJcblxyXG4gICAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKHN0YWdlID0+IHtcclxuICAgICAgICB0b3RhbFBlcmNlbnQgKz0gc3RhZ2UucGVyY2VudDtcclxuICAgICAgICBpZiAodGhpcy5jdXJyU3RhZ2UucGVyY2VudCA8PSAxMDAgJiYgdG90YWxQZXJjZW50IDw9IDEwMCkge1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgYFRoZSB0b3RhbCB0aW1lIGxpbWl0IGZvciB0aGUgcnVuIGRvZXMgbm90IGFkZCB1cCB0byAxMDAlOyBBbGwgc3RhZ2VzIHdpbGwgaGF2ZSBlcXVhbCBsZW5ndGhzLmBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBsZXQgbmV3UGVyY2VudCA9ICgxIC8gdGhpcy5zdGFnZXMubGVuZ3RoKSAqIDEwMDtcclxuICAgICAgICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UyID0+IHtcclxuICAgICAgICAgICAgc3RhZ2UyLnBlcmNlbnQgPSBuZXdQZXJjZW50O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgc2V0U3RhZ2VUaW1lUmFuZ2UoKSB7XHJcbiAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKChzdGFnZSwgaSkgPT4ge1xyXG4gICAgICBsZXQgc3RhcnQgPSAwLFxyXG4gICAgICAgIGVuZCA9IDA7XHJcbiAgICAgIGlmIChzdGFnZSA9PSB0aGlzLnN0YWdlc1swXSkge1xyXG4gICAgICAgIGVuZCA9IHN0YWdlLmdldFRpbWVMZW5ndGgodGhpcy5tYXhTZWNzKTtcclxuXHJcbiAgICAgICAgc3RhZ2UuZ2V0UmFuZ2UoW3N0YXJ0LCBlbmRdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzdGFydCA9IHRoaXMuc3RhZ2VzW2kgLSAxXS5yYW5nZVsxXTtcclxuICAgICAgICBlbmQgPSBzdGFydCArIHN0YWdlLmdldFRpbWVMZW5ndGgodGhpcy5tYXhTZWNzKTtcclxuXHJcbiAgICAgICAgc3RhZ2UuZ2V0UmFuZ2UoW3N0YXJ0LCBlbmRdKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhzdGFnZS5yYW5nZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFRpbWVyKCkge1xyXG4gICAgdGhpcy50aW1lcklEID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jdXJyU2VjcyA8IHRoaXMubWF4U2Vjcykge1xyXG4gICAgICAgIHRoaXMuY3VyclNlY3MgKz0gMTtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3VyclNlY3MpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5raWxsVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICBraWxsVGltZXIoKSB7XHJcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJRCk7XHJcbiAgICB0aGlzLmN1cnJTZWNzID0gMDtcclxuICB9XHJcblxyXG4gIG5leHRTdGFnZSgpIHtcclxuICAgIGxldCBpID0gdGhpcy5zdGFnZXMuaW5kZXhPZih0aGlzLmN1cnJTdGFnZSk7XHJcbiAgICBpZiAoaSA8IHRoaXMuc3RhZ2VzLmxlbmd0aCAtIDEpIHRoaXMuY3VyclN0YWdlID0gdGhpcy5zdGFnZXNbaSArIDFdO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tDdXJyU3RhZ2UoKSB7XHJcbiAgICAvKiBpZiAoXHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPiB0aGlzLmN1cnJTdGFnZS5yYW5nZVswXSAmJlxyXG4gICAgICB0aGlzLmN1cnJTZWNzIDwgdGhpcy5jdXJyU3RhZ2UucmFuZ2VbMV1cclxuICAgICkge1xyXG4gICAgfSovXHJcbiAgICBsZXQgZXhjZXB0ID0gdGhpcy5zdGFnZXNbMF0ucmFuZ2VbMV07XHJcbiAgICBpZiAodGhpcy5jdXJyU2VjcyA9PT0gMSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBcIlN0YWdlIFwiICsgdGhpcy5jdXJyU3RhZ2UuaWQgKyBcIjogYWN0aXZhdGVkXCIsXHJcbiAgICAgICAgdGhpcy5jdXJyU3RhZ2Uub3JkZXJcclxuICAgICAgKTtcclxuICAgICB0aGlzLmN1cnJTdGFnZS5hY3RpdmF0ZSgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPT09IGV4Y2VwdCB8fFxyXG4gICAgICB0aGlzLmN1cnJTZWNzID09PSB0aGlzLmN1cnJTdGFnZS5yYW5nZVsxXVxyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMubmV4dFN0YWdlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIFwiU3RhZ2UgXCIgKyB0aGlzLmN1cnJTdGFnZS5pZCArIFwiOiBhY3RpdmF0ZXNcIixcclxuICAgICAgICB0aGlzLmN1cnJTdGFnZS5vcmRlclxyXG4gICAgICApO1xyXG4gICAgICAvL3RoaXMuY3VyclN0YWdlLmV4ZWN1dGVBbGxDdXJzZXMoKTtcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UuYWN0aXZhdGUoKTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG4gIGV4ZWN1dGVBY3RpdmF0ZWRTdGFnZXMoKSB7XHJcbiAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKHN0YWdlID0+IHtcclxuICAgICAgaWYgKHN0YWdlLmFjdGl2YXRpb24pIHtcclxuICAgICAgICBzdGFnZS5leGVjdXRlKHRoaXMuY3VyclNlY3MpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMuY2hlY2tDdXJyU3RhZ2UoKTtcclxuICAgIHRoaXMuZXhlY3V0ZUFjdGl2YXRlZFN0YWdlcygpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5jdXJyU2VjcywgdGhpcy5jdXJyU3RhZ2UuaWQpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5jdXJyU3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpKTtcclxuICAgIHRoaXMuc2V0VGltZXIoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGF1bnRlcjtcclxuIiwiY2xhc3MgU3RhZ2Uge1xyXG4gIGNvbnN0cnVjdG9yKGlkLCB0aW1lTGVuZ3RoUGVyY2VudGFnZSwgY3Vyc2VzLCByYW5kb21JbnZvY2F0aW9uKSB7XHJcbiAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB0aGlzLnBlcmNlbnQgPSB0aW1lTGVuZ3RoUGVyY2VudGFnZTtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5jdXJzZXMgPSBjdXJzZXM7XHJcbiAgICB0aGlzLmN1cnJDdXJzZUluZGV4ID0gMDtcclxuICAgIHRoaXMudHJhbnNpdGlvbjtcclxuICAgIHRoaXMucmFuZ2UgPSBbXTtcclxuICAgIHRoaXMucmFuZG9tSW52b2NhdGlvbiA9IHJhbmRvbUludm9jYXRpb247XHJcbiAgfVxyXG5cclxuICBzZW5kTWVzc2FnZShjdXJzZSwgcGFyYW1lbnRlcil7XHJcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgKHRhYnMpID0+IHtcclxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge2N1cnNlOiBjdXJzZSwgcGFyYTogcGFyYW1lbnRlcn0sIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdtZXNzYWdlIHNlbnQgZnJvbSBiYWNrZ3JvdW5kOicsIGN1cnNlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZ2V0VGltZUxlbmd0aChtYXhTZWNvbmRzKSB7XHJcbiAgICByZXR1cm4gKHRoaXMudGltZSA9IE1hdGgucm91bmQoKG1heFNlY29uZHMgKiB0aGlzLnBlcmNlbnQpIC8gMTAwKSk7XHJcbiAgfVxyXG4gIGdldFJhbmdlKHJhbmdlQXJyKSB7XHJcbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VBcnI7XHJcbiAgfVxyXG4gIGFkZEN1cnNlKGN1cnNlRnVuYykge1xyXG4gICAgdGhpcy5jdXJzZXMucHVzaChjdXJzZUZ1bmMpO1xyXG4gIH1cclxuICBleGVjdXRlQWxsQ3Vyc2VzKCkge1xyXG4gICAgdGhpcy5jdXJzZXMuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgIGN1cnNlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmFuZG9tQ3Vyc2UoLi4ucGFyYW1ldGVyKSB7XHJcbiAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY3Vyc2VzLmxlbmd0aCk7XHJcbiAgIC8vIHRoaXMuY3Vyc2VzW2ldKC4uLnBhcmFtZXRlcik7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3Vyc2VzW2ldKC4uLnBhcmFtZXRlciksIFsuLi5wYXJhXSk7XHJcbiAgfVxyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2YXRpb24pIHtcclxuICAgICAgdGhpcy5hY3RpdmF0aW9uID0gdHJ1ZTtcclxuICAgICAgdGhpcy5yYW5kb21BY3RpdmF0aW9uT3JkZXIoKTtcclxuICAgIH1cclxuICB9XHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IGZhbHNlO1xyXG4gIH1cclxuICBleGVjdXRlQWxsQ3Vyc2VzQXRPbmNlKC4uLnBhcmEpIHtcclxuICAgIHRoaXMuY3Vyc2VzLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAvL2N1cnNlKC4uLnBhcmEpO1xyXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKGN1cnNlLCBbLi4ucGFyYV0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJhbmRvbUFjdGl2YXRpb25PcmRlcigpIHtcclxuICAgIHRoaXMub3JkZXIgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMuY3Vyc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMub3JkZXJbaV0gPSB0aGlzLnJhbmRvbSh0aGlzLnJhbmdlWzBdLCB0aGlzLnJhbmdlWzFdKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmFuZG9tKG1pbiwgbWF4KSB7XHJcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxuICBleGVjdXRlKHQpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2YXRpb24pIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5vcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0ID09PSB0aGlzLm9yZGVyW2ldKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yYW5kb21JbnZvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tQ3Vyc2UodGhpcy5pZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL3RoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdLCB0aGlzLmlkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VyckN1cnNlSW5kZXggPCB0aGlzLmN1cnNlcy5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgIHRoaXMuY3VyckN1cnNlSW5kZXgrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3RhZ2U7XHJcbiJdfQ==
