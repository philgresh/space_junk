import { Size } from 'paper';
import { genRandNum } from './util';

const NEAREST_NEIGHBORS_TO_CHECK = 5;

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

export const breakUpCollision = (a, b, genJunk, DESCENT_RATE) => {
  let altitude = Math.max(a.altitude, b.altitude);
  let angleRate = a.angleRate + b.angleRate;
  let descentRate = Math.max(
    Math.min(a.descentRate, b.descentRate) * 2,
    DESCENT_RATE
  );
  let size = Size.max(a.size.divide(2), b.size.divide(2));
  let theta = Math.max(a.theta, b.theta) + genRandNum(-1, 1);

  const maxJunk = genJunk({
    altitude,
    angleRate,
    descentRate,
    size,
    theta,
  });

  altitude = Math.min(a.altitude, b.altitude);
  angleRate = a.angleRate + b.angleRate;
  descentRate = Math.min(
    Math.max(a.descentRate, b.descentRate) / 2,
    DESCENT_RATE
  );
  size = Size.min(a.size.divide(2), b.size.divide(2));
  theta = Math.min(a.theta, b.theta) + genRandNum(-1, 1);

  const minJunk = genJunk({
    altitude,
    angleRate,
    descentRate,
    size,
    theta,
  });
  a.remove();
  b.remove();
  return [maxJunk, minJunk];
};
