function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function getValues(num){
  var arr = [];
  for (var i = 0; i < num; i++) {
    arr[i] = pad(i.toString(2), 4);
  }
  return arr;
}

function drawLookUpCubes(canvas){
  var arr = getValues(16);
  var line = 0;
  var x = 560;
  var y = 227;
  var distance = 17.5 * devicePixelRatio;
  var size = 2.5 * devicePixelRatio;
  var rightCol = 135 * devicePixelRatio;
  var lineHeight = 28 * devicePixelRatio;

  for (var i = 0; i < arr.length; i++) {
    var point1 = getGLCoord(canvas,
      (x * devicePixelRatio) + ((i % 2) * rightCol),
      (y * devicePixelRatio) - lineHeight * line);

    var point2 = getGLCoord(canvas,
      (x * devicePixelRatio + distance) + ((i % 2) * rightCol),
      (y * devicePixelRatio) - lineHeight * line);

    var point3 = getGLCoord(canvas,
      (x * devicePixelRatio + distance) + ((i % 2) * rightCol),
      (y * devicePixelRatio - distance) - lineHeight * line);

    var point4 = getGLCoord(canvas,
      (x * devicePixelRatio) + ((i % 2) * rightCol),
      (y * devicePixelRatio - distance) - lineHeight * line);

    var dec = parseInt(arr[i],2);
    drawConnections(point1, point2, point3, point4, dec);

    drawLine(point1, point2);
    drawLine(point2, point3);
    drawLine(point3, point4);
    drawLine(point4, point1);

    drawPoint(point1, size, parseInt(arr[i][0]));
    drawPoint(point2, size, parseInt(arr[i][1]));
    drawPoint(point3, size, parseInt(arr[i][2]));
    drawPoint(point4, size, parseInt(arr[i][3]));
    if(i % 2 === 1)
      line++;

  }
}

function drawConnections(point1, point2, point3, point4, dec){
  switch (dec) {
    case 1:
    case 14:
      drawLine({x:point3.x - (point3.x - point4.x)/2, y:point3.y},
               {x:point4.x, y:point4.y + (point1.y - point4.y )/2},
               [0,0,0,1]);
      break;
    case 2:
    case 13:
      drawLine({x:point2.x, y:point3.y + (point2.y - point3.y )/2},
               {x:point3.x - (point3.x - point4.x)/2, y:point3.y},
               [0,0,0,1]);
      break;
    case 3:
      drawLine({x:point1.x, y:point3.y + (point2.y - point3.y )/2},
               {x:point2.x, y:point3.y + (point2.y - point3.y )/2},
               [0,0,0,1]);
      break;
    case 4:
    case 11:
      drawLine({x:point2.x, y:point3.y + (point2.y - point3.y )/2},
               {x:point3.x - (point3.x - point4.x)/2, y:point1.y},
               [0,0,0,1]);
      break;
    case 5:
      drawLine({x:point3.x - (point3.x - point4.x)/2, y:point3.y},
               {x:point4.x, y:point4.y + (point1.y - point4.y )/2},
               [0,0,0,1]);
      drawLine({x:point2.x, y:point3.y + (point2.y - point3.y )/2},
              {x:point3.x - (point3.x - point4.x)/2, y:point1.y},
              [0,0,0,1]);
      break;
    case 6:
    case 9:
      drawLine({x:point3.x - (point3.x - point4.x)/2, y:point2.y},
               {x:point3.x - (point3.x - point4.x)/2, y:point3.y},
               [0,0,0,1]);
      break;
    case 7:
    case 8:
    drawLine({x:point3.x - (point3.x - point4.x)/2, y:point1.y},
             {x:point4.x, y:point4.y + (point1.y - point4.y )/2},
             [0,0,0,1]);

      break;
    case 10:
      drawLine({x:point3.x - (point3.x - point4.x)/2, y:point1.y},
               {x:point4.x, y:point4.y + (point1.y - point4.y )/2},
               [0,0,0,1]);
      drawLine({x:point2.x, y:point3.y + (point2.y - point3.y )/2},
               {x:point3.x - (point3.x - point4.x)/2, y:point3.y},
               [0,0,0,1]);
      break;
    case 12:
      drawLine({x:point1.x, y:point3.y + (point2.y - point3.y )/2},
               {x:point2.x, y:point3.y + (point2.y - point3.y )/2},
               [0,0,0,1]);
      break;
    default:

  }
}
