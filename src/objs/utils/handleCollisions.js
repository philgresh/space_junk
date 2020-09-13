import { Size } from 'paper';
import { genRandNum } from './util';
import genJunk from './genJunk';

const NEAREST_NEIGHBORS_TO_CHECK = 5;
const MIN_AREA_SIDE = 5;

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

export const breakUpCollision = (a, b, center, DESCENT_RATE) => {
  let altitude = Math.max(a.altitude, b.altitude);
  let angleRate = a.angleRate + b.angleRate;
  let descentRate = Math.max(
    Math.min(a.descentRate, b.descentRate) * 2,
    DESCENT_RATE,
  );
  let size = Size.max(a.size.divide(1.4), b.size.divide(1.4));
  let theta = Math.max(a.theta, b.theta) + genRandNum(-1, 1);

  const maxJunk = genJunk(
    {
      altitude,
      angleRate,
      descentRate,
      size,
      theta,
    },
    center,
    a.fillColor,
  );

  altitude = Math.min(a.altitude, b.altitude);
  angleRate = a.angleRate + b.angleRate;
  descentRate = Math.min(
    Math.max(a.descentRate, b.descentRate) / 2,
    DESCENT_RATE,
  );
  theta = Math.min(a.theta, b.theta) + genRandNum(-1, 1);

  const newJunks = [maxJunk];
  if (size.width > MIN_AREA_SIDE && size.height > MIN_AREA_SIDE) {
    const minJunk = genJunk(
      {
        altitude,
        angleRate,
        descentRate,
        size,
        theta,
      },
      center,
      b.fillColor,
    );
    newJunks.push(minJunk);
  }
  a.remove();
  b.remove();
  return newJunks;
};
