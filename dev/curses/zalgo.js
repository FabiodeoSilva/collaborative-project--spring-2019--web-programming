class Zalgo{
    constructor(){
        this.type = "dom";

    }
    init(){
        this.zalgofy("a");
    }
    zalgofy(querySelectorTarget){
        let elems = document.querySelectorAll(querySelectorTarget);
        let elemArr;
        elems.forEach((elem)=>{
            let elemArr = elem.innerHTML.split(" ");
            
            let weirdWord = "";
    
            elemArr.forEach(word => {
              weirdWord += this.zalgoText(word);
            });
        
            elem.innerHTML = weirdWord;
        })
    
    };

    zalgoText(word){
        let retWord = [],
          weirdChar;
    
        [...word].forEach(char => {
          let r = this.random(0, 30),
            weirdChar = "";
    
          for (let i = 0; i <= r; i++) {
            weirdChar += `&#${this.random(768, 879)};`;
          }
    
          char += weirdChar;
          retWord.push(char);
        });
    
        return retWord.join("");
      };

    getRndBias(min, max, bias, influence){
        let rnd = Math.random() * (max - min) + min, // random in range
          mix = Math.random() * influence; // random mixer
        return rnd * (1 - mix) + bias * mix; // mix full range and bias
    };

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
}
    
module.exports = Zalgo;