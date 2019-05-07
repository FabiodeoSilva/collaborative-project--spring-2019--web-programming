class BlackBG {
  constructor() {
    this.type = "dom";
  }

  init() {
    let body = document.querySelector("body");
    let a = document.querySelectorAll("a");
    body.style.background = "black";
   a.forEach((link)=>{
    link.style.color = "red";
   })
  }
}

module.exports = BlackBG;
