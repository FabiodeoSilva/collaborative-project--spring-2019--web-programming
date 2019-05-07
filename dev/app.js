console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["Swarm", "sayhi", "Blood", "Swarm", "Blood"];
let sayStage = new Stage(0, 100, arr, false);


const haunter = new Haunter(1*60, [sayStage]);
haunter.init();
