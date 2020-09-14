// import { Size } from 'paper';
import genJunk from './genJunk';

const MAX_CB_DESTROY = 650;
// const MIN_SIZE_SIDE = 25;
// const MIN_SIZE = new Size(MIN_SIZE_SIDE, MIN_SIZE_SIDE);

export const checkCBCollisions = (junks, cannonballs) => {
  const collisions = [];
  const pairs = {};
  for (let i = 0; i < cannonballs.length; i += 1) {
    const cb = cannonballs[i];
    junks.forEach((junk) => {
      if (junk.visible && junk.intersects(cb) && !pairs[junk]) {
        collisions.push([junk, cb]);
        pairs[junk] = cb;
      }
    });
  }
  return collisions;
};

export const destroyOrDiminishCBJunk = (junk, junks, center, addPoints) => {
  if (junk.area <= MAX_CB_DESTROY) {
    junk.visible = false;
    junk.remove();
    return junk.area;
  }

  const oldSize = junk.size;
  const newSize = oldSize.divide(2);
  junk.set({ size: newSize });
  const newJunks = [];

  newJunks.push(
    genJunk(
      {
        altitude: junk.altitude,
        angleRate: junk.angleRate,
        descentRate: junk.descentRate,
        size: oldSize.subtract(newSize).multiply(0.8),
        theta: junk.theta,
        position: junk.position.add(Math.random() * 5),
      },
      center,
      junk.fillColor,
    ),
  );

  const points = junk.area;
  addPoints(points);
  junks.push(newJunks);
  return undefined;
};

export const removeCB = (cb) => {
  cb.visible = false;
  cb.remove();
};
