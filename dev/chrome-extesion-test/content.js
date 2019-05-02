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

  let zalgofy = querySelector => {
    let title = document.querySelector(querySelector);
    let titleArr = title.innerHTML.split(" ");
    let weirdWord = "";

    titleArr.forEach(word => {
      weirdWord += zalgoText(word);
    });

    title.innerHTML = weirdWord;
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

  zalgofy("h2");
})();
