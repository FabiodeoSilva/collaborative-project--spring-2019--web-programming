const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");

let curseHandler = new CurseHandler([Swarm, sayhi, Blood]);
curseHandler.init();
