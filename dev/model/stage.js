class Stage {
  constructor(id, percent, curses) {
    this.id = id;
    this.percent = percent;
    this.activation = false;
    this.curses = curses;
    this.transition;
    this.range = [];
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
  randomCurse() {
    let i = Math.floor(Math.random() * this.curses.length);
    this.curses[i]();
  }
  say(t) {
    console.log(this.getTimeLength(t));
  }
}

module.exports = Stage;
