import paper, { Path, Point, Group } from 'paper';
import Mars from './mars';
import Orbit from './Orbit';
import {
  genRandAngle,
  genRandNum,
  genRandInt,
  genPosFromTheta,
  withinXangle,
  centerOfBBOX,
  extendLineFromMarsSurface,
  outOfBounds,
} from './objs/utils/util';

const LASER_LENGTH = 20;
const LASER_SPEED = 20;

function addListenerToStation(station, cb) {
  station.addEventListener('keydown', cb);
}

export default class Game {
  constructor(paperScope) {
    this.paperScope = paperScope;
    this.center = paperScope.view.center;
    this.score = 10000;

    this.addPoints = this.addPoints.bind(this);

    const orbit1 = new Orbit({
      paperScope: this.paperScope,
      numJunks: 1,
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

    paperScope.view.onFrame = (e) => {
      orbit1.onFrame(e);
      this.onFrame(e);
    };
    this.lasers = [];

    const station1 = document.getElementById('station-1');
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        this.addLaser();
        console.log(this.lasers);
      }
    });
    this.drawLasers = this.drawLasers.bind(this);
    this.addPoints = this.addPoints.bind(this);
    this.addLaser = this.addLaser.bind(this);
  }

  addPoints(points) {
    this.score = Math.max(0, this.score + points);
    console.log(this.score);
  }

  drawLasers(delta) {
    const newLasers = [];
    this.lasers.forEach((l) => {
      if (outOfBounds(l.position, this.paperScope.projects[0].view.viewSize)) {
        l.remove();
      } else {
        const a = l.segments[0].getPoint();
        const b = l.segments[1].getPoint();

        l.segments[0].setPoint(
          a.add(l.angle.multiply(delta).multiply(LASER_SPEED))
        );
        l.segments[1].setPoint(
          b.add(l.angle.multiply(delta).multiply(LASER_SPEED))
        );

        l.visible = true;
        newLasers.push(l);
      }
    });
    this.lasers = newLasers;
  }

  addLaser() {
    const stationA = document.getElementById('station-1');
    const bbox = stationA.getClientRects()[0];
    const stationCenter = centerOfBBOX(bbox);
    const [endpoint, diff] = extendLineFromMarsSurface(
      this.center,
      bbox,
      LASER_LENGTH
    );
    const laser = new Path.Line(stationCenter, endpoint);
    laser.strokeColor = 'red';
    laser.strokeWidth = 2;
    laser.angle = laser.segments[1].point.subtract(laser.segments[0].point);
    laser.visible = false;
    this.lasers.push(laser);
  }

  onFrame(e) {
    const { delta } = e;
    this.drawLasers(delta);
  }
}
