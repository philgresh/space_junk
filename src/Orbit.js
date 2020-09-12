import { Point, Size, Path, Color } from 'paper';

import {
  genRandAngle,
  genRandNum,
  genRandInt,
  genPosFromTheta,
  withinXangle,
} from './util';

const MIN_RECT_SIZE = 10;
const MAX_RECT_SIZE = 40;
const ORBIT_RADIUS_RANGE = 20;

const MAX_DELTA = 3;
const STEPS = 10;
const DELTA_ACCELERATE_FACTOR = 1 / 10;
const DESCENT_RATE = DELTA_ACCELERATE_FACTOR * 30;
const COLLISION_CHECK_ANGLE = (Math.PI * 2) / 18;
const NEAREST_NEIGHBORS_TO_CHECK = 5;

export default class Orbit {
  constructor(params) {
    this.numJunks = params.numJunks;
    this.paperScope = params.paperScope;
    this.center = this.paperScope.view.center;
    this.radius = params.radius;
    this.junks = [];
    this.color = params.color || 'red';

    this.genJunks(this.numJunks);
    this.sortJunks();
    // this.drawOrbitCircle();
    this.marsSurface = new Path.Circle(new Point(this.center), 125);
  }

  drawOrbitCircle() {
    const orbit1 = new Path.Circle(new Point(this.center), this.radius);
    orbit1.strokeColor = this.color;
  }

  genJunk(params) {
    const {
      altitude = genRandNum(
        this.radius - ORBIT_RADIUS_RANGE / 2,
        this.radius + ORBIT_RADIUS_RANGE / 2
      ),
      angle = genRandInt(0, 360),
      angleRate = genRandNum(-1, 0.5) / 2,
      descentRate = DESCENT_RATE,
      theta = genRandAngle(),
      position = genPosFromTheta(this.center, theta, altitude),
      size = new Size(
        genRandNum(MIN_RECT_SIZE, MAX_RECT_SIZE),
        genRandNum(MIN_RECT_SIZE, MAX_RECT_SIZE)
      ),
    } = params;

    const newRect = new Path.Rectangle(position, size);
    newRect.position = position;
    newRect.theta = theta;
    newRect.altitude = altitude;
    newRect.angle = angle;
    newRect.angleRate = angleRate;
    newRect.descentRate = descentRate;
    newRect.rotate(angle);
    newRect.strokeColor = this.color;
    newRect.strokeWidth = 2;
    newRect.fillColor = new Color(this.color, genRandNum(0.6, 1));

    return newRect;
  }

  genJunks(numJunks = this.numJunks) {
    for (let i = 0; i < numJunks; i += 1) {
      const newRect = this.genJunk({});
      this.junks.push(newRect);
    }
    console.log(this.junks);
  }

  updatePositions(delta) {
    const newJunks = [];
    this.junks.forEach((junk) => {
      junk.theta -= delta;
      junk.altitude -= delta * junk.descentRate;
      const { x, y } = genPosFromTheta(this.center, junk.theta, junk.altitude);
      junk.position = new Point(x, y);

      if (junk.intersects(this.marsSurface)) {
        junk.remove();
        // subtract points
      } else newJunks.push(junk);
    });
    this.junks = newJunks;
  }

  nearestNeighbors(index, num = NEAREST_NEIGHBORS_TO_CHECK) {
    const neighbors = [];
    for (let i = -num; i < num; i += 1) {
      const j = (index + i) % this.junks.length;
      if (j !== index && this.junks.slice(j, j + 1)[0])
        neighbors.push(this.junks.slice(j, j + 1)[0]);
    }
    return neighbors;
  }

  checkCollisions() {
    const collisions = [];
    const pairs = {};
    this.junks.forEach((junk, idx) => {
      const neighbors = this.nearestNeighbors(idx);
      neighbors.forEach((neigh) => {
        if (junk.intersects(neigh) && !pairs[neigh]) {
          collisions.push([junk, neigh]);
          pairs[neigh] = junk;
        }
      });
    });
    return collisions;
  }

  breakUpCollision(a, b) {
    const maxJunk = genJunk({
      altitude: Math.max(a.altitude, b.altitude),
      angleRate: a.angleRate + b.angleRate,
      descentRate: Math.max(
        Math.min(a.descentRate, b.descentRate) * 2,
        DESCENT_RATE
      ),
      position: Point.max(a.position, b.position),
      size: Size.max(a.size / 2, b.size / 2),
      theta: Math.max(a.theta, b.theta),
    });
    const minJunk = genJunk({
      altitude: Math.min(a.altitude, b.altitude),
      angleRate: a.angleRate + b.angleRate,
      descentRate: Math.min(
        Math.max(a.descentRate, b.descentRate) * 2,
        DESCENT_RATE
      ),
      position: Point.min(a.position, b.position),
      size: Size.min(a.size / 2, b.size / 2),
      theta: Math.min(a.theta, b.theta),
    });
    debugger;
    a.remove();
    b.remove();
    return [maxJunk, minJunk];
  }

  rotateJunks() {
    this.junks.forEach((junk) => {
      const newAngle = (junk.angle + junk.angleRate) % 360;
      junk.angle = newAngle;
      junk.rotate(junk.angleRate);
    });
  }

  simulate(delta) {
    this.radius -= delta;
    this.updatePositions(delta);
    this.rotateJunks(delta);
  }

  sortJunks() {
    this.junks = this.junks.sort((a, b) => a.angle - b.angle);
  }

  onFrame(event) {
    // console.log(event);
    let { delta } = event;
    if (event.count % 200 !== 0) {
      if (delta > MAX_DELTA) delta = MAX_DELTA;
      delta *= DELTA_ACCELERATE_FACTOR;

      for (let i = 0; i < STEPS; i += 1) {
        // this.simulate(delta / STEPS);
        this.simulate(delta);
      }
    } else {
      this.sortJunks();
      const collisions = this.checkCollisions();

      debugger;
      if (collisions.length) {
        collisions.forEach(([a, b]) => {
          if (this.junks.includes(a) && this.junks.includes(b))
            breakUpCollision(a, b);
        });
      }
    }
  }
}
