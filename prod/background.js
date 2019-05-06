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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L21vZGVsL2hhdW50ZXIuanMiLCJkZXYvbW9kZWwvc3RhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgSGF1bnRlciA9IHJlcXVpcmUoXCIuL21vZGVsL2hhdW50ZXJcIik7XHJcbmNvbnN0IFN0YWdlID0gcmVxdWlyZShcIi4vbW9kZWwvc3RhZ2VcIik7XHJcblxyXG4oXCJ1c2luZyBuYW1lc3BhY2VcIik7XHJcblxyXG5sZXQgc2F5ID0gaSA9PiB7XHJcbiAgY29uc29sZS5sb2coXCJzYXkgXCIgKyBpKTtcclxufTtcclxubGV0IGNyeSA9IGkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFwiY3J5IFwiICsgaSk7XHJcbn07XHJcblxyXG5sZXQgd2h5ID0gaSA9PiB7XHJcbiAgY29uc29sZS5sb2coXCJ3aHkgXCIgKyBpKTtcclxufTtcclxuXHJcbmxldCBmcnkgPSBpID0+IHtcclxuICBjb25zb2xlLmxvZyhcImZyeSBcIiArIGkpO1xyXG59O1xyXG5cclxubGV0IGJ5ZSA9IGkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFwiYnllIFwiICsgaSk7XHJcbn07XHJcblxyXG5sZXQgYXJyID0gW3NheSwgY3J5LCB3aHksIGZyeSwgYnllXSxcclxuICBicnIgPSBbc2F5LCBjcnksIHdoeSwgZnJ5LCBieWVdLFxyXG4gIGNyciA9IFtzYXksIGNyeSwgd2h5LCBmcnksIGJ5ZV07XHJcbmxldCBzYXlTdGFnZSA9IG5ldyBTdGFnZSgwLCAzMywgYXJyLCBmYWxzZSk7XHJcbmxldCBjcnlTdGFnZSA9IG5ldyBTdGFnZSgxLCAzMywgYnJyLCBmYWxzZSk7XHJcbmxldCBkcnlTdGFnZSA9IG5ldyBTdGFnZSgyLCAzMywgY3JyLCB0cnVlKTtcclxuXHJcbmNvbnN0IGhhdW50ZXIgPSBuZXcgSGF1bnRlcig2MCwgW3NheVN0YWdlLCBjcnlTdGFnZSwgZHJ5U3RhZ2VdKTtcclxuaGF1bnRlci5pbml0KCk7XHJcblxyXG5cclxuY29uc29sZS5sb2coXCJiYWNrZ3JvdW5kIHJ1bm5pbmdcIik7XHJcblxyXG4vKmZ1bmN0aW9uIGFuc3dlcihyZXNwb25zZSkge1xyXG4gIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxufVxyXG5cclxuY2hyb21lLmV4dGVuc2lvbi5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XHJcbiAgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbn0pO1xyXG5cclxubGV0IHggPSAwO1xyXG5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coeCk7XHJcbiAgeCsrO1xyXG59LCAxMDAwKTsqL1xyXG4iLCJjb25zdCBTdGFnZSA9IHJlcXVpcmUoXCIuL3N0YWdlXCIpO1xyXG5cclxuY2xhc3MgSGF1bnRlciB7XHJcbiAgY29uc3RydWN0b3IobWF4U2Vjcywgc3RhZ2VzKSB7XHJcbiAgICB0aGlzLnN0YWdlcyA9IHN0YWdlcztcclxuICAgIHRoaXMuY3VyclN0YWdlID0gdGhpcy5zdGFnZXNbMF07XHJcbiAgICB0aGlzLmN1cnJTZWNzID0gMDtcclxuICAgIHRoaXMubWF4U2VjcyA9IG1heFNlY3M7XHJcbiAgICB0aGlzLmNoZWNrU3RhZ2VUaW1lTGltaXQoKTtcclxuICAgIHRoaXMuc2V0U3RhZ2VUaW1lUmFuZ2UoKTtcclxuICB9XHJcblxyXG4gIGNoZWNrU3RhZ2VUaW1lTGltaXQoKSB7XHJcbiAgICBpZiAodGhpcy5zdGFnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgdG90YWxQZXJjZW50ID0gMDtcclxuXHJcbiAgICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UgPT4ge1xyXG4gICAgICAgIHRvdGFsUGVyY2VudCArPSBzdGFnZS5wZXJjZW50O1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJTdGFnZS5wZXJjZW50IDw9IDEwMCAmJiB0b3RhbFBlcmNlbnQgPD0gMTAwKSB7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICBgVGhlIHRvdGFsIHRpbWUgbGltaXQgZm9yIHRoZSBydW4gZG9lcyBub3QgYWRkIHVwIHRvIDEwMCU7IEFsbCBzdGFnZXMgd2lsbCBoYXZlIGVxdWFsIGxlbmd0aHMuYFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGxldCBuZXdQZXJjZW50ID0gKDEgLyB0aGlzLnN0YWdlcy5sZW5ndGgpICogMTAwO1xyXG4gICAgICAgICAgdGhpcy5zdGFnZXMuZm9yRWFjaChzdGFnZTIgPT4ge1xyXG4gICAgICAgICAgICBzdGFnZTIucGVyY2VudCA9IG5ld1BlcmNlbnQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZXRTdGFnZVRpbWVSYW5nZSgpIHtcclxuICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goKHN0YWdlLCBpKSA9PiB7XHJcbiAgICAgIGxldCBzdGFydCA9IDAsXHJcbiAgICAgICAgZW5kID0gMDtcclxuICAgICAgaWYgKHN0YWdlID09IHRoaXMuc3RhZ2VzWzBdKSB7XHJcbiAgICAgICAgZW5kID0gc3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpO1xyXG5cclxuICAgICAgICBzdGFnZS5nZXRSYW5nZShbc3RhcnQsIGVuZF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0YXJ0ID0gdGhpcy5zdGFnZXNbaSAtIDFdLnJhbmdlWzFdO1xyXG4gICAgICAgIGVuZCA9IHN0YXJ0ICsgc3RhZ2UuZ2V0VGltZUxlbmd0aCh0aGlzLm1heFNlY3MpO1xyXG5cclxuICAgICAgICBzdGFnZS5nZXRSYW5nZShbc3RhcnQsIGVuZF0pO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YWdlLnJhbmdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0VGltZXIoKSB7XHJcbiAgICB0aGlzLnRpbWVySUQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJTZWNzIDwgdGhpcy5tYXhTZWNzKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyU2VjcyArPSAxO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5raWxsVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICBraWxsVGltZXIoKSB7XHJcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJRCk7XHJcbiAgICB0aGlzLmN1cnJTZWNzID0gMDtcclxuICB9XHJcblxyXG4gIG5leHRTdGFnZSgpIHtcclxuICAgIGxldCBpID0gdGhpcy5zdGFnZXMuaW5kZXhPZih0aGlzLmN1cnJTdGFnZSk7XHJcbiAgICBpZiAoaSA8IHRoaXMuc3RhZ2VzLmxlbmd0aCAtIDEpIHRoaXMuY3VyclN0YWdlID0gdGhpcy5zdGFnZXNbaSArIDFdO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tDdXJyU3RhZ2UoKSB7XHJcbiAgICAvKiBpZiAoXHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPiB0aGlzLmN1cnJTdGFnZS5yYW5nZVswXSAmJlxyXG4gICAgICB0aGlzLmN1cnJTZWNzIDwgdGhpcy5jdXJyU3RhZ2UucmFuZ2VbMV1cclxuICAgICkge1xyXG4gICAgfSovXHJcbiAgICBsZXQgZXhjZXB0ID0gdGhpcy5zdGFnZXNbMF0ucmFuZ2VbMV07XHJcbiAgICBpZiAodGhpcy5jdXJyU2VjcyA9PT0gMSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBcIlN0YWdlIFwiICsgdGhpcy5jdXJyU3RhZ2UuaWQgKyBcIjogYWN0aXZhdGVkXCIsXHJcbiAgICAgICAgdGhpcy5jdXJyU3RhZ2Uub3JkZXJcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UuYWN0aXZhdGUoKTtcclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIHRoaXMuY3VyclNlY3MgPT09IGV4Y2VwdCB8fFxyXG4gICAgICB0aGlzLmN1cnJTZWNzID09PSB0aGlzLmN1cnJTdGFnZS5yYW5nZVsxXVxyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMubmV4dFN0YWdlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIFwiU3RhZ2UgXCIgKyB0aGlzLmN1cnJTdGFnZS5pZCArIFwiOiBhY3RpdmF0ZXNcIixcclxuICAgICAgICB0aGlzLmN1cnJTdGFnZS5vcmRlclxyXG4gICAgICApO1xyXG4gICAgICAvL3RoaXMuY3VyclN0YWdlLmV4ZWN1dGVBbGxDdXJzZXMoKTtcclxuICAgICAgdGhpcy5jdXJyU3RhZ2UuYWN0aXZhdGUoKTtcclxuICAgIH1cclxuICB9XHJcbiAgZXhlY3V0ZUFjdGl2YXRlZFN0YWdlcygpIHtcclxuICAgIHRoaXMuc3RhZ2VzLmZvckVhY2goc3RhZ2UgPT4ge1xyXG4gICAgICBpZiAoc3RhZ2UuYWN0aXZhdGlvbikge1xyXG4gICAgICAgIHN0YWdlLmV4ZWN1dGUodGhpcy5jdXJyU2Vjcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5jaGVja0N1cnJTdGFnZSgpO1xyXG4gICAgdGhpcy5leGVjdXRlQWN0aXZhdGVkU3RhZ2VzKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJTZWNzLCB0aGlzLmN1cnJTdGFnZS5pZCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmN1cnJTdGFnZS5nZXRUaW1lTGVuZ3RoKHRoaXMubWF4U2VjcykpO1xyXG4gICAgdGhpcy5zZXRUaW1lcigpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXVudGVyO1xyXG4iLCJjbGFzcyBTdGFnZSB7XHJcbiAgY29uc3RydWN0b3IoaWQsIHRpbWVMZW5ndGhQZXJjZW50YWdlLCBjdXJzZXMsIHJhbmRvbUludm9jYXRpb24pIHtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMucGVyY2VudCA9IHRpbWVMZW5ndGhQZXJjZW50YWdlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gZmFsc2U7XHJcbiAgICB0aGlzLmN1cnNlcyA9IGN1cnNlcztcclxuICAgIHRoaXMuY3VyckN1cnNlSW5kZXggPSAwO1xyXG4gICAgdGhpcy50cmFuc2l0aW9uO1xyXG4gICAgdGhpcy5yYW5nZSA9IFtdO1xyXG4gICAgdGhpcy5yYW5kb21JbnZvY2F0aW9uID0gcmFuZG9tSW52b2NhdGlvbjtcclxuICB9XHJcbiAgZ2V0VGltZUxlbmd0aChtYXhTZWNvbmRzKSB7XHJcbiAgICByZXR1cm4gKHRoaXMudGltZSA9IE1hdGgucm91bmQoKG1heFNlY29uZHMgKiB0aGlzLnBlcmNlbnQpIC8gMTAwKSk7XHJcbiAgfVxyXG4gIGdldFJhbmdlKHJhbmdlQXJyKSB7XHJcbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VBcnI7XHJcbiAgfVxyXG4gIGFkZEN1cnNlKGN1cnNlRnVuYykge1xyXG4gICAgdGhpcy5jdXJzZXMucHVzaChjdXJzZUZ1bmMpO1xyXG4gIH1cclxuICBleGVjdXRlQWxsQ3Vyc2VzKCkge1xyXG4gICAgdGhpcy5jdXJzZXMuZm9yRWFjaChjdXJzZSA9PiB7XHJcbiAgICAgIGN1cnNlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmFuZG9tQ3Vyc2UoLi4ucGFyYW1ldGVyKSB7XHJcbiAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY3Vyc2VzLmxlbmd0aCk7XHJcbiAgICB0aGlzLmN1cnNlc1tpXSguLi5wYXJhbWV0ZXIpO1xyXG4gIH1cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmF0aW9uKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZhdGlvbiA9IHRydWU7XHJcbiAgICAgIHRoaXMucmFuZG9tQWN0aXZhdGlvbk9yZGVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBmYWxzZTtcclxuICB9XHJcbiAgZXhlY3V0ZUFsbEN1cnNlc0F0T25jZSguLi5wYXJhKSB7XHJcbiAgICB0aGlzLmN1cnNlcy5mb3JFYWNoKGN1cnNlID0+IHtcclxuICAgICAgY3Vyc2UoLi4ucGFyYSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmFuZG9tQWN0aXZhdGlvbk9yZGVyKCkge1xyXG4gICAgdGhpcy5vcmRlciA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5jdXJzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5vcmRlcltpXSA9IHRoaXMucmFuZG9tKHRoaXMucmFuZ2VbMF0sIHRoaXMucmFuZ2VbMV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByYW5kb20obWluLCBtYXgpIHtcclxuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xyXG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgfVxyXG4gIGV4ZWN1dGUodCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZhdGlvbikge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLm9yZGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHQgPT09IHRoaXMub3JkZXJbaV0pIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJhbmRvbUludm9jYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21DdXJzZSh0aGlzLmlkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3Vyc2VzW3RoaXMuY3VyckN1cnNlSW5kZXhdKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyQ3Vyc2VJbmRleCA8IHRoaXMuY3Vyc2VzLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyQ3Vyc2VJbmRleCsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdGFnZTtcclxuIl19
