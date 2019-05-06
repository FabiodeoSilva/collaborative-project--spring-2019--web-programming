(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["say", "cry", "why", "fry", "bye"];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, arr, false);
let dryStage = new Stage(2, 33, arr, true);

const haunter = new Haunter(33, [sayStage, cryStage, dryStage]);
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
  }

  /*Start Timer */
  init() {
    //console.log(this.currStage.getTimeLength(this.maxSecs));
    this.setTimer();
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
    for (let i = 0; i <= this.curses.length; i++) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L21vZGVsL2hhdW50ZXIuanMiLCJkZXYvbW9kZWwvc3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc29sZS5sb2coXCJiYWNrZ3JvdW5kIHJ1bm5pbmdcIik7XHJcblxyXG5jb25zdCBIYXVudGVyID0gcmVxdWlyZShcIi4vbW9kZWwvaGF1bnRlclwiKTtcclxuY29uc3QgU3RhZ2UgPSByZXF1aXJlKFwiLi9tb2RlbC9zdGFnZVwiKTtcclxuXHJcbihcInVzaW5nIG5hbWVzcGFjZVwiKTtcclxuXHJcbmxldCBhcnIgPSBbXCJzYXlcIiwgXCJjcnlcIiwgXCJ3aHlcIiwgXCJmcnlcIiwgXCJieWVcIl07XHJcbmxldCBzYXlTdGFnZSA9IG5ldyBTdGFnZSgwLCAzMywgYXJyLCBmYWxzZSk7XHJcbmxldCBjcnlTdGFnZSA9IG5ldyBTdGFnZSgxLCAzMywgYXJyLCBmYWxzZSk7XHJcbmxldCBkcnlTdGFnZSA9IG5ldyBTdGFnZSgyLCAzMywgYXJyLCB0cnVlKTtcclxuXHJcbmNvbnN0IGhhdW50ZXIgPSBuZXcgSGF1bnRlcigzMywgW3NheVN0YWdlLCBjcnlTdGFnZSwgZHJ5U3RhZ2VdKTtcclxuaGF1bnRlci5pbml0KCk7XHJcbiIsImNsYXNzIEhhdW50ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG1heFNlY3MsIHN0YWdlcykge1xyXG4gICAgdGhpcy5zdGFnZXMgPSBzdGFnZXM7XHJcbiAgICB0aGlzLmN1cnJTdGFnZSA9IHRoaXMuc3RhZ2VzWzBdO1xyXG4gICAgdGhpcy5jdXJyU2VjcyA9IDA7XHJcbiAgICB0aGlzLm1heFNlY3MgPSBtYXhTZWNzO1xyXG4gICAgdGhpcy5jaGVja1N0YWdlVGltZUxpbWl0KCk7XHJcbiAgICB0aGlzLnNldFN0YWdlVGltZVJhbmdlKCk7XHJcbiAgfVxyXG5cclxuICAvKlN0YXJ0IFRpbWVyICovXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5jdXJyU3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpKTtcclxuICAgIHRoaXMuc2V0VGltZXIoKTtcclxuICB9XHJcblxyXG4gIC8qU2V0cyB0aGUgY2xvY2sgb24gd2hpY2ggdGhlIGV4dGVuc2lvbiBvcGVyYXRlcy4gKi9cclxuICBzZXRUaW1lcigpIHtcclxuICAgIHRoaXMudGltZXJJRCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuY3VyclNlY3MgPCB0aGlzLm1heFNlY3MpIHtcclxuICAgICAgICB0aGlzLmN1cnJTZWNzICs9IDE7XHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh0aGlzLmN1cnJTZWNzKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8qaWYgdGhlIHRpbWVyIGdldHMgdG8gdGhlIGVuZCwgS2lsbCB0aW1lcjogR2FtZSBPdmVyICovXHJcbiAgICAgICAgdGhpcy5raWxsVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcbiAgICAvKkNoZWNrIGlmIHRoZSBjdXJyZW50IFN0YWdlIGhhcyBlbmRlZC4qL1xyXG4gICAgdGhpcy5jaGVja0N1cnJTdGFnZSgpO1xyXG4gICAgLypFeGVjdXRlcyBhbGwgY3Vyc2VzIG9mIGFsbCBhY3RpdmF0ZWQgc3RhZ2VzLiovXHJcbiAgICB0aGlzLmV4ZWN1dGVBY3RpdmF0ZWRTdGFnZXMoKTtcclxuICB9XHJcblxyXG4gIC8qQ2hlY2tzIGV2ZXJ5IHNlY29uZCBpZiB0aGUgY3VycmVudCBzdGFnZSBoYXMgcmVhY2hlZCB0aGUgZW5kIG9mIGl0cyBkdXJhdGlvbiByYW5nZS4gXHJcbiAgSWYgaXQgaGFzIGVuZGVkLCB0aGVuIGFjdGl2YXRlIHRoZSBuZXh0IHN0YWdlIGluIGxpbmUuKi9cclxuICBjaGVja0N1cnJTdGFnZSgpIHtcclxuICAgIGxldCBleGNlcHQgPSB0aGlzLnN0YWdlc1swXS5yYW5nZVsxXTtcclxuICAgIGlmICh0aGlzLmN1cnJTZWNzID09PSAxKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RhZ2UgXCIgKyB0aGlzLmN1cnJTdGFnZS5pZCArIFwiOiBhY3RpdmF0ZWRcIik7XHJcbiAgICAgIHRoaXMuY3VyclN0YWdlLmFjdGl2YXRlKCk7XHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICB0aGlzLmN1cnJTZWNzID09PSBleGNlcHQgfHxcclxuICAgICAgdGhpcy5jdXJyU2VjcyA9PT0gdGhpcy5jdXJyU3RhZ2UucmFuZ2VbMV1cclxuICAgICkge1xyXG4gICAgICB0aGlzLm5leHRTdGFnZSgpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlN0YWdlIFwiICsgdGhpcy5jdXJyU3RhZ2UuaWQgKyBcIjogYWN0aXZhdGVzXCIpO1xyXG4gICAgICB0aGlzLmN1cnJTdGFnZS5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypTZXRzIHRoZSBwcm9wcmlldHkgXCJjdXJyU3RhZ2VcIiB0byB0aGUgbmV4dCBzdGFnZSBpbiBsaW5lKi9cclxuICBuZXh0U3RhZ2UoKSB7XHJcbiAgICBsZXQgY3VyclN0YWdlSW5kZXggPSB0aGlzLnN0YWdlcy5pbmRleE9mKHRoaXMuY3VyclN0YWdlKTtcclxuICAgIGlmIChjdXJyU3RhZ2VJbmRleCA8IHRoaXMuc3RhZ2VzLmxlbmd0aCAtIDEpXHJcbiAgICAgIHRoaXMuY3VyclN0YWdlID0gdGhpcy5zdGFnZXNbY3VyclN0YWdlSW5kZXggKyAxXTtcclxuICB9XHJcblxyXG4gIC8qRXhlY3V0ZSBhbGwgY3Vyc2VzIG9mIGFsbCBhY3RpdmF0ZWQgc3RhZ2VzKi9cclxuICBleGVjdXRlQWN0aXZhdGVkU3RhZ2VzKCkge1xyXG4gICAgdGhpcy5zdGFnZXMuZm9yRWFjaChzdGFnZSA9PiB7XHJcbiAgICAgIGlmIChzdGFnZS5hY3RpdmF0aW9uKSB7XHJcbiAgICAgICAgc3RhZ2UuZXhlY3V0ZSh0aGlzLmN1cnJTZWNzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKkRldGVybWluZXMgaG93IGxvbmcgZWFjaCBTdGFnZSBtb2R1bGUgc2hvdWxkIGxhc3QgYmFzZWQgb24gdGhlIGFtb3VudCBvZiBTdGFnZXMgbG9hZGVkIGludG8gSGF1bnRlci5cclxuZS5nLiBJZiAzIFN0YWdlIG1vZHVsZXMgYXJlIGxvYWRlZCBpbnRvIEhhdW50ZXIsIHRoZW4gZWFjaCB3aWxsIGxhc3QgMzMuMyUgb2YgdGhlIHRvdGFsIHRpbWUuXHJcblJlc3VsdDogVXBkYXRlcyBTdGFnZSBtb2R1bGVzJyBwcm9wcmlldHkgXCJwZXJjZW50XCIgKi9cclxuICBjaGVja1N0YWdlVGltZUxpbWl0KCkge1xyXG4gICAgaWYgKHRoaXMuc3RhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IHRvdGFsUGVyY2VudCA9IDA7XHJcbiAgICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UgPT4ge1xyXG4gICAgICAgIHRvdGFsUGVyY2VudCArPSBzdGFnZS5wZXJjZW50O1xyXG5cclxuICAgICAgICAvKmlmIHRoZSB0b3RhbCB0aW1lIGxpbWl0IChpbiBwZXJjZW50YWdlKSBnaXZlbiBieSB0aGUgdXNlciBzdXJwYXNzZXMgMTAwJSwgdGhlbiBzcGxpdCB0aGUgdG90YWwgdGltZSBldmVubHkgYW1vbmcgZWFjaCBzdGFnZSovXHJcbiAgICAgICAgaWYgKHRoaXMuY3VyclN0YWdlLnBlcmNlbnQgPiAxMDAgJiYgdG90YWxQZXJjZW50ID4gMTAwKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgYFRoZSB0b3RhbCB0aW1lIGxpbWl0IGZvciB0aGUgcnVuIGRvZXMgbm90IGFkZCB1cCB0byAxMDAlOyBBbGwgc3RhZ2VzIHdpbGwgaGF2ZSBlcXVhbCBsZW5ndGhzLmBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBsZXQgbmV3UGVyY2VudCA9ICgxIC8gdGhpcy5zdGFnZXMubGVuZ3RoKSAqIDEwMDtcclxuICAgICAgICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UyID0+IHtcclxuICAgICAgICAgICAgc3RhZ2UyLnBlcmNlbnQgPSBuZXdQZXJjZW50O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qRGV0ZXJtaW5lcyB0aGUgcmFuZ2UgaW4gc2Vjb25kcyB0aGF0IGVhY2ggc3RhZ2UgYmVnaW5zIGFuZCBlbmRzLlxyXG4gICAgICBSZXN1bHQ6IFBvcHVsYXRlcyBTdGFnZSBwcm9wcmlldHkgXCJyYW5nZVwiICovXHJcbiAgc2V0U3RhZ2VUaW1lUmFuZ2UoKSB7XHJcbiAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKChzdGFnZSwgaSkgPT4ge1xyXG4gICAgICBsZXQgc3RhcnQgPSAwLFxyXG4gICAgICAgIGVuZCA9IDA7XHJcbiAgICAgIGlmIChzdGFnZSA9PSB0aGlzLnN0YWdlc1swXSkge1xyXG4gICAgICAgIGVuZCA9IHN0YWdlLmdldFRpbWVMZW5ndGgodGhpcy5tYXhTZWNzKTtcclxuICAgICAgICBzdGFnZS5nZXRSYW5nZShbc3RhcnQsIGVuZF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0YXJ0ID0gdGhpcy5zdGFnZXNbaSAtIDFdLnJhbmdlWzFdO1xyXG4gICAgICAgIGVuZCA9IHN0YXJ0ICsgc3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpO1xyXG4gICAgICAgIHN0YWdlLmdldFJhbmdlKFtzdGFydCwgZW5kXSk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2coc3RhZ2UucmFuZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKkNocm9tZSBFeHRlbnNpb24gT25seTogU2VuZHMgbWVzc2FnZXMgdG8gY29udGVudC5qcyAqL1xyXG4gIHNlbmRNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIHRhYnMgPT4ge1xyXG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCB7IG1lc3NhZ2U6IG1lc3NhZ2UgfSwgcmVzcG9uc2UgPT4ge30pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKlN0b3BzIFRpbWVyKi9cclxuICBraWxsVGltZXIoKSB7XHJcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJRCk7XHJcbiAgICB0aGlzLmN1cnJTZWNzID0gMDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGF1bnRlcjtcclxuIiwiY2xhc3MgU3RhZ2Uge1xyXG4gIGNvbnN0cnVjdG9yKGlkLCB0aW1lTGVuZ3RoUGVyY2VudGFnZSwgY3Vyc2VzLCByYW5kb21JbnZvY2F0aW9uKSB7XHJcbiAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB0aGlzLnBlcmNlbnQgPSB0aW1lTGVuZ3RoUGVyY2VudGFnZTtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5jdXJzZXMgPSBjdXJzZXM7XHJcbiAgICB0aGlzLmN1cnJDdXJzZUluZGV4ID0gMDtcclxuICAgIHRoaXMudHJhbnNpdGlvbjtcclxuICAgIHRoaXMucmFuZ2UgPSBbXTtcclxuICAgIHRoaXMucmFuZG9tSW52b2NhdGlvbiA9IHJhbmRvbUludm9jYXRpb247XHJcbiAgfVxyXG5cclxuICAvKkNocm9tZSBFeHRlbnNpb24gT25seTogU2VuZHMgY3Vyc2UgYWN0aXZhdGlvbiByZXF1ZXN0cyB0byBjb250ZW50LmpzICovXHJcbiAgc2VuZE1lc3NhZ2UoY3Vyc2UsIHBhcmFtZW50ZXIpIHtcclxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIHRhYnMgPT4ge1xyXG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZShcclxuICAgICAgICB0YWJzWzBdLmlkLFxyXG4gICAgICAgIHsgY3Vyc2U6IGN1cnNlLCBwYXJhOiBwYXJhbWVudGVyIH0sXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlIHNlbnQgZnJvbSBiYWNrZ3JvdW5kOlwiLCBjdXJzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKnJldHVybnMgdGhlIHRpbWUgKGluIHNlY29uZHMpIHRvIHdoaWNoIHRoaXMgc3RhZ2UgZW5kcyovXHJcbiAgZ2V0VGltZUxlbmd0aChtYXhTZWNvbmRzKSB7XHJcbiAgICByZXR1cm4gKHRoaXMudGltZSA9IE1hdGgucm91bmQoKG1heFNlY29uZHMgKiB0aGlzLnBlcmNlbnQpIC8gMTAwKSk7XHJcbiAgfVxyXG5cclxuICAvKnNldHMgdGhpcyBzdGFnZSdzIGR1cmF0aW9uIHJhbmdlKi9cclxuICBnZXRSYW5nZShyYW5nZUFycikge1xyXG4gICAgdGhpcy5yYW5nZSA9IHJhbmdlQXJyO1xyXG4gIH1cclxuXHJcbiAgLypBZGRzIGN1cnNlcyB0byB0aGUgbGlzdCBvZiBjdXJzZXMqL1xyXG4gIGFkZEN1cnNlKGN1cnNlRnVuYykge1xyXG4gICAgdGhpcy5jdXJzZXMucHVzaChjdXJzZUZ1bmMpO1xyXG4gIH1cclxuXHJcbiAgLyphY3RpdmF0ZXMgYSByYW5kb20gY3Vyc2UqL1xyXG4gIHJhbmRvbUN1cnNlKC4uLnBhcmFtZXRlcikge1xyXG4gICAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmN1cnNlcy5sZW5ndGgpO1xyXG4gICAgLy8gdGhpcy5jdXJzZXNbaV0oLi4ucGFyYW1ldGVyKTtcclxuICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jdXJzZXNbaV0oLi4ucGFyYW1ldGVyKSwgWy4uLnBhcmFdKTtcclxuICB9XHJcblxyXG4gIC8qYWN0aXZhdGVzIGV2ZXJ5IGN1cnNlIGZ1bmN0aW9uIGluIHRoZSBjdXJzZSBhcnJheSBpbiB0aGUgZGVmYXVsdCBvcmRlciovXHJcbiAgZXhlY3V0ZUFsbEN1cnNlcyguLi5wYXJhKSB7XHJcbiAgICB0aGlzLmN1cnNlcy5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgLy9jdXJzZSguLi5wYXJhKTtcclxuICAgICAgdGhpcy5zZW5kTWVzc2FnZShjdXJzZSwgWy4uLnBhcmFdKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypBY3RpdmF0ZXMgdGhpcyBzdGFnZSBpZiBpdCdzIG5vdCBhY3RpdmF0ZWQuIFxyXG4gICAgT25seSBhY3RpdmF0ZWQgc3RhZ2VzIHRoYXQgY2FuIGhhdmUgaXRzIGN1cnNlcyBiZWluZyBhY3RpdmF0ZWQqL1xyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2YXRpb24pIHtcclxuICAgICAgdGhpcy5hY3RpdmF0aW9uID0gdHJ1ZTtcclxuICAgICAgdGhpcy5yYW5kb21BY3RpdmF0aW9uT3JkZXIoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qRGVhY3RpdmF0ZSB0aGlzIGN1cnJlbnQgc3RhZ2UqL1xyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qUmFuZG9taXplcyB0aGUgb3JkZXIgdG8gd2hpY2ggZWFjaCBjdXJzZSBmdW5jdGlvbiBpcyBjYWxsZWQuXHJcbiAgICBSZXN1bHQ6IGNyZWF0ZXMgYSBzZXQgb2YgcmFuZG9tIG51bWJlcnMuXHJcbiAgICBUaGUgbnVtYmVycyByZXByZXNlbnQgdGhlIHRpbWUgKGluIHNlY29uZHMpIHRoYXQgZWFjaCBjdXJzZSBnZXRzIGludm9rZWQuKi9cclxuICByYW5kb21BY3RpdmF0aW9uT3JkZXIoKSB7XHJcbiAgICB0aGlzLm9yZGVyID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmN1cnNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLm9yZGVyW2ldID0gdGhpcy5yYW5kb20odGhpcy5yYW5nZVswXSwgdGhpcy5yYW5nZVsxXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKlV0aWwgZnVuY3Rpb246IHJhbmRvbSovXHJcbiAgcmFuZG9tKG1pbiwgbWF4KSB7XHJcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxuXHJcbiAgLypIYXVudGVyIG9iamVjdCBjYWxscyB0aGlzIGZ1bmN0aW9uOlxyXG4gIElmKi9cclxuICBleGVjdXRlKHQpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2YXRpb24pIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5vcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0ID09PSB0aGlzLm9yZGVyW2ldKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yYW5kb21JbnZvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tQ3Vyc2UodGhpcy5pZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL3RoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdLCB0aGlzLmlkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VyckN1cnNlSW5kZXggPCB0aGlzLmN1cnNlcy5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgIHRoaXMuY3VyckN1cnNlSW5kZXgrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3RhZ2U7XHJcbiJdfQ==
