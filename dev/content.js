const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");
const CursedImg = require("./curses/cursed-image");

let curseHandler = new CurseHandler(CursedImg, [Swarm, sayhi, Blood, Swarm, Blood]);
curseHandler.init();
