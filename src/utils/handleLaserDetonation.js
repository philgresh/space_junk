import { Size } from 'paper';

const MAX_LASER_DESTROY = 200;
const MIN_SIZE_SIDE = 10;
const MIN_SIZE = new Size(MIN_SIZE_SIDE, MIN_SIZE_SIDE);

export const checkCollisions = (objs, lasers) => {
  const collisions = [];
  const pairs = {};
  objs.forEach((obj) => {
    lasers.forEach((laser) => {
      if (obj.intersects(laser) && !pairs[obj]) {
        collisions.push([obj, laser]);
        pairs[obj] = laser;
      }
    });
  });
  return collisions;
};

export const destroyOrDiminishObj = (obj) => {
  if (obj.area < MAX_LASER_DESTROY) {
    obj.set({ visible: false });
    obj.remove();
    return obj.area;
  }
  // debugger;
  const oldArea = obj.area;
  const newSize = Size.max(obj.size.subtract(MIN_SIZE_SIDE), MIN_SIZE);
  obj.set({ size: newSize, visible: false });
  obj.set({ visible: true });

  return oldArea - obj.area;
};

export const removeLaser = (laser) => {
  laser.visible = false;
  laser.remove();
};
