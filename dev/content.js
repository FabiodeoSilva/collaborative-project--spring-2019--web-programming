const CurseHandler = require("./model/CurseHandler.js");
const BlackBG = require("./curses/BlackBG.js");
const Blood = require("./curses/bloodyScreen");
const Swarm = require("./curses/cursorSwarm");
const CursedImg = require("./curses/cursed-image");
const Zalgo = require("./curses/zalgo");

let curseHandler = new CurseHandler(CursedImg, [BlackBG, Zalgo, Blood, Swarm]);
curseHandler.init();
curseHandler.persistentCurses();
