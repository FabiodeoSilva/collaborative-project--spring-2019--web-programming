class CurseHandler {
  constructor(curseArr) {
    this.curseArr = curseArr;
  }
  init() {
    this.listenForActivation();
    this.curseArr[0]();
  }
  listenForActivation() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request);
    });
  }
}

module.exports = CurseHandler;
