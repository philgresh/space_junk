import { Point, Item } from 'paper';

class MovingObject extends Item {
  constructor(params) {
    this.theta = params.theta;
    this.pos = new Point(params.pos);
    this.vel = new Point(params.vel);
    this.color = params.color;
    this.shape = params.shape;
  }


}

export default MovingObject;
