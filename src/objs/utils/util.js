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
  return Math.abs(obj.angle - baseAngle) <= range / 2;
};

export const centerOfBBOX = (bbox) => {
  const x = (bbox.right - bbox.left) / 2 + bbox.left;
  const y = (bbox.bottom - bbox.top) / 2 + bbox.top;

  return new Point(x, y);
};

export const extendLineFromMarsSurface = (center, bbox, distance) => {
  const origin = new Point(center.x, center.y);
  const station = centerOfBBOX(bbox);
  const diff = station.subtract(origin);

  const x = station.x + (diff.x / diff.length) * distance;
  const y = station.y + (diff.y / diff.length) * distance;
  return [new Point(x, y), diff];
};

export const outOfBounds = (position, view) => {
  return (
    position.x > view.width ||
    position.x < 0 ||
    position.y > view.height ||
    position.x < 0
  );
};
