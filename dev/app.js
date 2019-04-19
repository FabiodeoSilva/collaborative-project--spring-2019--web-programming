const Haunter = require("haunter");
const Stage = require("stage");

("using namespace");

let say = () => {
  console.log("say");
};
let cry = () => {
  console.log("cry");
};

let sayStage = new Stage(0, 50, [say, cry]);
let cryStage = new Stage(1, 50, [say, cry]);
let dryStage = new Stage(2, 50, [say, cry]);

const haunter = new Haunter(2, [sayStage, cryStage, dryStage]);
haunter.init();
