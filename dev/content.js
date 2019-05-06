const CurseHandler = require("./model/CurseHandler.js");
const test = require("./curses/test.js");

let curseHandler = new CurseHandler([test]);
curseHandler.init();
