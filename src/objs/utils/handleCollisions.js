import { Size } from 'paper';
import genJunk from './genJunk';

const NEAREST_NEIGHBORS_TO_CHECK = 5;
const MIN_AREA_SIDE = 5;
const COLLISION_SIZE_DIVISION = 1.4;
const MAX_ANGLE_RATE = 1.3;
const MIN_ANGLE_RATE = -1.3;

const nearestNeighbors = (junks, index, num = NEAREST_NEIGHBORS_TO_CHECK) => {
  const neighbors = [];
  for (let i = -num; i < num; i += 1) {
    const j = (index + i) % junks.length;
    if (j !== index && junks.slice(j, j + 1)[0])
      neighbors.push(junks.slice(j, j + 1)[0]);
  }
  return neighbors;
};

export const checkCollisions = (junks) => {
  const collisions = [];
  const pairs = {};
  junks.forEach((junk, idx) => {
    const neighbors = nearestNeighbors(junks, idx);
    neighbors.forEach((neigh) => {
      if (junk.intersects(neigh) && !pairs[neigh]) {
        collisions.push([junk, neigh]);
        pairs[neigh] = junk;
      }
    });
  });
  return collisions;
};

const average = (a, b) => Math.abs(a - b) / 2 + Math.min(a, b);

export const breakUpCollision = (a, b, center, DESCENT_RATE) => {
  const largerFillColor =
    Size.max(a.size, b.size) === a.size ? a.fillColor : b.fillColor;
  const altitude = average(a.altitude, b.altitude);

  let angleRate = a.angleRate + b.angleRate;
  angleRate = Math.max(angleRate, MAX_ANGLE_RATE);
  angleRate = Math.min(angleRate, MIN_ANGLE_RATE);

  const descentRate = Math.max(
    average(a.descentRate, b.descentRate),
    DESCENT_RATE,
  );
  const theta = average(a.theta, b.theta);

  a.set({
    altitude,
    angleRate,
    descentRate,
    theta,
    size: a.size.divide(COLLISION_SIZE_DIVISION),
  });
  b.set({
    altitude,
    angleRate,
    descentRate,
    theta,
    size: b.size.divide(COLLISION_SIZE_DIVISION),
  });

  const newJunk = genJunk(
    {
      altitude,
      angleRate,
      descentRate,
      size: Size.max(
        a.size.divide(COLLISION_SIZE_DIVISION),
        b.size.divide(COLLISION_SIZE_DIVISION),
        new Size(MIN_AREA_SIDE, MIN_AREA_SIDE),
      ),
      theta,
    },
    center,
    largerFillColor,
  );

  return [newJunk];
};
