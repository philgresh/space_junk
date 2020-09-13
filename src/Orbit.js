import { Point, Size, Path, Color } from 'paper';

import {
  genRandAngle,
  genRandNum,
  genRandInt,
  genPosFromTheta,
  withinXangle,
} from './objs/utils/util';
import {
  checkCollisions,
  breakUpCollision,
} from './objs/utils/handleCollisions';

const MIN_RECT_SIZE = 20;
const MAX_RECT_SIZE = 50;
const ORBIT_RADIUS_RANGE = 50;
const MARS_SURFACE_RADIUS = 125;

const MAX_DELTA = 3;
const STEPS = 10;
const DELTA_ACCELERATE_FACTOR = 1 / 10;
const DESCENT_RATE = DELTA_ACCELERATE_FACTOR * 30;
const FRAMES_BETWEEN_COLLISION_CHECKS = 200;
const COLLISION_CHECK_ANGLE = (Math.PI * 2) / 18;
const POINTS_DEDUCTION_MULTIPLIER = 1;

export default class Orbit {
  constructor(params) {
    this.numJunks = params.numJunks;
    this.paperScope = params.paperScope;
    this.center = this.paperScope.view.center;
    this.radius = params.radius;
    this.junks = [];
    this.color = params.color || 'red';
    this.addPoints = params.addPoints;

    this.genJunks(this.numJunks);
    this.sortJunks();
    // this.drawOrbitCircle();
    this.marsSurface = new Path.Circle(
      new Point(this.center),
      MARS_SURFACE_RADIUS
    );
    this.genJunk = this.genJunk.bind(this);
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
      angleRate = genRandNum(-1, 1),
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
    newRect.size = size;
    newRect.rotate(angle);
    newRect.strokeColor = this.color;
    newRect.strokeWidth = 2;
    const alpha = genRandNum(0.4, 1);
    newRect.fillColor = new Color(this.color);
    newRect.fillColor.alpha = alpha;

    return newRect;
  }

  genJunks(numJunks = this.numJunks) {
    for (let i = 0; i < numJunks; i += 1) {
      const newRect = this.genJunk({});
      this.junks.push(newRect);
    }
  }

  updatePositions(delta) {
    const newJunks = [];
    this.junks.forEach((junk) => {
      junk.theta -= (delta * MARS_SURFACE_RADIUS) / junk.altitude;
      junk.altitude -= delta * junk.descentRate;
      const { x, y } = genPosFromTheta(this.center, junk.theta, junk.altitude);
      junk.position = new Point(x, y);

      if (junk.intersects(this.marsSurface)) {
        this.addPoints(-1 * Math.floor(junk.area));
        junk.remove();
      } else newJunks.push(junk);
    });
    this.junks = newJunks;
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
    if (event.count % FRAMES_BETWEEN_COLLISION_CHECKS !== 0) {
      if (delta > MAX_DELTA) delta = MAX_DELTA;
      delta *= DELTA_ACCELERATE_FACTOR;

      for (let i = 0; i < STEPS; i += 1) {
        // this.simulate(delta / STEPS);
        this.simulate(delta);
      }
    } else {
      this.sortJunks();
      const collisions = checkCollisions(this.junks);

      if (collisions.length) {
        collisions.forEach(([a, b]) => {
          if (this.junks.includes(a) && this.junks.includes(b)) {
            const newJunks = breakUpCollision(a, b, this.genJunk, DESCENT_RATE);
            this.junks.push(...newJunks);
          }
        });
      }
    }
  }
}
