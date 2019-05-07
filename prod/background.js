(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["Swarm", "sayhi", "Blood", "Swarm", "Blood"];
let sayStage = new Stage(0, 100, arr, false);


const haunter = new Haunter(35, [sayStage]);
haunter.init();

},{"./model/haunter":2,"./model/stage":3}],2:[function(require,module,exports){
class Haunter {
  constructor(maxSecs, stages) {
    this.stages = stages;
    this.currStage = this.stages[0];
    this.currSecs = 0;
    this.maxSecs = maxSecs;
    this.checkStageTimeLimit();
    this.setStageTimeRange();
    this.activation = false;
  }

  /*Start Timer */
  init() {
    this.listenForActivation();
    if(this.activation){
      this.setTimer();
    }
  }
  activate(){
    this.activation = true; 
  }
  listenForActivation(){
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if(request.init == true){
        this.activation = true;
        this.init();
      }
      else if(request.init == false){
        this.activation = false;
        this.killTimer();
      }
    });
  }

  /*Sets the clock on which the extension operates. */
  setTimer() {
    this.timerID = setInterval(() => {
      if (this.currSecs < this.maxSecs) {
        this.currSecs += 1;
        this.sendMessage(this.currSecs);
        this.update();
      } else {
        /*if the timer gets to the end, Kill timer: Game Over */
        this.killTimer();
      }
    }, 1000);
  }

  update() {
    /*Check if the current Stage has ended.*/
    this.checkCurrStage();
    /*Executes all curses of all activated stages.*/
    this.executeActivatedStages();
  }

  /*Checks every second if the current stage has reached the end of its duration range. 
  If it has ended, then activate the next stage in line.*/
  checkCurrStage() {
    let except = this.stages[0].range[1];
    if (this.currSecs === 1) {
      console.log("Stage " + this.currStage.id + ": activated");
      this.currStage.activate();
    } else if (
      this.currSecs === except ||
      this.currSecs === this.currStage.range[1]
    ) {
      this.nextStage();
      console.log("Stage " + this.currStage.id + ": activates");
      this.currStage.activate();
    }
  }

  /*Sets the propriety "currStage" to the next stage in line*/
  nextStage() {
    let currStageIndex = this.stages.indexOf(this.currStage);
    if (currStageIndex < this.stages.length - 1)
      this.currStage = this.stages[currStageIndex + 1];
  }

  /*Execute all curses of all activated stages*/
  executeActivatedStages() {
    this.stages.forEach(stage => {
      if (stage.activation) {
        stage.execute(this.currSecs);
      }
    });
  }

  /*Determines how long each Stage module should last based on the amount of Stages loaded into Haunter.
e.g. If 3 Stage modules are loaded into Haunter, then each will last 33.3% of the total time.
Result: Updates Stage modules' propriety "percent" */
  checkStageTimeLimit() {
    if (this.stages.length > 0) {
      let totalPercent = 0;
      this.stages.forEach(stage => {
        totalPercent += stage.percent;

        /*if the total time limit (in percentage) given by the user surpasses 100%, then split the total time evenly among each stage*/
        if (this.currStage.percent > 100 && totalPercent > 100) {
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

  /*Determines the range in seconds that each stage begins and ends.
      Result: Populates Stage propriety "range" */
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

  /*Chrome Extension Only: Sends messages to content.js */
  sendMessage(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { message: message }, response => {});
    });
  }

  /*Stops Timer*/
  killTimer() {
    clearInterval(this.timerID);
    this.currSecs = 0;
  }
}

module.exports = Haunter;

},{}],3:[function(require,module,exports){
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

  /*Chrome Extension Only: Sends curse activation requests to content.js */
  sendMessage(curse, paramenter) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { curse: curse, para: paramenter },
        response => {
          console.log("message sent from background:", curse);
        }
      );
    });
  }

  /*returns the time (in seconds) to which this stage ends*/
  getTimeLength(maxSeconds) {
    return (this.time = Math.round((maxSeconds * this.percent) / 100));
  }

  /*sets this stage's duration range*/
  getRange(rangeArr) {
    this.range = rangeArr;
  }

  /*Adds curses to the list of curses*/
  addCurse(curseFunc) {
    this.curses.push(curseFunc);
  }

  /*activates a random curse*/
  randomCurse(...parameter) {
    let i = Math.floor(Math.random() * this.curses.length);
    // this.curses[i](...parameter);
    this.sendMessage(this.curses[i](...parameter), [...para]);
  }

  /*activates every curse function in the curse array in the default order*/
  executeAllCurses(...para) {
    this.curses.forEach(curse => {
      //curse(...para);
      this.sendMessage(curse, [...para]);
    });
  }

  /*Activates this stage if it's not activated. 
    Only activated stages that can have its curses being activated*/
  activate() {
    if (!this.activation) {
      this.activation = true;
      this.randomActivationOrder();
    }
  }

  /*Deactivate this current stage*/
  deactivate() {
    this.activation = false;
  }

  /*Randomizes the order to which each curse function is called.
    Result: creates a set of random numbers.
    The numbers represent the time (in seconds) that each curse gets invoked.*/
  randomActivationOrder() {
    this.order = [];
    for (let i = 0; i <= this.curses.length-1; i++) {
      this.order[i] = this.random(this.range[0], this.range[1]);
    }
  }

  /*Util function: random*/
  random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*Haunter object calls this function:
  If*/
  execute(t) {
    if (this.activation) {
      if (this.randomInvocation) {
        this.randomCurse(this.id);
      }else{
        for (let i = 0; i <= this.order.length-1; i++) {
          if (t === this.order[i]) {
            this.sendMessage(this.curses[this.currCurseIndex], this.id);
            if (this.currCurseIndex < this.curses.length - 1) this.currCurseIndex++;
          }
        }
        console.log(t, this.range, this.order);
      }
    }
  }
}
/*
      for (let i = 0; i <= this.order.length; i++) {
        if (t === this.order[i]) {
          if (this.randomInvocation) {
            this.randomCurse(this.id);
          } else {
            //this.curses[this.currCurseIndex](this.id);
            console.log('here');
            
            
          }
        }
      } */
module.exports = Stage;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L21vZGVsL2hhdW50ZXIuanMiLCJkZXYvbW9kZWwvc3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zb2xlLmxvZyhcImJhY2tncm91bmQgcnVubmluZ1wiKTtcclxuXHJcbmNvbnN0IEhhdW50ZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9oYXVudGVyXCIpO1xyXG5jb25zdCBTdGFnZSA9IHJlcXVpcmUoXCIuL21vZGVsL3N0YWdlXCIpO1xyXG5cclxuKFwidXNpbmcgbmFtZXNwYWNlXCIpO1xyXG5cclxubGV0IGFyciA9IFtcIlN3YXJtXCIsIFwic2F5aGlcIiwgXCJCbG9vZFwiLCBcIlN3YXJtXCIsIFwiQmxvb2RcIl07XHJcbmxldCBzYXlTdGFnZSA9IG5ldyBTdGFnZSgwLCAxMDAsIGFyciwgZmFsc2UpO1xyXG5cclxuXHJcbmNvbnN0IGhhdW50ZXIgPSBuZXcgSGF1bnRlcigzNSwgW3NheVN0YWdlXSk7XHJcbmhhdW50ZXIuaW5pdCgpO1xyXG4iLCJjbGFzcyBIYXVudGVyIHtcclxuICBjb25zdHJ1Y3RvcihtYXhTZWNzLCBzdGFnZXMpIHtcclxuICAgIHRoaXMuc3RhZ2VzID0gc3RhZ2VzO1xyXG4gICAgdGhpcy5jdXJyU3RhZ2UgPSB0aGlzLnN0YWdlc1swXTtcclxuICAgIHRoaXMuY3VyclNlY3MgPSAwO1xyXG4gICAgdGhpcy5tYXhTZWNzID0gbWF4U2VjcztcclxuICAgIHRoaXMuY2hlY2tTdGFnZVRpbWVMaW1pdCgpO1xyXG4gICAgdGhpcy5zZXRTdGFnZVRpbWVSYW5nZSgpO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKlN0YXJ0IFRpbWVyICovXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMubGlzdGVuRm9yQWN0aXZhdGlvbigpO1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uKXtcclxuICAgICAgdGhpcy5zZXRUaW1lcigpO1xyXG4gICAgfVxyXG4gIH1cclxuICBhY3RpdmF0ZSgpe1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gdHJ1ZTsgXHJcbiAgfVxyXG4gIGxpc3RlbkZvckFjdGl2YXRpb24oKXtcclxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYocmVxdWVzdC5pbml0ID09IHRydWUpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihyZXF1ZXN0LmluaXQgPT0gZmFsc2Upe1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMua2lsbFRpbWVyKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypTZXRzIHRoZSBjbG9jayBvbiB3aGljaCB0aGUgZXh0ZW5zaW9uIG9wZXJhdGVzLiAqL1xyXG4gIHNldFRpbWVyKCkge1xyXG4gICAgdGhpcy50aW1lcklEID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jdXJyU2VjcyA8IHRoaXMubWF4U2Vjcykge1xyXG4gICAgICAgIHRoaXMuY3VyclNlY3MgKz0gMTtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3VyclNlY3MpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLyppZiB0aGUgdGltZXIgZ2V0cyB0byB0aGUgZW5kLCBLaWxsIHRpbWVyOiBHYW1lIE92ZXIgKi9cclxuICAgICAgICB0aGlzLmtpbGxUaW1lcigpO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIC8qQ2hlY2sgaWYgdGhlIGN1cnJlbnQgU3RhZ2UgaGFzIGVuZGVkLiovXHJcbiAgICB0aGlzLmNoZWNrQ3VyclN0YWdlKCk7XHJcbiAgICAvKkV4ZWN1dGVzIGFsbCBjdXJzZXMgb2YgYWxsIGFjdGl2YXRlZCBzdGFnZXMuKi9cclxuICAgIHRoaXMuZXhlY3V0ZUFjdGl2YXRlZFN0YWdlcygpO1xyXG4gIH1cclxuXHJcbiAgLypDaGVja3MgZXZlcnkgc2Vjb25kIGlmIHRoZSBjdXJyZW50IHN0YWdlIGhhcyByZWFjaGVkIHRoZSBlbmQgb2YgaXRzIGR1cmF0aW9uIHJhbmdlLiBcclxuICBJZiBpdCBoYXMgZW5kZWQsIHRoZW4gYWN0aXZhdGUgdGhlIG5leHQgc3RhZ2UgaW4gbGluZS4qL1xyXG4gIGNoZWNrQ3VyclN0YWdlKCkge1xyXG4gICAgbGV0IGV4Y2VwdCA9IHRoaXMuc3RhZ2VzWzBdLnJhbmdlWzFdO1xyXG4gICAgaWYgKHRoaXMuY3VyclNlY3MgPT09IDEpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJTdGFnZSBcIiArIHRoaXMuY3VyclN0YWdlLmlkICsgXCI6IGFjdGl2YXRlZFwiKTtcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UuYWN0aXZhdGUoKTtcclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPT09IGV4Y2VwdCB8fFxyXG4gICAgICB0aGlzLmN1cnJTZWNzID09PSB0aGlzLmN1cnJTdGFnZS5yYW5nZVsxXVxyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMubmV4dFN0YWdlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RhZ2UgXCIgKyB0aGlzLmN1cnJTdGFnZS5pZCArIFwiOiBhY3RpdmF0ZXNcIik7XHJcbiAgICAgIHRoaXMuY3VyclN0YWdlLmFjdGl2YXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKlNldHMgdGhlIHByb3ByaWV0eSBcImN1cnJTdGFnZVwiIHRvIHRoZSBuZXh0IHN0YWdlIGluIGxpbmUqL1xyXG4gIG5leHRTdGFnZSgpIHtcclxuICAgIGxldCBjdXJyU3RhZ2VJbmRleCA9IHRoaXMuc3RhZ2VzLmluZGV4T2YodGhpcy5jdXJyU3RhZ2UpO1xyXG4gICAgaWYgKGN1cnJTdGFnZUluZGV4IDwgdGhpcy5zdGFnZXMubGVuZ3RoIC0gMSlcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UgPSB0aGlzLnN0YWdlc1tjdXJyU3RhZ2VJbmRleCArIDFdO1xyXG4gIH1cclxuXHJcbiAgLypFeGVjdXRlIGFsbCBjdXJzZXMgb2YgYWxsIGFjdGl2YXRlZCBzdGFnZXMqL1xyXG4gIGV4ZWN1dGVBY3RpdmF0ZWRTdGFnZXMoKSB7XHJcbiAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKHN0YWdlID0+IHtcclxuICAgICAgaWYgKHN0YWdlLmFjdGl2YXRpb24pIHtcclxuICAgICAgICBzdGFnZS5leGVjdXRlKHRoaXMuY3VyclNlY3MpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qRGV0ZXJtaW5lcyBob3cgbG9uZyBlYWNoIFN0YWdlIG1vZHVsZSBzaG91bGQgbGFzdCBiYXNlZCBvbiB0aGUgYW1vdW50IG9mIFN0YWdlcyBsb2FkZWQgaW50byBIYXVudGVyLlxyXG5lLmcuIElmIDMgU3RhZ2UgbW9kdWxlcyBhcmUgbG9hZGVkIGludG8gSGF1bnRlciwgdGhlbiBlYWNoIHdpbGwgbGFzdCAzMy4zJSBvZiB0aGUgdG90YWwgdGltZS5cclxuUmVzdWx0OiBVcGRhdGVzIFN0YWdlIG1vZHVsZXMnIHByb3ByaWV0eSBcInBlcmNlbnRcIiAqL1xyXG4gIGNoZWNrU3RhZ2VUaW1lTGltaXQoKSB7XHJcbiAgICBpZiAodGhpcy5zdGFnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgdG90YWxQZXJjZW50ID0gMDtcclxuICAgICAgdGhpcy5zdGFnZXMuZm9yRWFjaChzdGFnZSA9PiB7XHJcbiAgICAgICAgdG90YWxQZXJjZW50ICs9IHN0YWdlLnBlcmNlbnQ7XHJcblxyXG4gICAgICAgIC8qaWYgdGhlIHRvdGFsIHRpbWUgbGltaXQgKGluIHBlcmNlbnRhZ2UpIGdpdmVuIGJ5IHRoZSB1c2VyIHN1cnBhc3NlcyAxMDAlLCB0aGVuIHNwbGl0IHRoZSB0b3RhbCB0aW1lIGV2ZW5seSBhbW9uZyBlYWNoIHN0YWdlKi9cclxuICAgICAgICBpZiAodGhpcy5jdXJyU3RhZ2UucGVyY2VudCA+IDEwMCAmJiB0b3RhbFBlcmNlbnQgPiAxMDApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICBgVGhlIHRvdGFsIHRpbWUgbGltaXQgZm9yIHRoZSBydW4gZG9lcyBub3QgYWRkIHVwIHRvIDEwMCU7IEFsbCBzdGFnZXMgd2lsbCBoYXZlIGVxdWFsIGxlbmd0aHMuYFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGxldCBuZXdQZXJjZW50ID0gKDEgLyB0aGlzLnN0YWdlcy5sZW5ndGgpICogMTAwO1xyXG4gICAgICAgICAgdGhpcy5zdGFnZXMuZm9yRWFjaChzdGFnZTIgPT4ge1xyXG4gICAgICAgICAgICBzdGFnZTIucGVyY2VudCA9IG5ld1BlcmNlbnQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypEZXRlcm1pbmVzIHRoZSByYW5nZSBpbiBzZWNvbmRzIHRoYXQgZWFjaCBzdGFnZSBiZWdpbnMgYW5kIGVuZHMuXHJcbiAgICAgIFJlc3VsdDogUG9wdWxhdGVzIFN0YWdlIHByb3ByaWV0eSBcInJhbmdlXCIgKi9cclxuICBzZXRTdGFnZVRpbWVSYW5nZSgpIHtcclxuICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goKHN0YWdlLCBpKSA9PiB7XHJcbiAgICAgIGxldCBzdGFydCA9IDAsXHJcbiAgICAgICAgZW5kID0gMDtcclxuICAgICAgaWYgKHN0YWdlID09IHRoaXMuc3RhZ2VzWzBdKSB7XHJcbiAgICAgICAgZW5kID0gc3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpO1xyXG4gICAgICAgIHN0YWdlLmdldFJhbmdlKFtzdGFydCwgZW5kXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RhcnQgPSB0aGlzLnN0YWdlc1tpIC0gMV0ucmFuZ2VbMV07XHJcbiAgICAgICAgZW5kID0gc3RhcnQgKyBzdGFnZS5nZXRUaW1lTGVuZ3RoKHRoaXMubWF4U2Vjcyk7XHJcbiAgICAgICAgc3RhZ2UuZ2V0UmFuZ2UoW3N0YXJ0LCBlbmRdKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhzdGFnZS5yYW5nZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qQ2hyb21lIEV4dGVuc2lvbiBPbmx5OiBTZW5kcyBtZXNzYWdlcyB0byBjb250ZW50LmpzICovXHJcbiAgc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgdGFicyA9PiB7XHJcbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHsgbWVzc2FnZTogbWVzc2FnZSB9LCByZXNwb25zZSA9PiB7fSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qU3RvcHMgVGltZXIqL1xyXG4gIGtpbGxUaW1lcigpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcklEKTtcclxuICAgIHRoaXMuY3VyclNlY3MgPSAwO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXVudGVyO1xyXG4iLCJjbGFzcyBTdGFnZSB7XHJcbiAgY29uc3RydWN0b3IoaWQsIHRpbWVMZW5ndGhQZXJjZW50YWdlLCBjdXJzZXMsIHJhbmRvbUludm9jYXRpb24pIHtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMucGVyY2VudCA9IHRpbWVMZW5ndGhQZXJjZW50YWdlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gZmFsc2U7XHJcbiAgICB0aGlzLmN1cnNlcyA9IGN1cnNlcztcclxuICAgIHRoaXMuY3VyckN1cnNlSW5kZXggPSAwO1xyXG4gICAgdGhpcy50cmFuc2l0aW9uO1xyXG4gICAgdGhpcy5yYW5nZSA9IFtdO1xyXG4gICAgdGhpcy5yYW5kb21JbnZvY2F0aW9uID0gcmFuZG9tSW52b2NhdGlvbjtcclxuICB9XHJcblxyXG4gIC8qQ2hyb21lIEV4dGVuc2lvbiBPbmx5OiBTZW5kcyBjdXJzZSBhY3RpdmF0aW9uIHJlcXVlc3RzIHRvIGNvbnRlbnQuanMgKi9cclxuICBzZW5kTWVzc2FnZShjdXJzZSwgcGFyYW1lbnRlcikge1xyXG4gICAgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgdGFicyA9PiB7XHJcbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgIHRhYnNbMF0uaWQsXHJcbiAgICAgICAgeyBjdXJzZTogY3Vyc2UsIHBhcmE6IHBhcmFtZW50ZXIgfSxcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIm1lc3NhZ2Ugc2VudCBmcm9tIGJhY2tncm91bmQ6XCIsIGN1cnNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qcmV0dXJucyB0aGUgdGltZSAoaW4gc2Vjb25kcykgdG8gd2hpY2ggdGhpcyBzdGFnZSBlbmRzKi9cclxuICBnZXRUaW1lTGVuZ3RoKG1heFNlY29uZHMpIHtcclxuICAgIHJldHVybiAodGhpcy50aW1lID0gTWF0aC5yb3VuZCgobWF4U2Vjb25kcyAqIHRoaXMucGVyY2VudCkgLyAxMDApKTtcclxuICB9XHJcblxyXG4gIC8qc2V0cyB0aGlzIHN0YWdlJ3MgZHVyYXRpb24gcmFuZ2UqL1xyXG4gIGdldFJhbmdlKHJhbmdlQXJyKSB7XHJcbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VBcnI7XHJcbiAgfVxyXG5cclxuICAvKkFkZHMgY3Vyc2VzIHRvIHRoZSBsaXN0IG9mIGN1cnNlcyovXHJcbiAgYWRkQ3Vyc2UoY3Vyc2VGdW5jKSB7XHJcbiAgICB0aGlzLmN1cnNlcy5wdXNoKGN1cnNlRnVuYyk7XHJcbiAgfVxyXG5cclxuICAvKmFjdGl2YXRlcyBhIHJhbmRvbSBjdXJzZSovXHJcbiAgcmFuZG9tQ3Vyc2UoLi4ucGFyYW1ldGVyKSB7XHJcbiAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY3Vyc2VzLmxlbmd0aCk7XHJcbiAgICAvLyB0aGlzLmN1cnNlc1tpXSguLi5wYXJhbWV0ZXIpO1xyXG4gICAgdGhpcy5zZW5kTWVzc2FnZSh0aGlzLmN1cnNlc1tpXSguLi5wYXJhbWV0ZXIpLCBbLi4ucGFyYV0pO1xyXG4gIH1cclxuXHJcbiAgLyphY3RpdmF0ZXMgZXZlcnkgY3Vyc2UgZnVuY3Rpb24gaW4gdGhlIGN1cnNlIGFycmF5IGluIHRoZSBkZWZhdWx0IG9yZGVyKi9cclxuICBleGVjdXRlQWxsQ3Vyc2VzKC4uLnBhcmEpIHtcclxuICAgIHRoaXMuY3Vyc2VzLmZvckVhY2goY3Vyc2UgPT4ge1xyXG4gICAgICAvL2N1cnNlKC4uLnBhcmEpO1xyXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKGN1cnNlLCBbLi4ucGFyYV0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKkFjdGl2YXRlcyB0aGlzIHN0YWdlIGlmIGl0J3Mgbm90IGFjdGl2YXRlZC4gXHJcbiAgICBPbmx5IGFjdGl2YXRlZCBzdGFnZXMgdGhhdCBjYW4gaGF2ZSBpdHMgY3Vyc2VzIGJlaW5nIGFjdGl2YXRlZCovXHJcbiAgYWN0aXZhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuYWN0aXZhdGlvbikge1xyXG4gICAgICB0aGlzLmFjdGl2YXRpb24gPSB0cnVlO1xyXG4gICAgICB0aGlzLnJhbmRvbUFjdGl2YXRpb25PcmRlcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypEZWFjdGl2YXRlIHRoaXMgY3VycmVudCBzdGFnZSovXHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLypSYW5kb21pemVzIHRoZSBvcmRlciB0byB3aGljaCBlYWNoIGN1cnNlIGZ1bmN0aW9uIGlzIGNhbGxlZC5cclxuICAgIFJlc3VsdDogY3JlYXRlcyBhIHNldCBvZiByYW5kb20gbnVtYmVycy5cclxuICAgIFRoZSBudW1iZXJzIHJlcHJlc2VudCB0aGUgdGltZSAoaW4gc2Vjb25kcykgdGhhdCBlYWNoIGN1cnNlIGdldHMgaW52b2tlZC4qL1xyXG4gIHJhbmRvbUFjdGl2YXRpb25PcmRlcigpIHtcclxuICAgIHRoaXMub3JkZXIgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMuY3Vyc2VzLmxlbmd0aC0xOyBpKyspIHtcclxuICAgICAgdGhpcy5vcmRlcltpXSA9IHRoaXMucmFuZG9tKHRoaXMucmFuZ2VbMF0sIHRoaXMucmFuZ2VbMV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypVdGlsIGZ1bmN0aW9uOiByYW5kb20qL1xyXG4gIHJhbmRvbShtaW4sIG1heCkge1xyXG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICB9XHJcblxyXG4gIC8qSGF1bnRlciBvYmplY3QgY2FsbHMgdGhpcyBmdW5jdGlvbjpcclxuICBJZiovXHJcbiAgZXhlY3V0ZSh0KSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmF0aW9uKSB7XHJcbiAgICAgIGlmICh0aGlzLnJhbmRvbUludm9jYXRpb24pIHtcclxuICAgICAgICB0aGlzLnJhbmRvbUN1cnNlKHRoaXMuaWQpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLm9yZGVyLmxlbmd0aC0xOyBpKyspIHtcclxuICAgICAgICAgIGlmICh0ID09PSB0aGlzLm9yZGVyW2ldKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jdXJzZXNbdGhpcy5jdXJyQ3Vyc2VJbmRleF0sIHRoaXMuaWQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyQ3Vyc2VJbmRleCA8IHRoaXMuY3Vyc2VzLmxlbmd0aCAtIDEpIHRoaXMuY3VyckN1cnNlSW5kZXgrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codCwgdGhpcy5yYW5nZSwgdGhpcy5vcmRlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuLypcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5vcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0ID09PSB0aGlzLm9yZGVyW2ldKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yYW5kb21JbnZvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tQ3Vyc2UodGhpcy5pZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL3RoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGVyZScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9ICovXHJcbm1vZHVsZS5leHBvcnRzID0gU3RhZ2U7XHJcbiJdfQ==
