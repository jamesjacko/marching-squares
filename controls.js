tsPoints = [];

function thresholdSelector(selected, x, y, dist){
  for (var i = 0; i < 4; i++) {
    var point = {
      x: x * devicePixelRatio + ((dist * devicePixelRatio) * i) - 10*devicePixelRatio,
      y: y * devicePixelRatio - 10,
      x2: x * devicePixelRatio + ((dist * devicePixelRatio) * i) + 10*devicePixelRatio,
      y2: y * devicePixelRatio + 10*devicePixelRatio
    };
    tsPoints.push(point);
    point = getGLCoord(canvas,point.x,point.y);
    drawPoint(point, 10*devicePixelRatio, selected === i);
  }
}
