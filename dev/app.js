const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let say = i => {
  console.log("say " + i);
};
let cry = i => {
  console.log("cry " + i);
};

let why = i => {
  console.log("why " + i);
};

let fry = i => {
  console.log("fry " + i);
};

let bye = i => {
  console.log("bye " + i);
};

let arr = [say, cry, why, fry, bye],
  brr = [say, cry, why, fry, bye],
  crr = [say, cry, why, fry, bye];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, brr, false);
let dryStage = new Stage(2, 33, crr, true);

const haunter = new Haunter(60, [sayStage, cryStage, dryStage]);
haunter.init();
