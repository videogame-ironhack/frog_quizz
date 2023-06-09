class TileMap {
  constructor(ctx, tileSize, player) {
    this.ctx = ctx;
    this.tileSize = tileSize;
    this.player = player;

    this.map = map;
  }

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(this.ctx, column, row, this.tileSize);
        }

        ctx.strokeStyle = "yellow";
        ctx.strokeRect(
          column * this.tileSize,
          row * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  #drawWall(ctx, column, row, size) {
    this.ctx.fillStyle = "rgba(0,0,0,0.2)";
    this.ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }
}
