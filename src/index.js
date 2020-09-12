import paper, { Path, Point } from 'paper';
import Mars from './mars';
import Orbit from './Orbit';
require('./assets/css/normalize.css');
require('./assets/css/styles.scss');
require('./assets/images/mars_pole.jpg');
require('./assets/images/space.jpg');

document.addEventListener('DOMContentLoaded', () => {
  const marsCanvas = document.getElementById('game-canvas');
  const paperScope = paper.setup(marsCanvas);

  const mars = new Mars(paperScope);
  const orbit1 = new Orbit({ paperScope, numJunks: 10, radius: 250 });
  const orbit2 = new Orbit({
    paperScope,
    numJunks: 20,
    radius: 500,
    color: 'green',
  });
  const orbit3 = new Orbit({
    paperScope,
    numJunks: 30,
    radius: 750,
    color: 'orange',
  });
  console.log(paperScope);

  function onFrame(e) {
    // Orbit.draw();
    orbit1.onFrame(e);
    orbit2.onFrame(e);
    orbit3.onFrame(e);
  }
  paperScope.view.onFrame = onFrame;
});
