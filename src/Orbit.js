import { Point, Path } from 'paper';
import genJunk from './objs/utils/genJunk';
import { genPosFromTheta } from './objs/utils/util';
import {
  checkCollisions,
  breakUpCollision,
} from './objs/utils/handleCollisions';

const MARS_SURFACE_RADIUS = 125;

const MAX_DELTA = 3;
const STEPS = 10;
const DELTA_ACCELERATE_FACTOR = 1 / 10;
const DESCENT_RATE = DELTA_ACCELERATE_FACTOR * 25;
const FRAMES_BETWEEN_COLLISION_CHECKS = 20;

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
      MARS_SURFACE_RADIUS,
    );
  }

  drawOrbitCircle() {
    const orbit1 = new Path.Circle(new Point(this.center), this.radius);
    orbit1.strokeColor = this.color;
  }

  genJunks(numJunks = this.numJunks) {
    for (let i = 0; i < numJunks; i += 1) {
      const newRect = genJunk({}, this.center, this.color, this.radius);
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
        if (junk.area) this.addPoints(-1 * Math.floor(junk.area));
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

      if (this.junks.length && collisions.length) {
        collisions.forEach(([a, b]) => {
          if (this.junks.includes(a) && this.junks.includes(b)) {
            const newJunks = breakUpCollision(a, b, this.center, DESCENT_RATE);
            this.junks = this.junks.filter(
              (j) => j.id !== a.id && j.id !== b.id,
            );
            this.junks.push(...newJunks);
          }
        });
      }
    }
  }
}
