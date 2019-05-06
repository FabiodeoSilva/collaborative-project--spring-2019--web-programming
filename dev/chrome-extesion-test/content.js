(function() {
  let sayhi = () => {
    let body = document.querySelector("body");
    body.style.background = "pink";
  };
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message);
    if (request.message === "say") {
      sayhi();
    }
  });
})();
