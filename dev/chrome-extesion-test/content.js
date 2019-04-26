(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  let setupCanvas = () => {
    class Cursor {
      constructor(type, positionCoor, speed, s) {
        this.type = type;
        this.speed = speed;
        this.update(positionCoor[0], positionCoor[1], s);
      }
      draw(s) {
        s.clear();
        s.fill("black");
        s.stroke("white");
        s.beginShape();
        this.vertices.forEach(coor => {
          s.vertex(coor[0], coor[1]);
        });
        s.endShape(s.CLOSE);
      }
      update(x, y, s) {
        this.vertices = [
          [x, y],
          [x, y + 16],
          [x + 3.96, y + 12.6],
          [x + 7.5, y + 21.43],
          [x + 10, y + 20.1],
          [x + 6.7, y + 12],
          [x + 12.2, y + 12]
        ];
        this.draw(s);
      }
    }

    let p5Canvas = s => {
      let macCursor,
        winCursor,
        i = 1;

      /*s.preload = () => {
        macCursor = s.loadImage("media/mac-cursor.png");
        winCursor = s.loadImage(
          "http://box5768.temp.domains/~fabiosil/wp-content/uploads/2019/04/windows-cursor.png"
        );
      };*/

      s.setup = () => {
        let h = document.body.clientHeight;
        c = s.createCanvas(s.windowWidth, s.windowHeight);
        c.position(0, 0);
        c.style("pointer-events", "none");
        c.style("position", "fixed");
        c.style("z-index", 999);
        // s.image(macCursor, 100, 100);
        macCursor = new Cursor("mac", [100, 100], 100, s);
      };

      s.draw = () => {
        macCursor.update(i, i * 2, s);
        i++;
      };

      s.mouseMoved = () => {
        //s.image(macCursor, s.mouseX - 5, s.mouseY - 10);
      };
    };
    let myp5 = new p5(p5Canvas);
  };

  let cursorSwarm = amount => {};
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
