(function() {
  let body = document.querySelector("body");
  // body.style.background = "pink";
  /* check out google.com for example */

  chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response);
  });

  let setupCanvas = () => {
    let yPos;
    let bloodScreenRandom = (s, beat) => {
      s.stroke(s.color(random(100, 255), 0, 0));
      for (let i = 0; i <= s.width; i++) {
        if (beat <= s.height) yPos = random(0, beat);
        else yPos = random(0, s.height);
        s.point(i, yPos);
      }
    };

    let getRndBias = (min, max, bias, influence) => {
      let rnd = Math.random() * (max - min) + min, // random in range
        mix = Math.random() * influence; // random mixer
      return rnd * (1 - mix) + bias * mix; // mix full range and bias
    };

    class BloodDrop {
      constructor(xPos) {}
      draw(s) {}
    }
    class Blood {
      constructor(s) {
        this.bloodArr = [];
        this.setup(s);
      }
      setup(s) {
        for (let i = 0; i <= s.width; i++) {
          this.bloodArr.push({
            xPos: i,
            yPos: 0,
            red: Math.floor(random(155, 255)),
            SpeedRate: 1 / getRndBias(1, 10, 5, 1)
          });
        }
      }
      draw(s) {
        this.bloodArr.forEach(drop => {
          s.stroke(s.color(drop.red, 0, 0));
          s.point(drop.xPos, drop.yPos);
          if (drop.yPos <= s.height) drop.yPos += drop.SpeedRate;
        });
      }
    }

    let p5Canvas = s => {
      let macCursor, winCursor;
      let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, swarm;

      /*s.preload = () => {
        macCursor = s.loadImage("media/mac-cursor.png");
        winCursor = s.loadImage(
          "http://box5768.temp.domains/~fabiosil/wp-content/uploads/2019/04/windows-cursor.png"
        );
      };*/
      let beat = 0;
      let blood;
      s.setup = () => {
        let h = document.body.clientHeight;
        c = s.createCanvas(s.windowWidth, s.windowHeight);
        c.position(0, 0);
        c.style("pointer-events", "none");
        c.style("position", "fixed");
        c.style("z-index", 999);
        blood = new Blood(s);
      };

      s.draw = () => {
        blood.draw(s);
        beat++;
      };

      s.mouseMoved = () => {
        //s.image(macCursor, s.mouseX - 5, s.mouseY - 10);
      };
    };

    let myp5 = new p5(p5Canvas);
  };

  setupCanvas();

  function random(min, max, decimal = false) {
    if (!decimal) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      min = min;
      max = max;
      return Math.random() * (max - min + 1) + min;
    }
  }

  /*activateCursedImage(
    "https://vignette.wikia.nocookie.net/dreamworks/images/5/54/Rico03.png/revision/latest?cb=20150717211446",
    "https://github.com/"
  );*/
})();
