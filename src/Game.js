import { Path, Point } from 'paper';
import Orbit from './objs/Orbit';
import {
  centerOfBBOX,
  extendLineFromMarsSurface,
  outOfBounds,
  getJunksWithinCircle,
} from './objs/utils/util';
import {
  checkCollisions,
  destroyOrDiminishJunk,
  removeLaser,
} from './objs/utils/handleLaserDetonation';

const LASER_LENGTH = 20;
const LASER_SPEED = 20;
const MARS_SURFACE_RADIUS = 125;
const THIRTY_DEGREES = (Math.PI * 2) / 12;
const FIRST_LIGHTNING_STRIKE_DISTANCE = 200;
const LIGHTNING_EXIST_TIME = 300; // milliseconds

export default class Game {
  constructor(paperScope) {
    this.paperScope = paperScope;
    this.center = paperScope.view.center;
    this.score = 0;

    this.addPoints = this.addPoints.bind(this);
    this.handleLaserDetonations = this.handleLaserDetonations.bind(this);
    this.determineKeydownAction = this.determineKeydownAction.bind(this);
    this.changeCurrentStation = this.changeCurrentStation.bind(this);
    this.addLightning = this.addLightning.bind(this);
    this.drawLasers = this.drawLasers.bind(this);
    this.fireWeapon = this.fireWeapon.bind(this);
    this.addLaser = this.addLaser.bind(this);

    this.junks = [];
    this.lightning = [];
    this.marsSurface = new Path.Circle(
      new Point(this.center),
      MARS_SURFACE_RADIUS,
    );
    this.orbits = [
      new Orbit({
        paperScope: this.paperScope,
        numJunks: 20,
        radius: 400,
        addPoints: this.addPoints,
        junks: this.junks,
        marsSurface: this.marsSurface,
      }),
      new Orbit({
        paperScope: this.paperScope,
        numJunks: 20,
        radius: 500,
        color: 'green',
        addPoints: this.addPoints,
        descentRateAccel: 2,
        junks: this.junks,
        marsSurface: this.marsSurface,
      }),
      new Orbit({
        paperScope: this.paperScope,
        numJunks: 30,
        radius: 750,
        color: 'orange',
        addPoints: this.addPoints,
        descentRateAccel: 1.5,
        junks: this.junks,
        marsSurface: this.marsSurface,
      }),
    ];

    paperScope.view.onFrame = (e) => {
      const { delta } = e;
      this.orbits.forEach((o) => {
        o.onFrame(e);
      });

      this.handleLaserDetonations();
      this.drawLasers(delta);
      this.drawLightning();
    };
    this.lasers = [];

    this.stationA = document.getElementById('stationA');
    this.stationB = document.getElementById('stationB');
    this.stationC = document.getElementById('stationC');

    this.stations = [this.stationA, this.stationB, this.stationC];

    this.currentStationIndex = 0;
    this.currentStation = this.stations[this.currentStationIndex];

    document.addEventListener('keydown', this.determineKeydownAction);
  }

  changeCurrentStation(delta) {
    // debugger;
    this.currentStation.classList.remove('filter');
    this.currentStationIndex =
      (this.currentStationIndex + delta + this.stations.length) %
      this.stations.length;
    this.currentStation = this.stations[this.currentStationIndex];
    this.currentStation.classList.add('filter');
  }

  determineKeydownAction(e) {
    switch (e.keyCode) {
      case 38:
        // ArrowUp
        this.changeCurrentStation(1);
        break;
      case 40:
        // ArrowDown
        this.changeCurrentStation(-1);
        break;
      default:
        break;
    }
    if (e.keyCode === 32) {
      this.fireWeapon();
    }
  }

  fireWeapon() {
    switch (this.currentStationIndex) {
      case 1: {
        this.addLightning();
        break;
      }
      case 2: {
        break;
      }
      default: {
        this.addLaser();
      }
    }
  }

  addLightning() {
    const bbox = this.stationB.childNodes[1].getClientRects()[0];
    const stationCenter = centerOfBBOX(bbox);
    const [endpoint] = extendLineFromMarsSurface(
      this.center,
      bbox,
      FIRST_LIGHTNING_STRIKE_DISTANCE,
    );

    const base = new Path.Line(stationCenter, endpoint);
    base.strokeColor = 'white';
    this.lightning.push(base);
    const junksToDestroy = this.determineLightning(
      base,
      FIRST_LIGHTNING_STRIKE_DISTANCE / 2,
    );
    junksToDestroy.forEach((j) => {
      this.addPoints(j.area);
      j.visible = false;
      j.remove();
    });
  }

  determineLightning(first, dist, junksToDestroy = []) {
    const lastPoint = first.segments[1].point;
    const lightningCircle = new Path.Circle(lastPoint, dist);
    const intersectingJunks = getJunksWithinCircle(lightningCircle, this.junks);

    intersectingJunks.forEach((j) => {
      if (!junksToDestroy.includes(j)) {
        junksToDestroy.push(j);
        const junkCenter = centerOfBBOX(j.bounds);
        const newLightning = new Path.Line(lastPoint, junkCenter);
        this.lightning.push(newLightning);
        this.determineLightning(newLightning, dist / 2, junksToDestroy);
      }
    });
    return junksToDestroy;
  }

  drawLightning() {
    if (this.lightning.length > 0) {
      this.lightning.forEach((l) => {
        l.visible = true;
        l.strokeColor = 'white';
        l.strokeJoin = 'round';
        l.strokeWidth = 2;
      });
      setTimeout(() => this.destroyLightning(), LIGHTNING_EXIST_TIME);
    }
  }

  destroyLightning() {
    while (this.lightning.length > 0) {
      const lightningToDestroy = this.lightning.shift();
      lightningToDestroy.visible = false;
      lightningToDestroy.remove();
    }
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
    const bbox = this.stationA.childNodes[1].getClientRects()[0];
    const stationCenter = centerOfBBOX(bbox);
    const [endpoint] = extendLineFromMarsSurface(
      this.center,
      bbox,
      LASER_LENGTH,
    );
    const laser = new Path.Line(stationCenter, endpoint);
    laser.strokeColor = 'red';
    laser.strokeWidth = 3;
    laser.angle = laser.segments[1].point.subtract(laser.segments[0].point);
    this.lasers.push(laser);
  }

  handleLaserDetonations() {
    const that = this;
    that.orbits.forEach((orbit) => {
      const collisions = checkCollisions(orbit.junks, that.lasers);
      if (collisions.length) {
        collisions.forEach(([junk, laser]) => {
          removeLaser(laser);
          const points = destroyOrDiminishJunk(junk);
          that.addPoints(points);
        });
      }
    });
  }

  addPoints(points) {
    this.score = Math.max(0, this.score + points);
    const scoreboard = document.querySelector('.score span');
    scoreboard.innerHTML = Math.floor(this.score);
  }
}
