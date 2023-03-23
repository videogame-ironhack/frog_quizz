const Game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  framesCounter: 0,
  background1: undefined,
  background2: undefined,
  river: undefined,
  player: undefined,
  obstacleUp: undefined,
  obstacleDown: undefined,
  tableUp: undefined,
  tableDown: undefined,
  obstaclesDownArray: [],
  obstaclesUpArray: [],
  tablesUp: [],
  tablesDown: [],
  quizzObjects: [],
  explosionsArray: [],
  splashdownsArray: [],
  lifes: 3,
  masksArray: [],
  crashAudio: new Audio("./sounds/crash.mp3"),
  jumpAudio: new Audio("./sounds/jump.mp3"),
  backSound: new Audio("./sounds/backsound.mp3"),
  gameOverSound: new Audio("./sounds/gameover.mp3"),
  croacSound: new Audio("./sounds/croac.mp3"),
  splashSound: new Audio("./sounds/splash.mp3"),
  croacTimer: 0,
  quizzScore: 2,
  playing: true,
  atQuizz: false,
  currentLevel: 1,
  notEnoughQuizz: false,

  keys: {
    ENTER: 13,
  },

  init() {
    this.setContext();
    this.setDimensions();
    this.start();
    this.generateMasks();
    this.generateQuizzObjects();
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
    document.querySelector("#lifes").style.visibility = "visible";
    document.querySelector("#board-img").src = "./images/LeaderboardScreen.png";
    document.querySelector("#quizz-legend-questionmark").style.visibility =
      "visible";
    printScore();

    document.querySelector("#start-button").style.visibility = "hidden";
    this.backSound.play();
    this.backSound.loop = true;
    this.interval = setInterval(() => {
      if (!Game.atQuizz) {
        this.framesCounter++;
      }
      this.croacTimer++;
      if (this.framesCounter > 3000) {
        this.framesCounter = 0;
      }
      this.clear();

      this.drawAll();
      this.printLifes();
      if (this.currentLevel === 1) {
        this.generateObstaclesUp();
        this.generateObstaclesDown();
        this.clearObstaclesUp();
        this.clearObstaclesDown();
      }

      if (this.currentLevel === 2) {
        this.generateTablesUp();
        this.generateTablesDown();
        this.clearTablesUp();
        this.clearTablesDown();
      }
      // this.quizzObjects.forEach((quiz) => {
      //   quiz.draw(this.framesCounter);
      // });
      if (this.croacTimer === 800) {
        this.croacTimer = 0;
        this.croacSound.play();
      }

      if (this.currentLevel === 1) {
        if (this.isCollisionUp() || this.isCollisionDown()) {
          this.generateExplosion();
          this.crashAudio.play();
          this.lifes--;
          this.player.posX = 200;
          this.player.posY = 700;
        }
      }

      if (this.currentLevel === 2) {
        if (
          this.player.posY + 74 >= 380 &&
          this.player.posY + this.player.height - 71 <= 650 &&
          !this.onTableUp() &&
          !this.onTableDown()
        ) {
          this.generateSplashdown();
          this.splashSound.play();
          // this.lifes--;
          this.player.posX = 200;
          this.player.posY = 700;
        }
      }

      if (this.quizzCollision()) {
        this.atQuizz = true;
        this.clearQuizzObject();
        this.displayCard();
        printQuizz();
      }
      if (this.lifes === 0) {
        this.gameOver();
      }
    }, 1000 / this.FPS);
  },

  reset() {
    this.background1 = new BackgroundOne(this.ctx, this.width, this.height);
    this.background2 = new BackgroundTwo(this.ctx, this.width, this.height);
    this.player = new Player(this.ctx, this.gameW, this.gameH, this.keys);
    this.obstacleUp = new ObstacleUp(this.ctx);
    this.obstacleDown = new ObstacleDown(this.ctx);
    this.tableUp = new TableUp(this.ctx);
    this.tableDown = new TableDown(this.ctx);
    this.explosion = new Explosion(this.ctx);
    this.splashdown = new Splashdown(this.ctx);
    this.river = new River(this.ctx, this.width);
  },

  drawAll() {
    // console.log(`up:${this.onTableUp()}`);
    // console.log(`down:${this.onTableDown}`);
    if (this.currentLevel === 1) {
      this.background1.draw();
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
    this.onTableUp();
    this.onTableDown();
    this.player.draw(this.framesCounter);

    this.quizzObjects.forEach((quiz) => {
      quiz.draw(this.framesCounter);
    });
    this.player.movement();
    this.masksArray.forEach((mask) => {
      mask.draw();
    });
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateMasks() {
    //torre arr iz
    this.masksArray.push(new Mask(this.ctx, 60, 20, 100, 250)),
      //arbol arr iz
      this.masksArray.push(new Mask(this.ctx, 20, 210, 70, 120)),
      //valla arr
      this.masksArray.push(new Mask(this.ctx, 390, 80, 136, 46)),
      //muro arr
      this.masksArray.push(new Mask(this.ctx, 520, 124, 156, 46)),
      //arbol arr dch
      this.masksArray.push(new Mask(this.ctx, 540, 20, 100, 110)),
      //seto arriba dch
      this.masksArray.push(new Mask(this.ctx, 510, 190, 90, 96)),
      //valla ab
      this.masksArray.push(new Mask(this.ctx, 50, 820, 126, 46)),
      //arbol ab iz
      this.masksArray.push(new Mask(this.ctx, 20, 700, 70, 120)),
      //muro ab
      this.masksArray.push(new Mask(this.ctx, 30, 670, 136, 46)),
      //setito ab iz
      this.masksArray.push(new Mask(this.ctx, 54, 900, 60, 60)),
      //setito ab dch
      this.masksArray.push(new Mask(this.ctx, 420, 830, 60, 60)),
      //casa ab dch
      this.masksArray.push(new Mask(this.ctx, 480, 760, 160, 160));
  },

  generateQuizzObjects() {
    this.quizzObjects.push(new QuizzObject(this.ctx, 400, 250));
    this.quizzObjects.push(new QuizzObject(this.ctx, 200, 650));
    this.quizzObjects.push(new QuizzObject(this.ctx, 150, 150));
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

  clearObstaclesDown() {
    this.obstaclesDownArray = this.obstaclesDownArray.filter(function (obs) {
      return obs.posX <= Game.width - obs.width;
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

  generateExplosion() {
    this.explosionsArray.push(new Explosion(this.ctx));
  },

  generateSplashdown() {
    this.splashdownsArray.push(new Splashdown(this.ctx));
  },

  isCollisionUp() {
    return this.obstaclesUpArray.some((obs) => {
      return (
        this.player.posX + 109 <= obs.posX + obs.width - 31 &&
        this.player.posX + this.player.width - 103 >= obs.posX + 27 &&
        this.player.posY + 74 <= obs.posY + obs.height - 16 &&
        this.player.posY + this.player.height - 71 >= obs.posY + 5
      );
    });
  },

  isCollisionDown() {
    return this.obstaclesDownArray.some((obs) => {
      return (
        this.player.posX + 109 <= obs.posX + obs.width - 31 &&
        this.player.posX + this.player.width - 103 >= obs.posX + 27 &&
        this.player.posY + 74 <= obs.posY + obs.height - 16 &&
        this.player.posY + this.player.height - 71 >= obs.posY + 5
      );
    });
  },

  gameOver() {
    clearInterval(this.interval);
    const lifesImage = document.getElementById("lifes");
    lifesImage.src = "images/0lifes.png";
    this.backSound.pause();
    this.gameOverSound.play();

    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case this.keys.ENTER:
          window.location.reload();
          break;
      }
    });
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "red";
    this.ctx.font = "40px Arial";
    this.ctx.fillText(`Game Over`, 220, 350);
    if (this.lifes === 0) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "40px Arial";
      this.ctx.fillText(`Te has quedado sin vidas`, 130, 450);
    } else if (this.notEnoughQuizz) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "40px Arial";
      this.ctx.fillText(`Has skipeado demasiado`, 130, 450);
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "40px Arial";
    this.ctx.fillText(`Press ENTER to retry`, 130, 550);
  },

  winScreen() {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "Yellow";
    this.ctx.font = "40px Arial";
    this.ctx.fillText(`You Win!!`, 220, 350);
  },

  printLifes() {
    const lifesImage = document.getElementById("lifes");
    if (this.lifes === 2) {
      lifesImage.src = "images/2lifes.png";
    }

    if (this.lifes === 1) {
      lifesImage.src = "images/1life.png";
    }
  },

  maskCollision() {
    return this.masksArray.some((mask) => {
      return (
        this.player.posX + 109 < mask.posX + mask.width &&
        this.player.posX + this.player.width - 103 > mask.posX &&
        this.player.posY + 74 < mask.posY + mask.height &&
        this.player.height - 71 + this.player.posY > mask.posY
      );
    });
  },

  quizzCollision() {
    return this.quizzObjects.some((quizz) => {
      return (
        this.player.posX + 109 <= quizz.posX + quizz.width - 26.5 &&
        this.player.posX + this.player.width - 103 >= quizz.posX + 26.5 &&
        this.player.posY + 74 <= quizz.posY + quizz.height - 11.5 &&
        this.player.posY + this.player.height - 71 >= quizz.posY + 12.5
      );
    });
  },

  displayCard() {
    const quizzBox = document.querySelector("#quizz-box");
    quizzBox.style.visibility = "visible";
    skipButton.style.visibility = "visible";
    submitButton.style.visibility = "visible";
  },

  clearQuizzObject() {
    this.quizzObjects.forEach((quizz, i) => {
      if (
        this.player.posX + 109 <= quizz.posX + quizz.width &&
        this.player.posX + this.player.width - 103 >= quizz.posX &&
        this.player.posY + 74 <= quizz.posY + quizz.height &&
        this.player.posY + this.player.height - 71 >= quizz.posY
      ) {
        this.quizzObjects.splice(i, 1);
      }
      if (this.quizzScore > this.quizzObjects.length) {
        this.notEnoughQuizz = true;
      }
    });
  },

  onTableUp() {
    return this.tablesUp.some((tab) => {
      if (
        this.player.posX + 109 <= tab.posX + tab.width &&
        this.player.posX + this.player.width - 103 >= tab.posX &&
        this.player.posY + 74 <= tab.posY + tab.height &&
        this.player.posY + this.player.height - 71 >= tab.posY &&
        this.player.posY + this.player.height - 71 <= tab.posY + tab.height
      ) {
        if (this.player.posX + 109 >= 1) {
          this.player.posX -= this.tableUp.velX;
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
        this.player.posX + 109 <= tab.posX + tab.width &&
        this.player.posX + this.player.width - 103 >= tab.posX &&
        this.player.posY + 74 <= tab.posY + tab.height &&
        this.player.posY + this.player.height - 71 >= tab.posY &&
        this.player.posY + this.player.height - 71 <= tab.posY + tab.height
      ) {
        if (this.player.posX + this.player.width - 103 <= this.width) {
          this.player.posX += 0.5;
        }
        return true;
      } else {
        return false;
      }
    });
  },

  mute() {
    this.crashAudio.volume = 0;
    this.jumpAudio.volume = 0;
    this.backSound.volume = 0;
    this.gameOverSound.volume = 0;
    this.splashSound.volume = 0;
    this.croacSound.volume = 0;
  },

  sound() {
    this.crashAudio.volume = 1;
    this.jumpAudio.volume = 1;
    this.backSound.volume = 1;
    this.gameOverSound.volume = 1;
    this.splashSound.volume = 1;
  },
};
