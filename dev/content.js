const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const blood = require("./curses/bloodyScreen");

let curseHandler = new CurseHandler([blood, sayhi]);
curseHandler.init();
