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

/*chrome.tabs.query({ active: false }, tabs => {
  tabs.forEach(tab => {
    if (tab.url.includes(`encrypted`)) {
      let i = 0;
      setInterval(() => {
        chrome.tabs.move(tab.id, { index: i }, t => {});
        if (i <= tabs.length - 1) i++;
        else i = 0;
      }, 100);
    }
  });
});*/
console.log(window.innerWidth);
/*chrome.windows.create(
  {
    url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR40ex4eo90Rze0GShebE-pZ7YcLTxmVFspfiyd6P_0ES0OD_YQ",
    width: 600,
    height: 600,
    focused: true,
    top: 0,
    left: 0
  },
  t => {
    console.log(t);
  }
);*/

let winds = [
  { width: 600, height: 600, top: 0, left: 0 },
  { width: 600, height: 600, top: 0, left: 600 },
  { width: 600, height: 600, top: 600, left: 600 },
  { width: 600, height: 600, top: 600, left: 0 }
];

let openTabs = amount => {
  let i = -1;

  let interval = setInterval(() => {
    console.log(i, winds.length - 1, i <= winds.length - 1);
    if (i <= winds.length - 1) i++;
    else {
      i = 0;
      console.log("here");
      //clearInterval(interval);
    }

    chrome.windows.create(
      {
        url:
          "https://cdn.shopify.com/s/files/1/1366/7699/files/Screen_Shot_2016-07-06_at_8.21.31_PM_large.png?306252872194508442",
        width: 600,
        height: 600,
        focused: true,
        top: winds[i].top,
        left: winds[i].left
      },
      w => {
        setTimeout(() => {
          chrome.windows.remove(w.id);
        }, 200);
      }
    );
  }, 200);
};
openTabs();
