import { Color, Path, Point } from 'paper';
import {
  centerOfBBOX,
  extendLineFromMarsSurface,
  outOfBounds,
  getObjsWithinCircle,
  genPosFromTheta,
} from './utils/util';
import {
  checkCollisions as checkLaserCollisions,
  destroyOrDiminishObj,
  removeLaser,
} from './utils/handleLaserDetonation';
import {
  checkCBCollisions,
  destroyOrDiminishCBObj,
  removeCB,
} from './utils/handleCannonballCollisions';
import { checkCollisions, breakUpCollision } from './utils/handleCollisions';
import genObj from './utils/genObj';

const stationA = document.getElementById('stationA');
const stationB = document.getElementById('stationB');
const stationC = document.getElementById('stationC');
const stations = [stationA, stationB, stationC];

const MAXOBJS = 100;
const FRAMES_BETWEEN_COLLISION_CHECKS = 50;
const LASER_LENGTH = 20;
const LASER_SPEED = 20;
const MARS_SURFACE_RADIUS = 125;
const FIRST_LIGHTNING_STRIKE_DISTANCE = 200;
const LIGHTNING_EXIST_TIME = 300; // milliseconds
const CANNON_START_DISTANCE = 20;
const CANNON_BALL_RADIUS = 10;
const CANNON_BALL_SPEED = 10;
const MAX_DELTA = 3;
const STEPS = 10;
const DELTA_ACCELERATE_FACTOR = 1 / 30;
const DESCENT_RATE = DELTA_ACCELERATE_FACTOR * 300;
const THETA_RANGE = (Math.PI * 2) / 40;
const MIN_AREA_SIDE = 5;
const MIN_AREA = MIN_AREA_SIDE ** 2;

export default class Game {
  constructor(paperScope) {
    this.paperScope = paperScope;
    this.center = paperScope.view.center;
    this.score = 0;
    this.objs = [];
    this.orbits = [
      {
        radius: 400,
        numObjs: 40,
        color: 'red',
      },
      // {
      //   radius: 600,
      //   numObjs: 60,
      //   color: 'green',
      // },
    ];

    this.drawOrbitCircle = this.drawOrbitCircle.bind(this);
    this.genObjs = this.genObjs.bind(this);
    this.updatePositions = this.updatePositions.bind(this);
    this.rotateObjs = this.rotateObjs.bind(this);
    this.simulate = this.simulate.bind(this);
    this.handleCollisions = this.handleCollisions.bind(this);
    this.onFrame = this.onFrame.bind(this);
    this.sortObjs = this.sortObjs.bind(this);
    this.changeCurrentStation = this.changeCurrentStation.bind(this);
    this.determineKeydownAction = this.determineKeydownAction.bind(this);
    this.fireWeapon = this.fireWeapon.bind(this);
    this.addCannonBall = this.addCannonBall.bind(this);
    this.drawCannonballs = this.drawCannonballs.bind(this);
    this.handleCannonballCollisions = this.handleCannonballCollisions.bind(
      this,
    );
    this.addLightning = this.addLightning.bind(this);
    this.determineLightning = this.determineLightning.bind(this);
    this.drawLightning = this.drawLightning.bind(this);
    this.destroyLightning = this.destroyLightning.bind(this);
    this.drawLasers = this.drawLasers.bind(this);
    this.addLaser = this.addLaser.bind(this);
    this.handleLaserDetonations = this.handleLaserDetonations.bind(this);
    this.addPoints = this.addPoints.bind(this);

    this.thetaMin = 0;
    this.thetaMax = THETA_RANGE;
    this.thetaSorted = {};

    this.marsSurface = new Path.Circle(
      new Point(this.center),
      MARS_SURFACE_RADIUS,
    );
    this.marsSurface.visible = false;

    paperScope.view.onFrame = (e) => {
      const { delta } = e;
      this.onFrame(e);

      this.handleLaserDetonations();
      this.drawLasers(delta);
      this.drawLightning();
      this.drawCannonballs(delta);
      this.handleCannonballCollisions(delta);

      if (e.count % (FRAMES_BETWEEN_COLLISION_CHECKS * 20) === 0)
        this.sortObjs();
    };

    this.lightning = [];
    this.lasers = [];
    this.cannonballs = [];

    this.currentStationIndex = 0;
    this.currentStation = stations[this.currentStationIndex];

    document.addEventListener('keydown', this.determineKeydownAction);
    this.genObjs();
    this.drawOrbitCircle();
    this.sortObjs();
  }

  drawOrbitCircle() {
    const orbit1 = new Path.Circle(new Point(this.center), this.radius);
    orbit1.strokeColor = this.color;
  }

  genObjs() {
    this.orbits.forEach(({ numObjs, radius, color }) => {
      for (let i = 0; i < numObjs; i += 1) {
        const newRect = genObj({}, this.center, color, radius);
        this.objs.push(newRect);
      }
    });
  }

  updatePositions(delta) {
    const newObjs = [];
    while (this.objs.length >= MAXOBJS) {
      this.objs.shift();
    }

    this.objs.forEach((obj) => {
      if (obj instanceof Array) {
        // Not sure how objs are being converted to arrays...
        obj[0].remove();
      } else if (!obj.visible || obj.area <= MIN_AREA) {
        obj.visible = false;
        obj.remove();
      } else {
        const marsSurfaceRadius = this.marsSurface.bounds.width;
        obj.theta += 2 * Math.PI;
        obj.theta -= (delta * marsSurfaceRadius) / obj.altitude;
        obj.theta %= 2 * Math.PI;
        obj.altitude -= delta * obj.descentRate;
        const { x, y } = genPosFromTheta(this.center, obj.theta, obj.altitude);
        obj.position = new Point(x, y);

        if (obj.intersects(this.marsSurface)) {
          if (obj.area) this.addPoints(-1 * Math.floor(obj.area));
          obj.remove();
        } else newObjs.push(obj);
      }
    });
    this.objs = newObjs;
  }

  rotateObjs() {
    this.objs.forEach((obj) => {
      const newAngle = (obj.angle + obj.angleRate) % 360;
      obj.angle = newAngle;
      obj.rotate(obj.angleRate);
    });
  }

  simulate(delta) {
    this.radius -= delta;
    this.updatePositions(delta);
    this.rotateObjs(delta);
  }

  handleCollisions() {
    const thisThetaRange = this.objs.filter((j) => {
      const moddedTheta = j.theta % (2 * Math.PI);
      if (moddedTheta > this.thetaMin && moddedTheta <= this.thetaMax)
        return true;
      return false;
    });
    const collisions = checkCollisions(thisThetaRange);

    if (collisions.length) {
      collisions.forEach(([a, b]) => {
        const newObjs = breakUpCollision(a, b, this.center, this.descentRate);
        this.objs.push(...newObjs);
      });
    }
  }

  onFrame(event) {
    // console.log(event);
    let { delta } = event;

    if (event.count % FRAMES_BETWEEN_COLLISION_CHECKS === 0) {
      this.thetaMin = (this.thetaMin + THETA_RANGE) % (2 * Math.PI);
      this.thetaMax = (this.thetaMax + THETA_RANGE) % (2 * Math.PI);
      this.handleCollisions();
    }

    if (delta > MAX_DELTA) delta = MAX_DELTA;
    delta *= DELTA_ACCELERATE_FACTOR;

    for (let i = 0; i < STEPS; i += 1) {
      // this.simulate(delta / STEPS);
      this.simulate(delta);
    }
  }

  sortObjs() {
    this.objs = this.objs.sort((a, b) => a.theta - b.theta);
  }

  changeCurrentStation(delta) {
    // debugger;
    this.currentStation.classList.remove('filter');
    this.currentStationIndex =
      (this.currentStationIndex + delta + stations.length) % stations.length;
    this.currentStation = stations[this.currentStationIndex];
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
        this.addCannonBall();
        break;
      }
      default: {
        this.addLaser();
      }
    }
  }

  addCannonBall() {
    const station = stationC;
    const nodes = station.childNodes;
    let nodeIndex = 0;
    if (nodes.length > 1) nodeIndex = 1;
    const bbox = nodes[nodeIndex].getBoundingClientRect();
    const stationCenter = centerOfBBOX(bbox);

    const [endpoint] = extendLineFromMarsSurface(
      this.center,
      bbox,
      CANNON_START_DISTANCE,
    );
    const stationFill = window.getComputedStyle(station).fill;

    const baseline = new Path.Line(stationCenter, endpoint);
    const angle = baseline.segments[1]
      .getPoint()
      .subtract(baseline.segments[0].getPoint());
    const cannonball = new Path.Circle({
      angle,
      center: endpoint,
      radius: CANNON_BALL_RADIUS,
      visible: true,
      fillColor: new Color(stationFill),
      strokeColor: new Color(stationFill),
      position: new Point(endpoint),
    });
    this.cannonballs.push(cannonball);
    baseline.remove();
  }

  drawCannonballs(delta) {
    const newCBs = [];
    this.cannonballs.forEach((cb) => {
      if (
        cb.visible === false ||
        outOfBounds(cb.position, this.paperScope.projects[0].view.viewSize)
      ) {
        cb.remove();
      } else {
        cb.position = cb.position.add(
          cb.angle.multiply(delta * CANNON_BALL_SPEED),
        );
        newCBs.push(cb);
      }
    });
    this.cannonballs = newCBs;
  }

  handleCannonballCollisions() {
    const collisions = checkCBCollisions(this.objs, this.cannonballs);
    if (collisions.length) {
      collisions.forEach(([obj, cb]) => {
        removeCB(cb);
        destroyOrDiminishCBObj(obj, this.objs, this.center, this.addPoints);
      });
    }
  }

  addLightning() {
    const nodes = stationB.childNodes;
    let nodeIndex = 0;
    if (nodes.length > 1) nodeIndex = 1;
    const bbox = nodes[nodeIndex].getBoundingClientRect();
    const stationCenter = centerOfBBOX(bbox);
    const [endpoint] = extendLineFromMarsSurface(
      this.center,
      bbox,
      FIRST_LIGHTNING_STRIKE_DISTANCE,
    );

    const base = new Path.Line(stationCenter, endpoint);
    base.strokeColor = 'white';
    this.lightning.push(base);
    const objsToDestroy = this.determineLightning(
      base,
      FIRST_LIGHTNING_STRIKE_DISTANCE / 2,
    );
    objsToDestroy.forEach((j) => {
      this.addPoints(j.area);
      j.visible = false;
      j.remove();
    });
  }

  determineLightning(first, dist, objsToDestroy = []) {
    const lastPoint = first.segments[1].point;
    const lightningCircle = new Path.Circle(lastPoint, dist);
    const intersectingObjs = getObjsWithinCircle(lightningCircle, this.objs);

    intersectingObjs.forEach((j) => {
      if (!objsToDestroy.includes(j)) {
        objsToDestroy.push(j);
        const objCenter = centerOfBBOX(j.bounds);
        const newLightning = new Path.Line(lastPoint, objCenter);
        this.lightning.push(newLightning);
        this.determineLightning(newLightning, dist / 2, objsToDestroy);
      }
    });
    return objsToDestroy;
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
    const nodes = stationA.childNodes;
    let nodeIndex = 0;
    if (nodes.length > 1) nodeIndex = 1;
    const bbox = nodes[nodeIndex].getBoundingClientRect();
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
    const collisions = checkLaserCollisions(this.objs, this.lasers);
    if (collisions.length) {
      collisions.forEach(([obj, laser]) => {
        removeLaser(laser);
        const points = destroyOrDiminishObj(obj);
        this.addPoints(points);
      });
    }
  }

  addPoints(points) {
    this.score = Math.max(0, this.score + points);
    const scoreboard = document.querySelector('.score span');
    scoreboard.innerHTML = Math.floor(this.score);
  }
}
