import { Path, Point } from 'paper';
import Orbit from './objs/Orbit';
import {
  centerOfBBOX,
  extendLineFromMarsSurface,
  outOfBounds,
} from './objs/utils/util';
import {
  checkCollisions,
  destroyOrDiminishJunk,
  removeLaser,
} from './objs/utils/handleLaserDetonation';

const LASER_LENGTH = 20;
const LASER_SPEED = 20;

export default class Game {
  constructor(paperScope) {
    this.paperScope = paperScope;
    this.center = paperScope.view.center;
    this.score = 0;

    this.addPoints = this.addPoints.bind(this);

    this.orbits = [
      new Orbit({
        paperScope: this.paperScope,
        numJunks: 20,
        radius: 300,
        addPoints: this.addPoints,
      }),
      new Orbit({
        paperScope: this.paperScope,
        numJunks: 20,
        radius: 500,
        color: 'green',
        addPoints: this.addPoints,
        descentRateAccel: 2,
      }),
      // new Orbit({
      //   paperScope: this.paperScope,
      //   numJunks: 30,
      //   radius: 750,
      //   color: 'orange',
      //   addPoints: this.addPoints,
      // descentRateAccel: 1.5,
      // }),
    ];

    paperScope.view.onFrame = (e) => {
      this.orbits.forEach((o) => o.onFrame(e));
      this.onFrame(e);
    };
    this.lasers = [];

    this.station1 = document.getElementById('station-1');

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        this.addLaser();
      }
    });
    this.handleLaserDetonations = this.handleLaserDetonations.bind(this);
    this.drawLasers = this.drawLasers.bind(this);
    this.addPoints = this.addPoints.bind(this);
    this.addLaser = this.addLaser.bind(this);
  }

  addPoints(points) {
    this.score = Math.max(0, this.score + points);
    const scoreboard = document.querySelector('.score span');
    scoreboard.innerHTML = Math.floor(this.score);
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
          a.add(l.angle.multiply(delta).multiply(LASER_SPEED)),
        );
        l.segments[1].setPoint(
          b.add(l.angle.multiply(delta).multiply(LASER_SPEED)),
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
    const [endpoint] = extendLineFromMarsSurface(
      this.center,
      bbox,
      LASER_LENGTH,
    );
    const laser = new Path.Line(stationCenter, endpoint);
    laser.strokeColor = 'red';
    laser.strokeWidth = 3;
    laser.shadowColor = 'white';
    laser.shadowBlur = 2;
    laser.shadowOffset = new Point(0, 0);
    laser.angle = laser.segments[1].point.subtract(laser.segments[0].point);
    laser.visible = false;
    this.lasers.push(laser);
  }

  handleLaserDetonations() {
    this.orbits.forEach((orbit) => {
      const collisions = checkCollisions(orbit.junks, this.lasers);
      if (collisions.length) {
        collisions.forEach(([junk, laser]) => {
          removeLaser(laser);
          const points = destroyOrDiminishJunk(junk);
          this.addPoints(points);
        });
      }
    });
  }

  onFrame(e) {
    const { delta } = e;
    this.drawLasers(delta);
    this.handleLaserDetonations();
  }
}
