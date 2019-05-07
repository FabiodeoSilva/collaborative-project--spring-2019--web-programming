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
