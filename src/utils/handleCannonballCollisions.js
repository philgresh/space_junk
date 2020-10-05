// import { Size } from 'paper';
import genObj from './genObj';

const MAX_CB_DESTROY = 650;
// const MIN_SIZE_SIDE = 25;
// const MIN_SIZE = new Size(MIN_SIZE_SIDE, MIN_SIZE_SIDE);

export const checkCBCollisions = (objs, cannonballs) => {
  const collisions = [];
  const pairs = {};
  for (let i = 0; i < cannonballs.length; i += 1) {
    const cb = cannonballs[i];
    objs.forEach((obj) => {
      if (obj.visible && obj.intersects(cb) && !pairs[obj]) {
        collisions.push([obj, cb]);
        pairs[obj] = cb;
      }
    });
  }
  return collisions;
};

export const destroyOrDiminishCBObj = (obj, objs, center, addPoints) => {
  if (obj.area <= MAX_CB_DESTROY) {
    obj.visible = false;
    const { area } = obj;
    obj.remove();
    return area;
  }

  const oldSize = obj.size;
  const newSize = oldSize.divide(2);
  obj.set({ size: newSize });
  const newObjs = [];

  newObjs.push(
    genObj(
      {
        altitude: obj.altitude,
        angleRate: obj.angleRate,
        descentRate: obj.descentRate,
        size: oldSize.subtract(newSize).multiply(0.8),
        theta: obj.theta,
        position: obj.position.add(Math.random() * 5),
      },
      center,
      obj.fillColor,
    ),
  );

  const points = obj.area;
  addPoints(points);
  objs.push(newObjs);
  return undefined;
};

export const removeCB = (cb) => {
  cb.visible = false;
  cb.remove();
};
