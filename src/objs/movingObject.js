import { straightLineDistance, genID } from '../util';

function createGradient(ctx, pos, radius, z) {
  const [x, y] = pos;
  const gradient = ctx.createRadialGradient(
    x - radius * .65,
    y,
    .1,
    x - radius * .65,
    y,
    radius
  )
  if (z < 0) {
    gradient.addColorStop(0, "#555");
  } else {
    gradient.addColorStop(0, "#7f9eba");
  }
  gradient.addColorStop(1, "#111");
  return gradient
};

class MovingObject {
  constructor(obj) {
    this.id = genID();
    this.game = obj.game;
    this.pos = obj.pos;   // [100, 150]
    this.vel = obj.vel;   // [10, 10]
    this.radius = obj.radius;
    this.color = obj.color;
    this.z = obj.z;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
    const grd = createGradient(ctx, this.pos, this.radius, this.z)
    ctx.fillStyle = grd;
    ctx.fill();
  }

  move() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }

  isCollidedWith(otherObject) {
    const z1 = this.z;
    const z2 = otherObject.z;
    if (z1 === z2) {
      const distanceBetweenCenters = straightLineDistance(this.pos, otherObject.pos);
      const distanceWithRadius = distanceBetweenCenters - (this.radius + otherObject.radius);
      return (distanceWithRadius <= 0);
    } else return false;
  }
}


export default MovingObject;