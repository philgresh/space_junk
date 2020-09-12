import { Point } from 'paper';

export const randomVec = (length) => {
  const deg = 2 * Math.PI * Math.random();
  return scale([Math.sin(deg), Math.cos(deg)], length);
};

export const scale = (vec, m) => {
  return [vec[0] * m, vec[1] * m];
};

export const straightLineDistance = (pos1, pos2) => {
  const [x1, y1] = pos1;
  const [x2, y2] = pos2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const genID = () => {
  // Math.random should be unique (enough) because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const getOffset = (element) => {
  var bound = element.getBoundingClientRect();
  var html = document.documentElement;

  return {
    top: bound.top + window.pageYOffset - html.clientTop,
    left: bound.left + window.pageXOffset - html.clientLeft,
  };
};

export const genRandAngle = () => Math.random() * 2 * Math.PI;
export const genRandInt = (min = 0, max) =>
  Math.floor(Math.random() * (max - min) + min);
export const genRandNum = (min = 0, max) => Math.random() * (max - min) + min;

export const genPosFromTheta = (center, theta, altitude) => {
  const x = center.x - altitude * Math.cos(theta);
  const y = center.y - altitude * Math.sin(theta);
  return new Point(x, y);
};

export const withinXangle = (obj, baseAngle, range) => {
  return new Boolean(Math.abs(obj.angle - baseAngle) <= range / 2);
};