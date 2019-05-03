console.log("background running");

function answer(response) {
  console.log(response);
}

/*chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
});

let x = 0;
setInterval(() => {
  console.log(x);
  x++;
}, 1000);*/

chrome.tabs.create(
  { index: 0, url: "https://google.com", active: true },
  () => {}
);
/*chrome.tabs.query({ active: false }, tabs => {
  tabs.forEach(tab => {
    if (!tab.url.includes(`youtube`) && !tab.url.includes(`chrome`))
      chrome.tabs.remove(tab.id);
  });
});*/

chrome.tabs.query({ active: false }, tabs => {
  tabs.forEach(tab => {
    if (tab.url.includes(`encrypted`)) {
      let i = 0;
      setInterval(() => {
        chrome.tabs.move(tab.id, { index: i }, t => {});
        if (i <= tabs.length - 1) i++;
        else i = 0;
      }, 1000);
    }
  });
});
