(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  function activateCursedImage() {
    let imgsArr = document.querySelectorAll("img");
    let bigImgs = [];
    imgsArr.forEach(img => {
      if (img.width > 50 && img.height > 50) bigImgs.push(img);
    });

    if (bigImgs.length > 3) {
      let cursedImg = bigImgs[random(2, bigImgs.length)];
      console.log(bigImgs, cursedImg);
      cursedImg.style.height = "auto";
      cursedImg.src =
        "https://vignette.wikia.nocookie.net/dreamworks/images/5/54/Rico03.png/revision/latest?cb=20150717211446";
    }
  }
  function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  activateCursedImage();
})();
