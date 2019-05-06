(function() {
  
  // 
  /* check out google.com for example */

  /*chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });*/

  let sayhi = () => {
    let body = document.querySelector("body");
    body.style.background = "pink";
  }
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log(request.message);
      if(request.message === "say"){
        sayhi();
      }

    });

    let activateCursedImage = (imgUrl, destinationURL) => {
    let imgsArr = document.querySelectorAll("img");
    let bigImgs = [];
    imgsArr.forEach(img => {
      if (img.width > 50 && img.height > 50) bigImgs.push(img);
    });

    let eyes = document.createElement("img");
    eyes.style.position = "absolute";
    eyes.src = chrome.runtime.getURL("media/gorleyes_2.png");

    if (bigImgs.length > 3) {
      let cursedImg = bigImgs[random(2, bigImgs.length - 1)];
      console.log(
        cursedImg,
        window.getComputedStyle(cursedImg.parentNode).width,
        window.getComputedStyle(cursedImg.parentNode).height
      );
      let frame = document.createElement("div");
      frame.style.width = window.getComputedStyle(cursedImg.parentNode).width;
      frame.style.height = window.getComputedStyle(cursedImg.parentNode).height;
      frame.style.position = "absolute";
      frame.style.top = "0px";
      frame.style.zIndex = "2";
      frame.style.backgroundPosition = "top center";
      frame.style.backgroundImage = `url('${chrome.runtime.getURL(
        "media/gorleyes_1.png"
      )}')`;
      frame.style.backgroundRepeat = "no-repeat";
      frame.style.backgroundSize = "contain";
      cursedImg.parentNode.style.position = "relative";
      cursedImg.parentNode.append(frame);
      eyes.style.width = `calc(${frame.style.width}/2.2)`;
      eyes.style.top = `calc(${frame.style.height}/4.5)`;
      eyes.style.left = `calc(${frame.style.width}/3.5)`;
      cursedImg.parentNode.append(eyes);
      if (cursedImg.srcset) cursedImg.removeAttribute("srcset");
      if (cursedImg.parentElement.tagName === "A") {
        cursedImg.parentElement.href = destinationURL;
      }
      cursedImg.parentElement.addEventListener("click", () => {
        window.location.href = destinationURL;
      });

      body.addEventListener("mousemove", e => {
        eyes.style.transform = `translate(${e.clientX /
          (window.innerWidth / 5)}px, ${e.clientY /
          (window.innerHeight / 5)}px)`;
        console.log(e.clientX / (window.innerWidth / 5));
      });
    }
  };
  function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*activateCursedImage(
    chrome.runtime.getURL("uncompressed-images/gorleyes_1.png"),
    "https://github.com/"
  );*/
})();
