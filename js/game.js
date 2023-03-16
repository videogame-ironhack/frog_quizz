const Game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  framesCounter: 0,
  background: undefined,
  player: undefined,
  obstaclesDown: [],
  obstaclesUp: [],
  quizzObjects: undefined,

  keys: {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
  },

  init() {
    this.setContext();
    this.setDimensions();
    this.start();
  },

  setContext() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
  },

  setDimensions() {
    this.width = innerWidth / 2;
    this.height = innerHeight;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
  },

  start() {
    this.reset();
    this.interval = setInterval(() => {
      this.framesCounter++;
      if (this.framesCounter > 3000) {
        this.framesCounter = 0;
      }
      this.clear();
      this.drawAll();
      this.generateObstaclesUp();
      this.generateObstaclesDown();
      this.clearObstaclesUp();
      this.clearObstaclesDown();
    }, 1000 / this.FPS);
  },

  reset() {
    this.background = new Background(this.ctx, this.width, this.height);
    this.player = new Player(this.ctx, this.gameW, this.gameH, this.keys);
    this.quizzObjects = new PowerUpObject(
      this.ctx,
      300,
      350,
      "./images/quiz/question-mark.png"
    );
    this.obstaclesUp = [];
    this.obstaclesDown = [];
  },

  drawAll() {
    this.background.draw();
    this.quizzObjects.draw();
    this.player.draw(this.framesCounter);
    this.obstaclesUp.forEach(function (obs) {
      obs.draw();
    });
    this.obstaclesDown.forEach(function (obs) {
      obs.draw();
    });
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateObstaclesDown() {
    // Use framesCounter to generate new Obstacles
    if (this.framesCounter % 200 === 0) {
      this.obstaclesDown.push(
        new ObstacleDown(
          this.ctx,
          this.width,
          this.player.posY0,
          this.player.height
        )
      );
    }
  },

  generateObstaclesUp() {
    if (this.framesCounter % 200 === 0) {
      this.obstaclesUp.push(
        new ObstacleUp(
          this.ctx,
          this.width,
          this.player.posY0,
          this.player.height
        )
      );
    }
  },

  clearObstaclesDown() {
    // Clear obstacles array (.filter 👀)
    this.obstaclesDown = this.obstaclesDown.filter(function (obs) {
      return obs.posX <= Game.width;
    });
  },

  clearObstaclesUp() {
    // Clear obstacles array (.filter 👀)
    this.obstaclesUp = this.obstaclesUp.filter(function (obs) {
      return obs.posX >= -obs.width;
    });
  },
};
