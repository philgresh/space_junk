import { randomVec } from "./util.js";
import MovingObject from "./movingObject.js";

const COLOR = "#333";
const RADIUS = 20;

class Asteroid extends MovingObject {
  constructor(obj) {
    super({
      game: obj.game,
      pos: obj.pos,
      color: obj.color || COLOR,
      radius: obj.radius || RADIUS,
      vel: randomVec(3),
      z: obj.z || Math.floor(Math.random() * -2 + 1)
    });
  }

}

export default Asteroid;