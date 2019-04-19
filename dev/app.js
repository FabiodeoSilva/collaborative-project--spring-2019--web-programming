(function() {
  "using namespace";

  class Haunter {
    constructor() {
      this.modules = [];
      this.currModule = 0;
      this.timer = 0;
    }

    setTimer(maxMinutes) {
      let maxSeconds = maxMinutes * 60 * 1000;

      this.timerID = setInterval(() => {
        if (this.timer < maxSeconds) {
          this.timer += 1;
          this.update();
        } else {
          this.killTimer();
        }
      }, 1000);
    }

    killTimer() {
      clearInterval(this.timerID);
      this.timer = 0;
    }

    init() {
      this.setTimer(7);
    }

    checkCurrStage() {
      let time = this.timer;
      if (time > 1 && time <= 3) {
        console.log("stage 1");
      } else if (time > 3 && time <= 6) {
        console.log("stage 2");
      } else if (time > 6 && time <= 9) {
        console.log("stage 3");
      }
    }

    update() {
      this.checkCurrStage();
      console.log(this.timer);
    }
  }

  const haunter = new Haunter();
  haunter.init();
})();
