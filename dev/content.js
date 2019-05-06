const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");

let curseHandler = new CurseHandler([sayhi]);
curseHandler.init();
