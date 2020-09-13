import paper from 'paper';
import Game from './Game';
import Mars from './mars';

require('./assets/css/normalize.css');
require('./assets/css/styles.scss');
require('./assets/images/mars_pole.jpg');
require('./assets/images/space.jpg');

const marsCanvas = document.getElementById('game-canvas');
let paperScope = null;

document.addEventListener('DOMContentLoaded', () => {
  paperScope = paper.setup(marsCanvas);
  paper.install(window);

  const mars = new Mars(paperScope);

  document.getElementById('new-game').addEventListener('click', setupNewGame);
});

function setupNewGame() {
  if (paperScope.projects.length > 1) {
    paperScope.projects[1].remove();
  }
  paperScope.projects[0].clear();
  // paperScope = paper.setup(marsCanvas);
  const game = new Game(paperScope);
}
