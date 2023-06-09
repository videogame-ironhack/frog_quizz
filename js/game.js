const Game = {
  // Sounds
  crashAudio: new Audio("./sounds/crash.mp3"),
  jumpAudio: new Audio("./sounds/jump.mp3"),
  backSound: new Audio("./sounds/backsound.mp3"),
  croacSound: new Audio("./sounds/froggievoice/croac.mp3"),
  noSkipSound: new Audio("./sounds/froggievoice/noskip.mp3"),
  wrongSound: new Audio("./sounds/froggievoice/wrong.mp3"),
  goSound: new Audio("./sounds/froggievoice/go.mp3"),
  correctSound: new Audio("./sounds/froggievoice/correct.mp3"),
  gameOverSound: new Audio("./sounds/froggievoice/gameover.mp3"),
  splashSound: new Audio("./sounds/splash.mp3"),
  clin: new Audio("./sounds/clin.mp3"),
  winSound: new Audio("./sounds/win.mp3"),

  // Properties
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  tileSize: 37,

  // Level
  currentLevel: 1,
  // Counters
  framesCounter: 0,
  croacTimer: 0,

  // Elements

  background1: undefined,
  background2: undefined,
  river: undefined,
  player: undefined,
  obstacleUp: undefined,
  obstacleDown: undefined,
  tableUp: undefined,
  tableDown: undefined,

  // Arrays
  obstaclesDownArray: [],
  obstaclesUpArray: [],
  tablesUp: [],
  tablesDown: [],
  quizzObjects: [],
  mathQuizzObjects: [],
  geoQuizzObjects: [],
  musicQuizzObjects: [],
  explosionsArray: [],
  splashdownsArray: [],

  // Scores
  lifes: 3,
  quizzScore: 4,
  musicScore: 2,
  geoScore: 1,
  mathsScore: 1,

  // Checkers
  playing: true,
  atQuizz: false,
  musicQuizz: false,
  notEnoughQuizz: false,
  typeOfQuestion: undefined,

  // Keys
  keys: {
    ENTER: 13,
  },

  // Game functionality
  init() {
    this.setContext();
    this.setDimensions();
    this.start();
    this.generateQuizzObjects();
    this.generateMathQuizzObjects();
    this.generateMusicQuizzObjects();
    this.generateGeoQuizzObjects();
    this.generateObstaclesUp();
    this.generateObstaclesDown();
  },

  setContext() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
  },

  setDimensions() {
    this.width = 646;
    this.height = 964;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
  },

  start() {
    this.reset();
    this.sound();
    this.startGameScreen();
    printScore();

    this.backSound.play();
    this.backSound.loop = true;
    this.interval = setInterval(() => {
      if (!Game.atQuizz) {
        this.framesCounter++;
      }

      if (this.framesCounter > 3000) {
        this.framesCounter = 0;
      }
      this.croacTimer++;
      this.clear();

      this.drawAll();
      this.printLifes();
      if (this.currentLevel === 1) {
        this.generateObstaclesUp();
        this.generateObstaclesDown();
        this.clearObstaclesUp();
        this.clearObstaclesDown();

        if (this.isCollisionUp() || this.isCollisionDown()) {
          this.generateExplosion();
          this.crashAudio.play();
          this.lifes--;
          this.player.posX = 200;
          this.player.posY = 700;
        }
        if (this.quizzCollision()) {
          this.clin.play();
          this.atQuizz = true;
          this.displayCard();
          printQuizz();
          this.clearQuizzObject();
        }
        if (this.isCollisionUp()) {
        }
        if (this.isCollisionDown()) {
        }
      }

      if (this.currentLevel === 2) {
        this.generateTablesUp();
        this.generateTablesDown();
        this.clearTablesUp();
        this.clearTablesDown();
      }
      if (this.croacTimer === 800 && this.atQuizz === false) {
        this.croacTimer = 0;
        this.croacSound.play();
      }

      if (this.currentLevel === 2) {
        if (
          this.player.posY + 39 >= 380 &&
          this.player.posY + this.player.height - 38 <= 650 &&
          !this.onTableUp() &&
          !this.onTableDown()
        ) {
          this.generateSplashdown();
          this.splashSound.pause();
          this.splashSound.currentTime = 0;
          this.splashSound.play();
          this.lifes--;
          this.player.posX = 259;
          this.player.posY = 777;
        }
      }

      if (this.currentLevel === 2) {
        if (
          this.mathQuizzCollision() ||
          this.geoQuizzCollision() ||
          this.musicQuizzCollision()
        ) {
          this.clin.play();
          this.atQuizz = true;

          this.displayCard();
          printQuizz();
          this.clearQuizzObject();
        }
      }

      if (this.lifes === 0) {
        this.gameOver();
      }
    }, 1000 / this.FPS);
  },

  // Print intro screen
  gameIntro() {
    const gameIntro = document.querySelector("#game-intro");
    const game = document.querySelector("#game");
    const quizz = document.querySelector("#quizz-box");
    const gameOver1 = document.querySelector("#game-over-1");
    const gameOver2 = document.querySelector("#game-over-2");
    const win1 = document.querySelector("#you-win-1");
    const win2 = document.querySelector("#you-win-2");
    gameIntro.style.display = "block";
    game.style.display = "none";
    quizz.style.visibility = "hidden";
    gameOver1.style.display = "none";
    gameOver2.style.display = "none";
    win1.style.display = "none";
    win2.style.display = "none";
  },

  // Print Game screen
  startGameScreen() {
    const soundbutton = document.querySelector("#sound-button");
    if (Game.playing === true) {
      soundbutton.src = "images/soundbutton.png";
      Game.sound();
    } else if (Game.playing === false) {
      soundbutton.src = "./images/mutebutton.png";
      Game.mute();
    }
    if (this.currentLevel === 1) {
      const gameIntro = document.querySelector("#game-intro");
      const game = document.querySelector("#game");

      gameIntro.style.display = "none";
      game.style.display = "block";
    } else if (this.currentLevel === 2) {
      const gameIntro = document.querySelector("#game-intro");
      const game = document.querySelector("#game");
      const lifes = document.querySelector("#lifes");
      const soundButton = document.querySelector("#sound-button");

      lifes.style.top = "75%";
      soundButton.style.top = "82%";
      gameIntro.style.display = "none";
      game.style.display = "block";
      const legendImage = document.querySelector("#legend-background");
      legendImage.src = "./images/legend-screen-level2.jpg";
    }
    Game.goSound.play();
  },

  // Change life images
  printLifes() {
    const lifesImage = document.getElementById("lifes");
    if (this.lifes === 3) {
      lifesImage.src = "./images/3lifes.png";
    }

    if (this.lifes === 2) {
      lifesImage.src = "./images/2lifes.png";
    }

    if (this.lifes === 1) {
      lifesImage.src = "./images/1life.png";
    }
  },

  // Sound settings
  mute() {
    this.crashAudio.volume = 0;
    this.jumpAudio.volume = 0;
    this.backSound.volume = 0;
    this.gameOverSound.volume = 0;
    this.splashSound.volume = 0;
    this.croacSound.volume = 0;
    this.clin.volume = 0;
    this.noSkipSound.volume = 0;
    this.wrongSound.volume = 0;
    this.goSound.volume = 0;
    this.correctSound.volume = 0;
    this.winSound.volume = 0;
  },

  sound() {
    this.crashAudio.volume = 1;
    this.jumpAudio.volume = 0.6;
    this.backSound.volume = 0.8;
    this.gameOverSound.volume = 1;
    this.splashSound.volume = 1;
    this.croacSound.volume = 1;
    this.clin.volume = 1;
    this.noSkipSound.volume = 1;
    this.wrongSound.volume = 1;
    this.goSound.volume = 1;
    this.correctSound.volume = 1;
    this.winSound.volume = 1;
  },

  // Quizz functions
  displayCard() {
    const quizzBox = document.querySelector("#quizz-box");
    quizzBox.style.visibility = "visible";
    skipButton.style.visibility = "visible";
    submitButton.style.visibility = "visible";
  },

  // Reset
  reset() {
    this.background1 = new BackgroundOne(
      this.ctx,
      this.width,
      this.height,
      this.posX,
      this.posY
    );
    this.background2 = new BackgroundTwo(
      this.ctx,
      this.width,
      this.height,
      this.posX,
      this.posY
    );
    this.player = new Player(
      this.ctx,
      this.gameW,
      this.gameH,
      this.keys,
      this.tileMap
    );
    this.obstacleUp = new ObstacleUp(this.ctx);
    this.obstacleDown = new ObstacleDown(this.ctx);
    this.tableUp = new TableUp(this.ctx);
    this.tableDown = new TableDown(this.ctx);
    this.explosion = new Explosion(this.ctx);
    this.splashdown = new Splashdown(this.ctx);
    this.river = new River(this.ctx, this.width);

    // Just for painting grid
    // this.tileMap = new TileMap(this.ctx, this.tileSize, this.player);
  },

  // Draw graphics
  drawAll() {
    // Player, obstacles and animation for dying
    if (this.currentLevel === 1) {
      this.background1.draw();
      // this.tileMap.draw(this.ctx);
      this.obstaclesUpArray.forEach((obs) => {
        obs.draw(this.framesCounter);
      });
      this.obstaclesDownArray.forEach((obs) => {
        obs.draw(this.framesCounter);
      });
      this.explosionsArray.forEach((exp) => {
        exp.draw(this.framesCounter);
      });
    }

    if (this.currentLevel === 2) {
      this.background2.draw();
      this.river.draw();
      this.tablesUp.forEach((tab) => {
        tab.draw();
      });
      this.tablesDown.forEach((tab) => {
        tab.draw();
      });
      this.splashdownsArray.forEach((splash) => {
        splash.draw(this.framesCounter);
      });
    }
    this.player.draw(this.framesCounter);

    //Quizz
    if (this.currentLevel === 1) {
      this.quizzObjects.forEach((quiz) => {
        quiz.draw(this.framesCounter);
      });
    }
    if (this.currentLevel === 2) {
      this.mathQuizzObjects.forEach((quiz) => {
        quiz.draw(this.framesCounter);
      });
      this.geoQuizzObjects.forEach((quiz) => {
        quiz.draw(this.framesCounter);
      });
      this.musicQuizzObjects.forEach((quiz) => {
        quiz.draw(this.framesCounter);
      });
    }

    //Check status and move player
    this.onTableUp();
    this.onTableDown();
    this.player.movement();
    this.checkLegend();
    this.updateTypeOfQuestion();

    // Just for painting grid
    // this.tileMap.draw(this.ctx);
  },

  // Clean everything
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  // Print arrays
  generateQuizzObjects() {
    this.quizzObjects.push(new QuizzObject(this.ctx, 400, 240));
    this.quizzObjects.push(new QuizzObject(this.ctx, 150, 150));
    this.quizzObjects.push(new QuizzObject(this.ctx, 148, 850));
    this.quizzObjects.push(new QuizzObject(this.ctx, 200, 30));
    this.quizzObjects.push(new QuizzObject(this.ctx, 315, 470));
    this.quizzObjects.push(new QuizzObject(this.ctx, 415, 670));
  },

  generateMathQuizzObjects() {
    this.mathQuizzObjects.push(new BlueQuizzObject(this.ctx, 400, 240));
    this.mathQuizzObjects.push(new BlueQuizzObject(this.ctx, 80, 710));
  },

  generateGeoQuizzObjects() {
    this.geoQuizzObjects.push(new RedQuizzObject(this.ctx, 200, 100));
    this.geoQuizzObjects.push(new RedQuizzObject(this.ctx, 100, 870));
  },

  generateMusicQuizzObjects() {
    this.musicQuizzObjects.push(new SkyQuizzObject(this.ctx, 180, 230));
    this.musicQuizzObjects.push(new SkyQuizzObject(this.ctx, 50, 530));
    this.musicQuizzObjects.push(new SkyQuizzObject(this.ctx, 350, 700));
  },

  generateTablesDown() {
    if (this.framesCounter % 350 === 0) {
      this.tablesDown.push(new TableDown(this.ctx));
    }
  },

  generateTablesUp() {
    if (this.framesCounter % 400 === 0) {
      this.tablesUp.push(new TableUp(this.ctx));
    }
  },

  generateObstaclesDown() {
    if (this.framesCounter % 250 === 0) {
      this.obstaclesDownArray.push(new ObstacleDown(this.ctx));
    }
  },

  generateObstaclesUp() {
    if (this.framesCounter % 300 === 0) {
      this.obstaclesUpArray.push(new ObstacleUp(this.ctx));
    }
  },

  generateExplosion() {
    this.explosionsArray.push(new Explosion(this.ctx));
  },

  generateSplashdown() {
    this.splashdownsArray.push(new Splashdown(this.ctx));
  },

  //clean arrays
  clearObstaclesDown() {
    this.obstaclesDownArray = this.obstaclesDownArray.filter(function (obs) {
      return obs.posX <= Game.width;
    });
  },

  clearObstaclesUp() {
    this.obstaclesUpArray = this.obstaclesUpArray.filter(function (obs) {
      return obs.posX >= -obs.width;
    });
  },

  clearTablesDown() {
    this.tablesDown = this.tablesDown.filter(function (tab) {
      return tab.posX <= Game.width;
    });
  },

  clearTablesUp() {
    this.tablesUp = this.tablesUp.filter(function (tab) {
      return tab.posX >= -tab.width;
    });
  },

  clearQuizzObject() {
    if (this.currentLevel === 1) {
      this.quizzObjects.forEach((quizz, i) => {
        if (
          this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
          this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
          this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
          this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
        ) {
          this.quizzObjects.splice(i, 1);
        }
      });
    }
    if (this.currentLevel === 2) {
      this.mathQuizzObjects.forEach((quizz, i) => {
        if (
          this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
          this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
          this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
          this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
        ) {
          this.mathQuizzObjects.splice(i, 1);
        }
      });
    }
    if (this.currentLevel === 2) {
      this.geoQuizzObjects.forEach((quizz, i) => {
        if (
          this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
          this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
          this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
          this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
        ) {
          this.geoQuizzObjects.splice(i, 1);
        }
      });
    }
    if (this.currentLevel === 2) {
      this.musicQuizzObjects.forEach((quizz, i) => {
        if (
          this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
          this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
          this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
          this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
        ) {
          this.musicQuizzObjects.splice(i, 1);
        }
      });
    }
  },

  //Collision functions
  isCollisionUp() {
    return this.obstaclesUpArray.some((obs) => {
      return (
        this.player.posX + 58 <= obs.posX + obs.width - 31 &&
        this.player.posX + this.player.width - 55 >= obs.posX + 27 &&
        this.player.posY + 39 <= obs.posY + obs.height - 16 &&
        this.player.posY + this.player.height - 38 >= obs.posY + 5
      );
    });
  },

  isCollisionDown() {
    return this.obstaclesDownArray.some((obs) => {
      return (
        this.player.posX + 58 <= obs.posX + obs.width - 31 &&
        this.player.posX + this.player.width - 55 >= obs.posX + 27 &&
        this.player.posY + 39 <= obs.posY + obs.height - 16 &&
        this.player.posY + this.player.height - 38 >= obs.posY + 5
      );
    });
  },

  quizzCollision() {
    return this.quizzObjects.some((quizz) => {
      if (
        this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
        this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
        this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
        this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
      ) {
        return true;
      }
    });
  },

  mathQuizzCollision() {
    return this.mathQuizzObjects.some((quizz) => {
      return (
        this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
        this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
        this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
        this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
      );
    });
  },

  geoQuizzCollision() {
    return this.geoQuizzObjects.some((quizz) => {
      return (
        this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
        this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
        this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
        this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
      );
    });
  },

  musicQuizzCollision() {
    return this.musicQuizzObjects.some((quizz) => {
      return (
        this.player.posX + 58 <= quizz.posX + quizz.width - 26.5 &&
        this.player.posX + this.player.width - 55 >= quizz.posX + 26.5 &&
        this.player.posY + 39 <= quizz.posY + quizz.height - 11.5 &&
        this.player.posY + this.player.height - 38 >= quizz.posY + 12.5
      );
    });
  },

  onTableUp() {
    return this.tablesUp.some((tab) => {
      if (
        this.player.posX + 58 <= tab.posX + tab.width &&
        this.player.posX + this.player.width - 55 >= tab.posX &&
        this.player.posY + 39 <= tab.posY + tab.height + 11.5 &&
        this.player.posY + this.player.height - 38 >= tab.posY &&
        this.player.posY + this.player.height - 38 <=
          tab.posY + tab.height + 11.5
      ) {
        if (this.player.posX + 109 >= 0 && !this.atQuizz) {
          this.player.posX -= 0.5;
        }
        return true;
      } else {
        return false;
      }
    });
  },

  onTableDown() {
    return this.tablesDown.some((tab) => {
      if (
        this.player.posX + 58 <= tab.posX + tab.width &&
        this.player.posX + this.player.width - 55 >= tab.posX &&
        this.player.posY + 39 <= tab.posY + tab.height + 11.5 &&
        this.player.posY + this.player.height - 38 >= tab.posY &&
        this.player.posY + this.player.height - 38 <=
          tab.posY + tab.height + 11.5
      ) {
        if (
          this.player.posX + this.player.width - 103 <= this.width &&
          !this.atQuizz
        ) {
          this.player.posX += 0.5;
        }
        return true;
      } else {
        return false;
      }
    });
  },

  // Checking functions
  updateTypeOfQuestion() {
    if (this.mathQuizzCollision()) {
      this.typeOfQuestion = "maths";
    } else if (this.geoQuizzCollision()) {
      this.typeOfQuestion = "geo";
    } else if (this.musicQuizzCollision()) {
      this.typeOfQuestion = "music";
    }
  },

  checkLegend() {
    if (this.currentLevel === 1) {
      document.querySelector("#firstlevel-quizz-legend-text").style.visibility =
        "visible";
      document.querySelector("#music-quizz-legend-text").style.visibility =
        "hidden";
      document.querySelector("#geo-quizz-legend-text").style.visibility =
        "hidden";
      document.querySelector("#maths-quizz-legend-text").style.visibility =
        "hidden";
      document.querySelector("#blue-question-mark").style.visibility = "hidden";
      document.querySelector("#sky-question-mark").style.visibility = "hidden";
      document.querySelector("#red-question-mark").style.visibility = "hidden";
    }

    if (this.currentLevel === 2) {
      document.querySelector("#firstlevel-quizz-legend-text").style.visibility =
        "hidden";
      document.querySelector("#music-quizz-legend-text").style.visibility =
        "visible";
      document.querySelector("#geo-quizz-legend-text").style.visibility =
        "visible";
      document.querySelector("#maths-quizz-legend-text").style.visibility =
        "visible";
      document.querySelector("#blue-question-mark").style.visibility =
        "visible";
      document.querySelector("#sky-question-mark").style.visibility = "visible";
      document.querySelector("#red-question-mark").style.visibility = "visible";
    }
  },

  checkEnoughQuestions() {
    if (this.currentLevel === 1) {
      if (this.quizzScore > this.quizzObjects.length) {
        this.notEnoughQuizz = true;
      }
    } else if (this.currentLevel === 2) {
      if (
        this.mathsScore > this.mathQuizzObjects.length ||
        this.geoScore > this.geoQuizzObjects.length ||
        this.musicScore > this.musicQuizzObjects.length
      ) {
        this.notEnoughQuizz = true;
      }
    }
  },

  // Special screens
  gameOver() {
    clearInterval(this.interval);
    const lifesImage = document.getElementById("lifes");
    lifesImage.src = "images/0lifes.png";
    this.backSound.pause();
    this.noSkipSound.pause();
    this.noSkipSound.currentTime = 0;
    this.gameOverSound.play();

    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case this.keys.ENTER:
          window.location.reload();
          break;
      }
    });

    if (this.currentLevel === 1) {
      if (this.lifes === 0) {
        const gameOverScreen1 = document.querySelector("#game-over-1");
        gameOverScreen1.style.display = "block";
      } else if (this.quizzScore > this.quizzObjects.length) {
        const gameOverScreen2 = document.querySelector("#game-over-2");
        gameOverScreen2.style.display = "block";
      }
    }

    if (this.currentLevel === 2) {
      if (this.lifes === 0) {
        const gameOverScreen1 = document.querySelector("#game-over-1");
        gameOverScreen1.style.display = "block";
      } else if (this.musicScore > this.musicQuizzObjects.length) {
        const gameOverScreen2 = document.querySelector("#game-over-2");
        gameOverScreen2.style.display = "block";
      } else if (this.mathsScore > this.mathQuizzObjects.length) {
        const gameOverScreen2 = document.querySelector("#game-over-2");
        gameOverScreen2.style.display = "block";
      } else if (this.geoScore > this.geoQuizzObjects.length) {
        const gameOverScreen2 = document.querySelector("#game-over-2");
        gameOverScreen2.style.display = "block";
      }
    }
  },

  winScreen() {
    clearInterval(this.interval);
    this.backSound.pause();
    this.backSound.currentTime = 0;
    this.winSound.play();
    this.lifes = 3;
    this.printLifes();

    if (this.currentLevel === 1) {
      const winScreen1 = document.querySelector("#you-win-1");
      winScreen1.style.display = "block";

      document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case this.keys.ENTER:
            winScreen1.style.display = "none";
            this.currentLevel = 2;
            this.init();
            this.winSound.pause();
            this.winSound.currentTime = 0;
            break;
        }
      });
    } else if (this.currentLevel === 2) {
      const winScreen2 = document.querySelector("#you-win-2");
      winScreen2.style.display = "block";

      document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case this.keys.ENTER:
            winScreen2.style.display = "none";
            this.currentLevel = 1;
            window.location.reload();
            this.winSound.pause();
            this.winSound.currentTime = 0;
            break;
        }
      });
    }
  },
};
