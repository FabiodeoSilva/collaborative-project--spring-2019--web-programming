console.log("background running");

function answer(response) {
  console.log(response);
}

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  sendResponse({ message: "puta" });
});

let x = 0;
setInterval(() => {
  console.log(x);
  x++;
}, 1000);
