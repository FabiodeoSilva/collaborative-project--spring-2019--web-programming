(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  let setupCanvas = () => {
    let p5Canvas = s => {
      s.setup = () => {
        let h = document.body.clientHeight;
        c = s.createCanvas(s.windowWidth, s.windowHeight);
        c.position(0, 0);
        c.style("pointer-events", "none");
        c.style("position", "fixed");
        c.style("z-index", 999);
      };

      s.draw = () => {
        s.stroke("red");
        s.noFill();
      };

      s.mouseMoved = () => {
        s.clear();
        s.ellipse(s.mouseX, s.mouseY, 80);
      };
    };
    let myp5 = new p5(p5Canvas);
  };
  setupCanvas();

  let activateCursedImage = (imgUrl, destinationURL) => {
    let imgsArr = document.querySelectorAll("img");
    let bigImgs = [];
    imgsArr.forEach(img => {
      if (img.width > 50 && img.height > 50) bigImgs.push(img);
    });

    if (bigImgs.length > 3) {
      let cursedImg = bigImgs[random(2, bigImgs.length - 1)];
      console.log("cursed: " + cursedImg);
      cursedImg.style.height = "auto";
      cursedImg.src = imgUrl;
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

  /*activateCursedImage(
    "https://vignette.wikia.nocookie.net/dreamworks/images/5/54/Rico03.png/revision/latest?cb=20150717211446",
    "https://github.com/"
  );*/
})();
