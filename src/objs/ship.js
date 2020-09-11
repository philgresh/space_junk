import MovingObject from './movingObject';

const COLOR = "darkMagenta";
const RADIUS = 10;

class Ship extends MovingObject {
  constructor(obj) {
    super({
      game: obj.game,
      pos: obj.pos,
      color: obj.color || COLOR,
      radius: RADIUS,
      vel: [0, 0],
      z: 0,
    })
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
    const grd = ctx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#555");
    grd.addColorStop(1, "#F00");
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

export default Ship;