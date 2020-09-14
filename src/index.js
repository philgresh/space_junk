/* eslint-disable no-unused-vars */
import paper from 'paper';
import Game from './Game';

require('./assets/css/normalize.css');
require('./assets/css/styles.scss');
// require('./assets/images/mars_pole.jpg');
// require('./assets/images/space.jpg');

const gameCanvas = document.getElementById('game-canvas');
let paperScope = null;

function setupNewGame() {
  if (paperScope.projects.length > 1) {
    paperScope.projects[1].remove();
  }
  paperScope.projects[0].clear();
  const game = new Game(paperScope);
}

document.addEventListener('DOMContentLoaded', () => {
  paperScope = paper.setup(gameCanvas);
  paper.install(window);

  document.getElementById('new-game').addEventListener('click', setupNewGame);
});
