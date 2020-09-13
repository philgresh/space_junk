import paper, { Path, Point } from 'paper';
import Mars from './mars';
import Orbit from './Orbit';

export default class Game {
  constructor(paperScope) {
    this.paperScope = paperScope;
    this.score = 10000;

    this.addPoints = this.addPoints.bind(this);

    const orbit1 = new Orbit({
      paperScope: this.paperScope,
      numJunks: 10,
      radius: 250,
      addPoints: this.addPoints,
    });
    // const orbit2 = new Orbit({
    //   paperScope: this.paperScope,
    //   numJunks: 20,
    //   radius: 500,
    //   color: 'green',
    // });
    // const orbit3 = new Orbit({
    //   paperScope: this.paperScope,
    //   numJunks: 30,
    //   radius: 750,
    //   color: 'orange',
    // });

    function onFrame(e) {
      orbit1.onFrame(e);
      //   orbit2.onFrame(e);
      //   orbit3.onFrame(e);
    }
    paperScope.view.onFrame = onFrame;
  }

  addPoints(points) {
    this.score = Math.max(0, this.score + points);
    console.log(this.score);
  }
}
