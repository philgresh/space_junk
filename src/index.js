/* eslint-disable no-unused-vars */
import paper from 'paper';
import Game from './Game';

require('./assets/css/normalize.css');
require('./assets/css/styles.scss');
// require('./assets/images/mars_pole.jpg');
// require('./assets/images/space.jpg');

const marsCanvas = document.getElementById('game-canvas');
let paperScope = null;

function setupNewGame() {
  if (paperScope.projects.length > 1) {
    paperScope.projects[1].remove();
  }
  paperScope.projects[0].clear();
  console.log('clicked');
  const game = new Game(paperScope);
  console.log(game);
}

document.addEventListener('DOMContentLoaded', () => {
  paperScope = paper.setup(marsCanvas);
  paper.install(window);

  document.getElementById('new-game').addEventListener('click', setupNewGame);
});
