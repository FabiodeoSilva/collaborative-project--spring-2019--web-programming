class Cursor {
  constructor(positionCoor, speeds, angles, amplitude, s) {
    this.amplitude = amplitude;
    this.angleX = angles[0];
    this.angleY = angles[1];
    this.speedX = speeds[0];
    this.speedY = speeds[1];

    if (true) {
          this.cursorStroke = "white";
          this.cursorColor = "black";
    } else {
          this.cursorStroke = "black";
          this.cursorColor = "white";
    }
    this.update(positionCoor[0], positionCoor[1], s);
  }

  trace(s) {
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
    this.trace(s);
  }

  random(min, max, decimal = false) {
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

  swarmRandom(s) {
    this.swarmArr.forEach(cursor => {
      cursor.cricle(s);
    });
  }
}

class Swarm{
  constructor(s){
    this.type = 'canvas';
    this.swarmArr = [];
    this.init(s);
  }

  init(s){
    let temp,
    positionCoor = [],
    speeds = [],
    angles = [],
    r,
    amount = 300, 
    amplitude;

    for (let i = 0; i < amount; i++) {

      positionCoor = [0, 0];
      speeds = [
        Math.abs(this.random(0, 0.2, true) / 50),
        Math.abs(this.random(0, 0.2, true) / 50)
      ];
      angles = [0, 0];
      amplitude = this.random(20, 1000);
      temp = new Cursor(positionCoor, speeds, angles, amplitude, s);
      this.swarmArr.push(temp);
    }
  }
  random(min, max, decimal = false) {
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
  draw(s){
    s.push();
    s.clear();
    this.swarmArr.forEach((cursor)=>{
      cursor.circle(s);
    });
    s.pop();
  }
}

module.exports = Cursor;
module.exports = Swarm;

