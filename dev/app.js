console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["sayhi", "cry", "why", "fry", "bye"];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, arr, false);
let dryStage = new Stage(2, 33, arr, true);

const haunter = new Haunter(33, [sayStage, cryStage, dryStage]);
haunter.init();
