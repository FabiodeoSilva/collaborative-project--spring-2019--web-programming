console.log("background running");

const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["sayhi"];
let sayStage = new Stage(0, 100, arr, false);


const haunter = new Haunter(1*20, [sayStage]);
haunter.init();
