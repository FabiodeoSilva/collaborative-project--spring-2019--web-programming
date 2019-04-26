(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  let setupCanvas = () => {
    class Cursor {
      constructor(isMac, positionCoor, speeds, angles, s) {
        this.angleX = angles[0];
        this.angleY = angles[1];
        this.speedX = speeds[0];
        this.speedY = speeds[1];
        if (isMac) {
          console.log("ssss");
          this.cursorStroke = "white";
          this.cursorColor = "black";
        } else {
          this.cursorStroke = "black";
          this.cursorColor = "white";
        }
        this.update(positionCoor[0], positionCoor[1], s);
      }
      draw(s) {
        s.fill(this.cursorColor);
        s.stroke(this.cursorStroke);
        s.beginShape();
        this.vertices.forEach(coor => {
          s.vertex(coor[0], coor[1]);
        });
        s.endShape(s.CLOSE);
      }
      circle(s) {
        let px = s.sin(this.angleX) * 300 + s.mouseX;
        let py = s.cos(this.angleY) * 300 + s.mouseY;
        this.update(px, py, s);
        this.angleX += this.speedX;
        this.angleY += this.speedY;
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
      let macCursor, winCursor;
      let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;

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
        macCursor = new Cursor(true, [100, 100], [0.155, 0.08], [200, 400], s);
        c1 = new Cursor(true, [410, 100], [0.015, 0.081], [210, 400], s);
        c2 = new Cursor(true, [120, 120], [0.05, 0.04], [220, 310], s);
        c3 = new Cursor(true, [130, 330], [0.0135, 0.03], [230, 320], s);
        c4 = new Cursor(true, [140, 440], [0.0145, 0.04], [240, 330], s);
        c5 = new Cursor(true, [150, 550], [0.0155, 0.01], [250, 340], s);
        c6 = new Cursor(true, [160, 660], [0.01655, 0.02], [260, 450], s);
        c7 = new Cursor(true, [100, 770], [0.0175, 0.06], [270, 460], s);
        c8 = new Cursor(true, [100, 880], [0.0185, 0.07], [280, 470], s);
        c9 = new Cursor(true, [100, 99], [0.0195, 0.03], [290, 480], s);
        c10 = new Cursor(true, [100, 100], [0.25, 0.08], [200, 490], s);
        winCursor = new Cursor(false, [100, 100], [0.1, 0.1], [1, 1], s);
      };

      s.draw = () => {
        s.clear();
        // winCursor.update(s.cos(2 * i), 200, s);
        c1.circle(s);
        c2.circle(s);
        c3.circle(s);
        c4.circle(s);
        c5.circle(s);
        c6.circle(s);
        c7.circle(s);
        c8.circle(s);
        console.log("c1 ", c1);
        console.log("c2 ", c2);
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
