(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let say = i => {
  console.log("say " + i);
};
let cry = i => {
  console.log("cry " + i);
};

let why = i => {
  console.log("why " + i);
};

let fry = i => {
  console.log("fry " + i);
};

let bye = i => {
  console.log("bye " + i);
};

let arr = [say, cry, why, fry, bye],
  brr = [say, cry, why, fry, bye],
  crr = [say, cry, why, fry, bye];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, brr, false);
let dryStage = new Stage(2, 33, crr, true);

const haunter = new Haunter(60, [sayStage, cryStage, dryStage]);
haunter.init();

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
    this.curses[i](...parameter);
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
      curse(...para);
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
            this.curses[this.currCurseIndex](this.id);
            if (this.currCurseIndex < this.curses.length - 1)
              this.currCurseIndex++;
          }
        }
      }
    }
  }
}

module.exports = Stage;

},{}]},{},[1]);
