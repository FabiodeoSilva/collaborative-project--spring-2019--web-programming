(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["Swarm", "sayhi", "Blood", "Swarm", "Blood"];
let sayStage = new Stage(0, 100, arr, false);


const haunter = new Haunter(1*60, [sayStage]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L21vZGVsL2hhdW50ZXIuanMiLCJkZXYvbW9kZWwvc3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zb2xlLmxvZyhcImJhY2tncm91bmQgcnVubmluZ1wiKTtcclxuXHJcbmNvbnN0IEhhdW50ZXIgPSByZXF1aXJlKFwiLi9tb2RlbC9oYXVudGVyXCIpO1xyXG5jb25zdCBTdGFnZSA9IHJlcXVpcmUoXCIuL21vZGVsL3N0YWdlXCIpO1xyXG5cclxuKFwidXNpbmcgbmFtZXNwYWNlXCIpO1xyXG5cclxubGV0IGFyciA9IFtcIlN3YXJtXCIsIFwic2F5aGlcIiwgXCJCbG9vZFwiLCBcIlN3YXJtXCIsIFwiQmxvb2RcIl07XHJcbmxldCBzYXlTdGFnZSA9IG5ldyBTdGFnZSgwLCAxMDAsIGFyciwgZmFsc2UpO1xyXG5cclxuXHJcbmNvbnN0IGhhdW50ZXIgPSBuZXcgSGF1bnRlcigxKjYwLCBbc2F5U3RhZ2VdKTtcclxuaGF1bnRlci5pbml0KCk7XHJcbiIsImNsYXNzIEhhdW50ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG1heFNlY3MsIHN0YWdlcykge1xyXG4gICAgdGhpcy5zdGFnZXMgPSBzdGFnZXM7XHJcbiAgICB0aGlzLmN1cnJTdGFnZSA9IHRoaXMuc3RhZ2VzWzBdO1xyXG4gICAgdGhpcy5jdXJyU2VjcyA9IDA7XHJcbiAgICB0aGlzLm1heFNlY3MgPSBtYXhTZWNzO1xyXG4gICAgdGhpcy5jaGVja1N0YWdlVGltZUxpbWl0KCk7XHJcbiAgICB0aGlzLnNldFN0YWdlVGltZVJhbmdlKCk7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qU3RhcnQgVGltZXIgKi9cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5saXN0ZW5Gb3JBY3RpdmF0aW9uKCk7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24pe1xyXG4gICAgICB0aGlzLnNldFRpbWVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFjdGl2YXRlKCl7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSB0cnVlOyBcclxuICB9XHJcbiAgbGlzdGVuRm9yQWN0aXZhdGlvbigpe1xyXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZihyZXF1ZXN0LmluaXQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHJlcXVlc3QuaW5pdCA9PSBmYWxzZSl7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5raWxsVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKlNldHMgdGhlIGNsb2NrIG9uIHdoaWNoIHRoZSBleHRlbnNpb24gb3BlcmF0ZXMuICovXHJcbiAgc2V0VGltZXIoKSB7XHJcbiAgICB0aGlzLnRpbWVySUQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJTZWNzIDwgdGhpcy5tYXhTZWNzKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyU2VjcyArPSAxO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jdXJyU2Vjcyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvKmlmIHRoZSB0aW1lciBnZXRzIHRvIHRoZSBlbmQsIEtpbGwgdGltZXI6IEdhbWUgT3ZlciAqL1xyXG4gICAgICAgIHRoaXMua2lsbFRpbWVyKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgLypDaGVjayBpZiB0aGUgY3VycmVudCBTdGFnZSBoYXMgZW5kZWQuKi9cclxuICAgIHRoaXMuY2hlY2tDdXJyU3RhZ2UoKTtcclxuICAgIC8qRXhlY3V0ZXMgYWxsIGN1cnNlcyBvZiBhbGwgYWN0aXZhdGVkIHN0YWdlcy4qL1xyXG4gICAgdGhpcy5leGVjdXRlQWN0aXZhdGVkU3RhZ2VzKCk7XHJcbiAgfVxyXG5cclxuICAvKkNoZWNrcyBldmVyeSBzZWNvbmQgaWYgdGhlIGN1cnJlbnQgc3RhZ2UgaGFzIHJlYWNoZWQgdGhlIGVuZCBvZiBpdHMgZHVyYXRpb24gcmFuZ2UuIFxyXG4gIElmIGl0IGhhcyBlbmRlZCwgdGhlbiBhY3RpdmF0ZSB0aGUgbmV4dCBzdGFnZSBpbiBsaW5lLiovXHJcbiAgY2hlY2tDdXJyU3RhZ2UoKSB7XHJcbiAgICBsZXQgZXhjZXB0ID0gdGhpcy5zdGFnZXNbMF0ucmFuZ2VbMV07XHJcbiAgICBpZiAodGhpcy5jdXJyU2VjcyA9PT0gMSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlN0YWdlIFwiICsgdGhpcy5jdXJyU3RhZ2UuaWQgKyBcIjogYWN0aXZhdGVkXCIpO1xyXG4gICAgICB0aGlzLmN1cnJTdGFnZS5hY3RpdmF0ZSgpO1xyXG4gICAgfSBlbHNlIGlmIChcclxuICAgICAgdGhpcy5jdXJyU2VjcyA9PT0gZXhjZXB0IHx8XHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPT09IHRoaXMuY3VyclN0YWdlLnJhbmdlWzFdXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5uZXh0U3RhZ2UoKTtcclxuICAgICAgY29uc29sZS5sb2coXCJTdGFnZSBcIiArIHRoaXMuY3VyclN0YWdlLmlkICsgXCI6IGFjdGl2YXRlc1wiKTtcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UuYWN0aXZhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qU2V0cyB0aGUgcHJvcHJpZXR5IFwiY3VyclN0YWdlXCIgdG8gdGhlIG5leHQgc3RhZ2UgaW4gbGluZSovXHJcbiAgbmV4dFN0YWdlKCkge1xyXG4gICAgbGV0IGN1cnJTdGFnZUluZGV4ID0gdGhpcy5zdGFnZXMuaW5kZXhPZih0aGlzLmN1cnJTdGFnZSk7XHJcbiAgICBpZiAoY3VyclN0YWdlSW5kZXggPCB0aGlzLnN0YWdlcy5sZW5ndGggLSAxKVxyXG4gICAgICB0aGlzLmN1cnJTdGFnZSA9IHRoaXMuc3RhZ2VzW2N1cnJTdGFnZUluZGV4ICsgMV07XHJcbiAgfVxyXG5cclxuICAvKkV4ZWN1dGUgYWxsIGN1cnNlcyBvZiBhbGwgYWN0aXZhdGVkIHN0YWdlcyovXHJcbiAgZXhlY3V0ZUFjdGl2YXRlZFN0YWdlcygpIHtcclxuICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UgPT4ge1xyXG4gICAgICBpZiAoc3RhZ2UuYWN0aXZhdGlvbikge1xyXG4gICAgICAgIHN0YWdlLmV4ZWN1dGUodGhpcy5jdXJyU2Vjcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypEZXRlcm1pbmVzIGhvdyBsb25nIGVhY2ggU3RhZ2UgbW9kdWxlIHNob3VsZCBsYXN0IGJhc2VkIG9uIHRoZSBhbW91bnQgb2YgU3RhZ2VzIGxvYWRlZCBpbnRvIEhhdW50ZXIuXHJcbmUuZy4gSWYgMyBTdGFnZSBtb2R1bGVzIGFyZSBsb2FkZWQgaW50byBIYXVudGVyLCB0aGVuIGVhY2ggd2lsbCBsYXN0IDMzLjMlIG9mIHRoZSB0b3RhbCB0aW1lLlxyXG5SZXN1bHQ6IFVwZGF0ZXMgU3RhZ2UgbW9kdWxlcycgcHJvcHJpZXR5IFwicGVyY2VudFwiICovXHJcbiAgY2hlY2tTdGFnZVRpbWVMaW1pdCgpIHtcclxuICAgIGlmICh0aGlzLnN0YWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxldCB0b3RhbFBlcmNlbnQgPSAwO1xyXG4gICAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKHN0YWdlID0+IHtcclxuICAgICAgICB0b3RhbFBlcmNlbnQgKz0gc3RhZ2UucGVyY2VudDtcclxuXHJcbiAgICAgICAgLyppZiB0aGUgdG90YWwgdGltZSBsaW1pdCAoaW4gcGVyY2VudGFnZSkgZ2l2ZW4gYnkgdGhlIHVzZXIgc3VycGFzc2VzIDEwMCUsIHRoZW4gc3BsaXQgdGhlIHRvdGFsIHRpbWUgZXZlbmx5IGFtb25nIGVhY2ggc3RhZ2UqL1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJTdGFnZS5wZXJjZW50ID4gMTAwICYmIHRvdGFsUGVyY2VudCA+IDEwMCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgIGBUaGUgdG90YWwgdGltZSBsaW1pdCBmb3IgdGhlIHJ1biBkb2VzIG5vdCBhZGQgdXAgdG8gMTAwJTsgQWxsIHN0YWdlcyB3aWxsIGhhdmUgZXF1YWwgbGVuZ3Rocy5gXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgbGV0IG5ld1BlcmNlbnQgPSAoMSAvIHRoaXMuc3RhZ2VzLmxlbmd0aCkgKiAxMDA7XHJcbiAgICAgICAgICB0aGlzLnN0YWdlcy5mb3JFYWNoKHN0YWdlMiA9PiB7XHJcbiAgICAgICAgICAgIHN0YWdlMi5wZXJjZW50ID0gbmV3UGVyY2VudDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKkRldGVybWluZXMgdGhlIHJhbmdlIGluIHNlY29uZHMgdGhhdCBlYWNoIHN0YWdlIGJlZ2lucyBhbmQgZW5kcy5cclxuICAgICAgUmVzdWx0OiBQb3B1bGF0ZXMgU3RhZ2UgcHJvcHJpZXR5IFwicmFuZ2VcIiAqL1xyXG4gIHNldFN0YWdlVGltZVJhbmdlKCkge1xyXG4gICAgdGhpcy5zdGFnZXMuZm9yRWFjaCgoc3RhZ2UsIGkpID0+IHtcclxuICAgICAgbGV0IHN0YXJ0ID0gMCxcclxuICAgICAgICBlbmQgPSAwO1xyXG4gICAgICBpZiAoc3RhZ2UgPT0gdGhpcy5zdGFnZXNbMF0pIHtcclxuICAgICAgICBlbmQgPSBzdGFnZS5nZXRUaW1lTGVuZ3RoKHRoaXMubWF4U2Vjcyk7XHJcbiAgICAgICAgc3RhZ2UuZ2V0UmFuZ2UoW3N0YXJ0LCBlbmRdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzdGFydCA9IHRoaXMuc3RhZ2VzW2kgLSAxXS5yYW5nZVsxXTtcclxuICAgICAgICBlbmQgPSBzdGFydCArIHN0YWdlLmdldFRpbWVMZW5ndGgodGhpcy5tYXhTZWNzKTtcclxuICAgICAgICBzdGFnZS5nZXRSYW5nZShbc3RhcnQsIGVuZF0pO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YWdlLnJhbmdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypDaHJvbWUgRXh0ZW5zaW9uIE9ubHk6IFNlbmRzIG1lc3NhZ2VzIHRvIGNvbnRlbnQuanMgKi9cclxuICBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCB0YWJzID0+IHtcclxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgeyBtZXNzYWdlOiBtZXNzYWdlIH0sIHJlc3BvbnNlID0+IHt9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypTdG9wcyBUaW1lciovXHJcbiAga2lsbFRpbWVyKCkge1xyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySUQpO1xyXG4gICAgdGhpcy5jdXJyU2VjcyA9IDA7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhdW50ZXI7XHJcbiIsImNsYXNzIFN0YWdlIHtcclxuICBjb25zdHJ1Y3RvcihpZCwgdGltZUxlbmd0aFBlcmNlbnRhZ2UsIGN1cnNlcywgcmFuZG9tSW52b2NhdGlvbikge1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5wZXJjZW50ID0gdGltZUxlbmd0aFBlcmNlbnRhZ2U7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBmYWxzZTtcclxuICAgIHRoaXMuY3Vyc2VzID0gY3Vyc2VzO1xyXG4gICAgdGhpcy5jdXJyQ3Vyc2VJbmRleCA9IDA7XHJcbiAgICB0aGlzLnRyYW5zaXRpb247XHJcbiAgICB0aGlzLnJhbmdlID0gW107XHJcbiAgICB0aGlzLnJhbmRvbUludm9jYXRpb24gPSByYW5kb21JbnZvY2F0aW9uO1xyXG4gIH1cclxuXHJcbiAgLypDaHJvbWUgRXh0ZW5zaW9uIE9ubHk6IFNlbmRzIGN1cnNlIGFjdGl2YXRpb24gcmVxdWVzdHMgdG8gY29udGVudC5qcyAqL1xyXG4gIHNlbmRNZXNzYWdlKGN1cnNlLCBwYXJhbWVudGVyKSB7XHJcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCB0YWJzID0+IHtcclxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgdGFic1swXS5pZCxcclxuICAgICAgICB7IGN1cnNlOiBjdXJzZSwgcGFyYTogcGFyYW1lbnRlciB9LFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZSBzZW50IGZyb20gYmFja2dyb3VuZDpcIiwgY3Vyc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypyZXR1cm5zIHRoZSB0aW1lIChpbiBzZWNvbmRzKSB0byB3aGljaCB0aGlzIHN0YWdlIGVuZHMqL1xyXG4gIGdldFRpbWVMZW5ndGgobWF4U2Vjb25kcykge1xyXG4gICAgcmV0dXJuICh0aGlzLnRpbWUgPSBNYXRoLnJvdW5kKChtYXhTZWNvbmRzICogdGhpcy5wZXJjZW50KSAvIDEwMCkpO1xyXG4gIH1cclxuXHJcbiAgLypzZXRzIHRoaXMgc3RhZ2UncyBkdXJhdGlvbiByYW5nZSovXHJcbiAgZ2V0UmFuZ2UocmFuZ2VBcnIpIHtcclxuICAgIHRoaXMucmFuZ2UgPSByYW5nZUFycjtcclxuICB9XHJcblxyXG4gIC8qQWRkcyBjdXJzZXMgdG8gdGhlIGxpc3Qgb2YgY3Vyc2VzKi9cclxuICBhZGRDdXJzZShjdXJzZUZ1bmMpIHtcclxuICAgIHRoaXMuY3Vyc2VzLnB1c2goY3Vyc2VGdW5jKTtcclxuICB9XHJcblxyXG4gIC8qYWN0aXZhdGVzIGEgcmFuZG9tIGN1cnNlKi9cclxuICByYW5kb21DdXJzZSguLi5wYXJhbWV0ZXIpIHtcclxuICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jdXJzZXMubGVuZ3RoKTtcclxuICAgIC8vIHRoaXMuY3Vyc2VzW2ldKC4uLnBhcmFtZXRlcik7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlKHRoaXMuY3Vyc2VzW2ldKC4uLnBhcmFtZXRlciksIFsuLi5wYXJhXSk7XHJcbiAgfVxyXG5cclxuICAvKmFjdGl2YXRlcyBldmVyeSBjdXJzZSBmdW5jdGlvbiBpbiB0aGUgY3Vyc2UgYXJyYXkgaW4gdGhlIGRlZmF1bHQgb3JkZXIqL1xyXG4gIGV4ZWN1dGVBbGxDdXJzZXMoLi4ucGFyYSkge1xyXG4gICAgdGhpcy5jdXJzZXMuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgIC8vY3Vyc2UoLi4ucGFyYSk7XHJcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoY3Vyc2UsIFsuLi5wYXJhXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qQWN0aXZhdGVzIHRoaXMgc3RhZ2UgaWYgaXQncyBub3QgYWN0aXZhdGVkLiBcclxuICAgIE9ubHkgYWN0aXZhdGVkIHN0YWdlcyB0aGF0IGNhbiBoYXZlIGl0cyBjdXJzZXMgYmVpbmcgYWN0aXZhdGVkKi9cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmF0aW9uKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZhdGlvbiA9IHRydWU7XHJcbiAgICAgIHRoaXMucmFuZG9tQWN0aXZhdGlvbk9yZGVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKkRlYWN0aXZhdGUgdGhpcyBjdXJyZW50IHN0YWdlKi9cclxuICBkZWFjdGl2YXRlKCkge1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKlJhbmRvbWl6ZXMgdGhlIG9yZGVyIHRvIHdoaWNoIGVhY2ggY3Vyc2UgZnVuY3Rpb24gaXMgY2FsbGVkLlxyXG4gICAgUmVzdWx0OiBjcmVhdGVzIGEgc2V0IG9mIHJhbmRvbSBudW1iZXJzLlxyXG4gICAgVGhlIG51bWJlcnMgcmVwcmVzZW50IHRoZSB0aW1lIChpbiBzZWNvbmRzKSB0aGF0IGVhY2ggY3Vyc2UgZ2V0cyBpbnZva2VkLiovXHJcbiAgcmFuZG9tQWN0aXZhdGlvbk9yZGVyKCkge1xyXG4gICAgdGhpcy5vcmRlciA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5jdXJzZXMubGVuZ3RoLTE7IGkrKykge1xyXG4gICAgICB0aGlzLm9yZGVyW2ldID0gdGhpcy5yYW5kb20odGhpcy5yYW5nZVswXSwgdGhpcy5yYW5nZVsxXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKlV0aWwgZnVuY3Rpb246IHJhbmRvbSovXHJcbiAgcmFuZG9tKG1pbiwgbWF4KSB7XHJcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxuXHJcbiAgLypIYXVudGVyIG9iamVjdCBjYWxscyB0aGlzIGZ1bmN0aW9uOlxyXG4gIElmKi9cclxuICBleGVjdXRlKHQpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2YXRpb24pIHtcclxuICAgICAgaWYgKHRoaXMucmFuZG9tSW52b2NhdGlvbikge1xyXG4gICAgICAgIHRoaXMucmFuZG9tQ3Vyc2UodGhpcy5pZCk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMub3JkZXIubGVuZ3RoLTE7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHQgPT09IHRoaXMub3JkZXJbaV0pIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh0aGlzLmN1cnNlc1t0aGlzLmN1cnJDdXJzZUluZGV4XSwgdGhpcy5pZCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJDdXJzZUluZGV4IDwgdGhpcy5jdXJzZXMubGVuZ3RoIC0gMSkgdGhpcy5jdXJyQ3Vyc2VJbmRleCsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0LCB0aGlzLnJhbmdlLCB0aGlzLm9yZGVyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vKlxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLm9yZGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHQgPT09IHRoaXMub3JkZXJbaV0pIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJhbmRvbUludm9jYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21DdXJzZSh0aGlzLmlkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5jdXJzZXNbdGhpcy5jdXJyQ3Vyc2VJbmRleF0odGhpcy5pZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoZXJlJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBTdGFnZTtcclxuIl19
