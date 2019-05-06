const Haunter = require("./model/haunter");
const Stage = require("./model/stage");

("using namespace");

let arr = ["say", "cry", "why","fry", "bye"];
let sayStage = new Stage(0, 33, arr, false);
let cryStage = new Stage(1, 33, arr, false);
let dryStage = new Stage(2, 33, arr, true);

const haunter = new Haunter(30, [sayStage, cryStage, dryStage]);
haunter.init();


console.log("background running");

/*function answer(response) {
  console.log(response);
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
});

let x = 0;
setInterval(() => {
  console.log(x);
  x++;
}, 1000);*/
