// function inherits(child, parent) {
//     Surrogate() {};
//     Surrogate.prototype = parent.prototype;
//     child.prototype = new Surrogate(); 
//     child.prototype.constructor = child; 
// }


const Util = {
  inherits(child, parent) {
    function Surrogate() { };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
    child.prototype.constructor = child;
  },
  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  straightLineDistance(pos1, pos2) {
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;
    return (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
  },
  genID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = Util; 