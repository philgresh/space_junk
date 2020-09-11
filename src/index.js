import * as $ from 'jquery';
import paper, { Point } from 'paper';
import GameView from './game_view';
import Mars from './mars';

document.addEventListener('DOMContentLoaded', () => {
  const marsCanvas = document.getElementById('game-canvas');
  const paperScope = paper.setup(marsCanvas);
  const paperView = paperScope.view;
  console.log(paperScope);
  const mars = new Mars(paperScope);
});
