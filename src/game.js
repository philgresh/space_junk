import Asteroid from './objs/asteroid';
import Ship from './objs/ship';

class Game {
  constructor(width, height, numAsteroids = 20) {
    this.allObjects = [];
    this.ship;
    this.DIM_X = width;
    this.DIM_Y = height;
    this.NUM_ASTEROIDS = numAsteroids;
    this.addAllObjects();
  }

  step(ctx) {
    // debugger
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    let i = 0;
    while (i < this.allObjects.length) {
      const obj = this.allObjects[i];
      // move all
      obj.move();

      // remove any off-screen
      if (this._isCompletelyOffScreen(obj)) {
        this.remove(i);
        // console.log('object removed', this);
      } else {
        // create clones for almost-off-screen

        // check for collisions
        // this.checkCollisionsOnObj(obj)

        // draw all
        obj.draw(ctx);
        i++;
      }
    }
  }
  cloneSideObjs(obj) {
    let [x, y] = obj.pos;
    const radius = obj.radius;
    // (x + radius > this.DIM_X) ||
    //   (x - radius < 0) ||
    //   (y + radius > this.DIM_Y) ||
    //   (y - radius < 0)
    if (x + radius > this.DIM_X) {
      // Moving off to the right
      const pos = 0 - this.DIM_X;
      console.log(pos);
      // if (this.allObjects.includes())
      // this.cloneObj({
      //   ...obj
      // })
    }
  }

  checkCollisionsOnObj(obj) {
    const allObjs = this.allObjects;
    for (let i = 0; i < allObjs.length - 1; i++) {
      const otherObj = allObjs[j];
      if (obj.isCollidedWith(otherObj)) {
        this.remove(obj);
        this.remove(otherObj);
        break;
      }
    }
  }

  remove(idx) {
    this.allObjects.splice(idx, 1);
  }

  addAllObjects() {
    // this.ship = new Ship({
    //   game: this,
    //   pos: this._randomPosition(),
    // });
    const backgroundAsteroids = this._genAsteroids(this.NUM_ASTEROIDS / 2, -1);
    const foregroundAsteroids = this._genAsteroids(this.NUM_ASTEROIDS / 2, 0);
    this.allObjects = backgroundAsteroids.concat(foregroundAsteroids);
  }

  cloneObj(obj) {
    if (obj.z === 0) {
      // add to main field
    } else {
      // add to background
    }
  }

  _randomPosition() {
    const randX = Math.random() * this.DIM_X;
    const randY = Math.random() * this.DIM_Y;
    return [randX, randY];
  }

  _isPartiallyOffScreen({ pos, radius }) {
    return (
      this._isCompletelyOffScreen({ pos, radius: 0 }) &&
      !this._isCompletelyOffScreen({ pos, radius })
    );
  }

  _isCompletelyOffScreen({ pos: [x, y], radius }) {
    return (
      x - radius > this.DIM_X ||
      x + radius < 0 ||
      y - radius > this.DIM_Y ||
      y + radius < 0
    );
  }

  _genAsteroids(num, z = 0) {
    const asteroids = [];
    for (let i = 0; i < num; i++) {
      asteroids.push(
        new Asteroid({
          z,
          game: this,
          pos: this._randomPosition(),
          radius: Math.random() * 20 + 10,
        })
      );
    }
    return asteroids;
  }
}

export default Game;
