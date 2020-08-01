const Game = require("./game").default

class GameView {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.game = new Game(width, height, 200);
  }
  start() {
    setInterval(() => {
      window.requestAnimationFrame(() => this.game.step(this.ctx))
    }, 200);
  }


}


module.exports = GameView;