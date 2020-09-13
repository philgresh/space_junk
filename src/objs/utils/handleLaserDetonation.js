import { Size } from 'paper';

const MAX_LASER_DESTROY = 200;
const MIN_SIZE_SIDE = 10;
const MIN_SIZE = new Size(MIN_SIZE_SIDE, MIN_SIZE_SIDE);

export const checkCollisions = (junks, lasers) => {
  const collisions = [];
  const pairs = {};
  junks.forEach((junk) => {
    lasers.forEach((laser) => {
      if (junk.intersects(laser) && !pairs[junk]) {
        collisions.push([junk, laser]);
        pairs[junk] = laser;
      }
    });
  });
  return collisions;
};

export const destroyOrDiminishJunk = (junk) => {
  if (junk.area < MAX_LASER_DESTROY) {
    junk.set({ visible: false });
    junk.remove();
    return junk.area;
  }
  // debugger;
  const oldArea = junk.area;
  const newSize = Size.max(junk.size.subtract(MIN_SIZE_SIDE), MIN_SIZE);
  junk.set({ size: newSize, visible: false });
  junk.set({ visible: true });

  return oldArea - junk.area;
};

export const removeLaser = (laser) => {
  laser.visible = false;
  laser.remove();
};
