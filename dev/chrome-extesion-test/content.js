(function() {
  let body = document.querySelector("body");

  let getRndBias = (min, max, bias, influence) => {
    let rnd = Math.random() * (max - min) + min, // random in range
      mix = Math.random() * influence; // random mixer
    return rnd * (1 - mix) + bias * mix; // mix full range and bias
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

  let zalgofy = () => {
    let title = document.querySelector("h1");
    let titleArr = title.innerHTML.split(" ");
    let retWord = [],
      retH1 = [];
    titleArr.forEach(word => {
      [...word].forEach(char => {
        let r = random(0, 30),
          weird = "";

        for (let i = 0; i <= r; i++) {
          weird += `&#${random(768, 879)};`;
        }

        char += weird;
        retWord.push(char);
      });
      console.log(retH1);
      retH1.push(retWord.join(""));
      retWord = [];
    });

    title.innerHTML = retH1.flat().join(" ");
  };

  let zalgoText = word => {
    let retWord = [],
      weirdChar;

    [...word].forEach(char => {
      let r = random(0, 30),
        weirdChar = "";

      for (let i = 0; i <= r; i++) {
        weirdChar += `&#${random(768, 879)};`;
      }

      char += weirdChar;
      retWord.push(char);
    });

    return retWord.join("");
  };

  zalgoText();
})();
