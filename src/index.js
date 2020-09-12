import paper, { Path, Point } from 'paper';
import Mars from './mars';
import Orbit from './Orbit';

document.addEventListener('DOMContentLoaded', () => {
  const marsCanvas = document.getElementById('game-canvas');
  const paperScope = paper.setup(marsCanvas);

  const mars = new Mars(paperScope);
  const orbit1 = new Orbit({ paperScope, numJunks: 10, radius: 250 });
  const orbit2 = new Orbit({ paperScope, numJunks: 20, radius: 500, color: 'green' });
  console.log(paperScope);

  function onFrame(e) {
    // Orbit.draw();
    orbit1.onFrame(e);
    orbit2.onFrame(e);
  }
  paperScope.view.onFrame = onFrame;
});
