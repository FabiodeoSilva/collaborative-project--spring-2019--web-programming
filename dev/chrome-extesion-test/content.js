(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  let activateCursedImage = (imgUrl, destinationURL) => {
    let imgsArr = document.querySelectorAll("img");
    let bigImgs = [];
    imgsArr.forEach(img => {
      if (img.width > 50 && img.height > 50) bigImgs.push(img);
    });

    let eyes = document.createElement("img");
    eyes.style.position = "absolute";
    eyes.style.zIndex = "-1";
    eyes.style.width = "55%";
    eyes.style.top = "56px";
    eyes.style.left = "43px";
    eyes.src = chrome.runtime.getURL("uncompressed-images/gorleyes_2.png");

    if (bigImgs.length > 3) {
      let cursedImg = bigImgs[random(2, bigImgs.length - 1)];
      console.log("cursed: " + cursedImg);
      cursedImg.style.height = "auto";
      cursedImg.src = imgUrl;
      cursedImg.parentNode.append(eyes);
      if (cursedImg.srcset) cursedImg.removeAttribute("srcset");
      if (cursedImg.parentElement.tagName === "A") {
        cursedImg.parentElement.href = destinationURL;
      }
      cursedImg.parentElement.addEventListener("click", () => {
        window.location.href = destinationURL;
      });
    }
  };
  function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  activateCursedImage(
    chrome.runtime.getURL("uncompressed-images/gorleyes_1.png"),
    "https://github.com/"
  );
})();
