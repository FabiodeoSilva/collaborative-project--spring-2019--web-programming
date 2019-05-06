class CurseHandler {
  constructor(curseArr) {
    this.curseArr = curseArr;
  }
  init() {
    this.listenForActivation();
  }
  listenForActivation() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.parseRequest(request);
    });
  }
  parseRequest(request) {
    let key = Object.keys(request);
    if (key[0] == `curse`) {
      this.curseArr.forEach(curse => {
        console.log(curse.name === request.curse, curse.name, request.curse);
        if (curse.name === request.curse) {
          console.log("curse activated", curse);
          curse();
        }
      });
    } else if (key[0] == `message`) {
      //console.log(request.message);
    }
  }
}

module.exports = CurseHandler;
