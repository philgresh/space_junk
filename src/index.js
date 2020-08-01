// console.log('webpack is working!')
const GameView = require('./game_view');
const Mars = require('./mars');

$(function () {
  const $gameCanvas = $('#game-canvas')[0];
  const $marsCanvas = $('#mars canvas')[0];
  const gameCtx = $gameCanvas.getContext('2d');
  const marsCtx = $marsCanvas.getContext('2d');

  resizeCanvases([$marsCanvas, $gameCanvas]);

  const mars = new Mars(marsCtx, $marsCanvas.width, $marsCanvas.height);
  // const gameView = new GameView(gameCtx, canvas.width, canvas.height);
  // gameView.start();
  // $canvas.removeClass('hidden');
})

function resizeCanvases(canvases) {
  canvases.forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  })
}