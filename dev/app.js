const Haunter = require("haunter");
const Stage = require("stage");

("using namespace");

let say = () => {
  console.log("say");
};
let cry = () => {
  console.log("cry");
};

let sayStage = new Stage(0, 10, [say, cry]);

const haunter = new Haunter(1, [sayStage]);
haunter.init();
