import {Rectangle} from 'paper';
import { randomVec } from '../util';
import MovingObject from './MovingObject.js';

const COLOR = '#333';
const RADIUS = 20;

class SpaceJunk extends MovingObject {
  constructor(obj) {
    super({
      pos: obj.pos,
      color: obj.color || COLOR,
      radius: obj.radius || RADIUS,
      vel: randomVec(3),
      z: obj.z || Math.floor(Math.random() * -2 + 1),
    });
  }
}

export default SpaceJunk;
