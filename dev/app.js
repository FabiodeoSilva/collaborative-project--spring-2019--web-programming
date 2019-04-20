const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let say = () => {
  console.log("say");
};
let cry = () => {
  console.log("cry");
};

let why = () => {
  console.log("why");
};

let fry = () => {
  console.log("fry");
};

let bye = () => {
  console.log("bye");
};

let sayStage = new Stage(0, 50, [say, cry]);
let cryStage = new Stage(1, 50, [why, fry]);
let dryStage = new Stage(2, 50, [say, bye]);

const haunter = new Haunter(7 * 60, [sayStage, cryStage, dryStage]);
haunter.init();
