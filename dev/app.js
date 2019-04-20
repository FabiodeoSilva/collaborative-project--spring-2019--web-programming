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

let arr = [say, cry],
  brr = [why, fry],
  crr = [say, bye];
let sayStage = new Stage(0, 50, arr);
let cryStage = new Stage(1, 50, brr);
let dryStage = new Stage(2, 50, crr);

const haunter = new Haunter(30, [sayStage, cryStage, dryStage]);
haunter.init();
