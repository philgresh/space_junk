import { Color, Path, Size } from 'paper';
import { genRandAngle, genRandNum, genRandInt, genPosFromTheta } from './util';

const COLOR = new Color('#333');
const RADIUS = 200;
const MIN_RECT_SIZE = 10;
const MAX_RECT_SIZE = 50;
const ORBIT_RADIUS_RANGE = 50;

const DELTA_ACCELERATE_FACTOR = 1 / 10;
const DESCENT_RATE = DELTA_ACCELERATE_FACTOR * 30;

const genJunk = (params, center, color = COLOR, radius = RADIUS) => {
  const {
    altitude = genRandNum(
      radius - ORBIT_RADIUS_RANGE / 2,
      radius + ORBIT_RADIUS_RANGE / 2,
    ),
    angle = genRandInt(0, 360),
    angleRate = genRandNum(-1, 1),
    descentRate = DESCENT_RATE,
    theta = genRandAngle(),
    position = genPosFromTheta(center, theta, altitude),
    size = new Size(
      genRandNum(MIN_RECT_SIZE, MAX_RECT_SIZE),
      genRandNum(MIN_RECT_SIZE, MAX_RECT_SIZE),
    ),
  } = params;

  const newRect = new Path.Rectangle(position, size);
  newRect.position = position;
  newRect.theta = theta;
  newRect.altitude = altitude;
  newRect.angle = angle;
  newRect.angleRate = angleRate;
  newRect.descentRate = descentRate;
  newRect.size = size;
  newRect.rotate(angle);
  newRect.strokeColor = color;
  newRect.strokeWidth = 2;
  const alpha = genRandNum(0.4, 1);
  newRect.fillColor = new Color(color);
  newRect.fillColor.alpha = alpha;
  return newRect;
};

export default genJunk;
