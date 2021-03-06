const Point = require("./point.js");

const arePointsCollinear = function(p1, p2, p3) {
  return (
    p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y) === 0
  );
};

const areInRange = function(point, point1, point2) {
  if (point1 > point2) {
    [point1, point2] = [point2, point1];
  }
  return point2 >= point && point >= point1;
};

const calcCoOrdinate = function(ratio, coOrdinate1, coOrdinate2) {
  return (1 - ratio) * coOrdinate1 + coOrdinate2 * ratio;
};

class Line {
  constructor(endA, endB) {
    this.endA = new Point(endA.x, endA.y);
    this.endB = new Point(endB.x, endB.y);
  }
  toString() {
    const start = `(${this.endA.x},${this.endA.y})`;
    const end = `(${this.endB.x},${this.endB.y})`;
    return `[Line ${start} to ${end}]`;
  }
  isEqualTo(shape) {
    if (!(shape instanceof Line)) return false;
    return (
      (this.endA.isEqualTo(shape.endA) && this.endB.isEqualTo(shape.endB)) ||
      (this.endA.isEqualTo(shape.endB) && this.endB.isEqualTo(shape.endA))
    );
  }
  get length() {
    return this.endA.findDistanceTo(this.endB);
  }
  get slope() {
    return (this.endB.y - this.endA.y) / (this.endB.x - this.endA.x);
  }
  isParallelTo(otherLine) {
    return (
      otherLine instanceof Line &&
      otherLine.slope === this.slope &&
      !arePointsCollinear(this.endA, this.endB, otherLine.endA)
    );
  }
  findX(YAxisPoint) {
    if (!areInRange(YAxisPoint, this.endB.y, this.endA.y)) return NaN;
    return (YAxisPoint - this.endA.y) / this.slope + this.endA.x;
  }
  findY(XAxisPoint) {
    if (!areInRange(XAxisPoint, this.endB.x, this.endA.x)) return NaN;
    return this.slope * (XAxisPoint - this.endA.x) + this.endA.y;
  }
  hasPoint(point) {
    return this.findX(point.y) === point.x || this.findY(point.x) === point.y;
  }
  findPointFromStart(distance) {
    if (this.length < distance || distance < 0) return null;
    const lengthRatio = distance / this.length;
    const xCoOrdinate = calcCoOrdinate(lengthRatio, this.endA.x, this.endB.x);
    const yCoOrdinate = calcCoOrdinate(lengthRatio, this.endA.y, this.endB.y);
    return new Point(xCoOrdinate, yCoOrdinate);
  }
  findPointFromEnd(distance) {
    if (this.length < distance) return null;
    return this.findPointFromStart(this.length - distance);
  }
  split() {
    const distance = this.length / 2;
    const midPoint = this.findPointFromStart(distance);
    const line1 = new Line(this.endA, midPoint);
    const line2 = new Line(midPoint, this.endB);
    return [line1, line2];
  }
}

module.exports = Line;
