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
