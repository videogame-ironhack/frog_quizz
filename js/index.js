window.onload = () => {
  document.querySelector("#lifes").style.visibility = "hidden";
  document.getElementById("start-button").onclick = () => {
    Game.init();
  };

  document.getElementById("sound-button").onclick = () => {
    let soundbutton = document.querySelector("#sound-button");
    if (Game.playing === true) {
      Game.playing = false;
      soundbutton.src = "images/mutebutton.png";
      Game.audio.pause();
    }
    if (Game.playing === false) {
      Game.playing = true;
      soundbutton.src = "images/soundbutton.png";
      Game.audio.play();

      printQuizz();
    }
  };
};
