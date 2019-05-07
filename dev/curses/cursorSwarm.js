class Cursor {
  constructor(s) {
      let positionCoor = [120, 120],
        speeds= [0.06, 0.091],
        angles= [0, 0],
        amplitude= 300;
        this.amplitude = amplitude;
        this.angleX = angles[0];
        this.angleY = angles[1];
        this.speedX = speeds[0];
        this.speedY = speeds[1];
        this.swarmArr = [];

        if (true) {
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
        let px = s.sin(this.angleX) * this.amplitude + s.windowWidth / 2;
        let py = s.cos(this.angleY) * this.amplitude + s.windowHeight / 2;
        this.update(px, py, s);
        this.angleX += this.speedX;
        this.angleY += this.speedY;
      }

      update(x, y, s) {
        let prop = 13;
        this.vertices = [
          [x, y],
          [x, y + 167 / prop],
          [x + 39 / prop, y + 129 / prop],
          [x + 75 / prop, y + 214 / prop],
          [x + 100 / prop, y + 201 / prop],
          [x + 66 / prop, y + 115 / prop],
          [x + 122 / prop, y + 115 / prop]
        ];
        this.draw(s);
      }

      static swarm(amount, s) {
        this.swarmArr = [];
        let temp,
          positionCoor = [],
          speeds = [],
          angles = [],
          r,
          amplitude;
        for (let i = 0; i < amount; i++) {
          positionCoor = [0, 0];

          speeds = [
            Math.abs(random(0, 0.2, true) / 50),
            Math.abs(random(0, 0.2, true) / 50)
          ];
          console.log(speeds);
          angles = [0, 0];
          amplitude = random(20, 1000);
          temp = new Cursor(positionCoor, speeds, angles, amplitude, s);
          this.swarmArr.push(temp);
        }
        return this.swarmArr;
      }

      swarmRandom(s) {
        this.swarmArr.forEach(cursor => {
          cursor.cricle(s);
        });
      }
    }


      s.setup = () => {
        let h = document.body.clientHeight;
        c = s.createCanvas(s.windowWidth, s.windowHeight);
        c.position(0, 0);
        c.style("pointer-events", "none");
        c.style("position", "fixed");
        c.style("z-index", 999);
        macCursor = new Cursor(
          [100, 100],
          [0.155, 0.08],
          [200, 400],
          300,
          s
        );

        c1 = Cursor.swarm(300, true, s);

        c2 = new Cursor(true, , s);

        /*c1 = new Cursor(true, [410, 100], [0.015, 0.081], [210, 400], 200, s);
        c2 = new Cursor(true, [120, 120], [0.05, 0.04], [220, 310], 10, s);
        c3 = new Cursor(true, [130, 330], [0.0135, 0.03], [230, 320], 600, s);
        c4 = new Cursor(true, [140, 440], [0.0145, 0.04], [240, 330], 700, s);
        c5 = new Cursor(true, [150, 550], [0.0155, 0.01], [250, 340], 800, s);
        c6 = new Cursor(true, [160, 660], [0.01655, 0.02], [260, 450], 200, s);
        c7 = new Cursor(true, [100, 770], [0.0175, 0.06], [270, 460], 900, s);
        c8 = new Cursor(true, [100, 880], [0.0185, 0.07], [280, 470], 100, s);
        c9 = new Cursor(true, [100, 99], [0.0195, 0.03], [290, 480], 330, s);
        c10 = new Cursor(true, [100, 100], [0.25, 0.08], [200, 490], 440, s);
        winCursor = new Cursor(false, [100, 100], [0.1, 0.1], [1, 1], 550, s);*/
      };

      s.draw = () => {
        s.clear();
        c1.forEach(cursor => {
          cursor.circle(s);
        });
        c2.circle(s);
        // winCursor.update(s.cos(2 * i), 200, s);
        /*c1.circle(s);
        c2.circle(s);
        c3.circle(s);
        c4.circle(s);
        c5.circle(s);
        c6.circle(s);
        c7.circle(s);
        c8.circle(s);
        console.log("c1 ", c1);
        console.log("c2 ", c2);*/

        document.querySelector("input, button, a").style.cursor = "initial";
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


