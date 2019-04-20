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
      console.log("Stage " + this.currStage.id + ": activated");
      this.currStage.executeAllCurses();
    } else if (
      this.currSecs === except ||
      this.currSecs === this.currStage.range[1]
    ) {
      this.nextStage();
      console.log("Stage " + this.currStage.id + ": activates");
      //this.currStage.executeAllCurses();
      this.currStage.randomCurse();
    }
  }

  update() {
    this.checkCurrStage();
    console.log(this.currSecs, this.currStage.id);
  }

  init() {
    //console.log(this.currStage.getTimeLength(this.maxSecs));
    this.setTimer();
  }
}

module.exports = Haunter;
