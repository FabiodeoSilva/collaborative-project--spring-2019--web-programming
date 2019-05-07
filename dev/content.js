const CurseHandler = require("./model/CurseHandler.js");
const sayhi = require("./curses/test.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");
const CursedImg = require("./curses/cursed-image");
const Zalgo = require("./curses/zalgo");

let curseHandler = new CurseHandler(CursedImg, [sayhi]);
curseHandler.init();
curseHandler.persistentCurses();
