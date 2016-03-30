

function showData(canvas, size, data, $dataContainer, dpr, callback){
  var offset = Math.floor(((canvas.height) / size)/dpr);
  $dataContainer.css({'letter-spacing': (offset - 6.7) + "px"});
  var y = 29;
  var x = 0;

  (function printLoop (x,y) {
    var interval = 0.1 * y;
     setTimeout(function () {

       $dataContainer.append(data[y*30 + x]);
       x++;
       if(x===30){
        $dataContainer.append("<br>");
        x=0;
        y--;
      }
        if (y > -1) printLoop(x,y);  //  decrement i and call myLoop again if i > 0
        else callback();
     }, interval);
  })(x,y);
}


function showDots(canvas, size, data, dist, border){
  var offset = Math.floor((canvas.height) / size);
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      //  We minus the y value off the height to reverse the axes
      //  putting it inline with css coordinate system.

      var coords = getGLCoord(canvas, (x * offset) + border,
      (y * offset) + border);

      dataCoords[y * size + x] = {
        x: coords.x,
        y: coords.y
      };

      drawPoint(coords, 5, data[y*size + x]);
      if(x < size && y < size){
        var point1 = dataCoords[y * size + x];
        var point2 = dataCoords[y * size + x + 1];
        var point3 = dataCoords[(y - 1) * size + x + 1];
        var point4 = dataCoords[(y - 1) * size + x];
        var binary = data[y * size + x] + "" + data[y * size + x + 1] + "" +
          data[(y - 1) * size + x + 1] + "" + data[(y - 1) * size + x];
        var dec = parseInt(binary,2);
        if(edges[y * size + x])
          drawConnections(point1, point2, point3, point4, dec);
      }

    }
  }
}

function drawGrid(canvas, size, border){
  var offset = Math.floor((canvas.height) / size);
  for(var i = 0; i < size; i++){
    var start = {
      x: border,
      y: offset * i + border
    };
    var end = {
      x: offset * (size - 1) + border,
      y: offset * i + border
    };
    drawLine(getGLCoord(canvas, start.x, start.y),
      getGLCoord(canvas, end.x, end.y));

    start = {
      x: offset * i + border,
      y: border
    };
    end = {
      x: offset * i + border,
      y: offset * (size - 1) + border
    };
    drawLine(getGLCoord(canvas, start.x, start.y),
      getGLCoord(canvas, end.x, end.y));
  }
}

function solveWithNoAnimation(canvas, size, data){
  // (function printLoop (i) {
  //   var y = size - (size*size - i) / size;
  //   var interval = 0.2 * y;
  //    setTimeout(function () {
  //      if(i < size*size && i % size === 0)
  //       $dataContainer.append("<br>");
  //      $dataContainer.append(data[size*size-i]);
  //
  //       if (--i) printLoop(i);  //  decrement i and call myLoop again if i > 0
  //    }, interval);
  // })(i);


  for (var y = size-1; y >= 0; y--) {
    for (var x = 0; x < size-1; x++) {

      var point1 = dataCoords[y * size + x];
      var point2 = dataCoords[y * size + x + 1];
      var point3 = dataCoords[(y - 1) * size + x + 1];
      var point4 = dataCoords[(y - 1) * size + x];
      var binary = data[y * size + x] + "" + data[y * size + x + 1] + "" +
        data[(y - 1) * size + x + 1] + "" + data[(y - 1) * size + x];
      var dec = parseInt(binary,2);
      if(edges[y * size + x])
        drawConnections(point1, point2, point3, point4, dec);
    }
  }



}

function solveWithAnimation(canvas, size, data, dist, border){
  var x = 0, y = size-1;
  (function printLoop (x, y) {
    edges[y * size + x] = 1;
    var point1 = dataCoords[y * size + x];
    var point2 = dataCoords[y * size + x + 1];
    var point3 = dataCoords[(y - 1) * size + x + 1];
    var point4 = dataCoords[(y - 1) * size + x];




    var binary = data[y * size + x] + "" + data[y * size + x + 1] + "" +
      data[(y - 1) * size + x + 1] + "" + data[(y - 1) * size + x];



    var dec = parseInt(binary,2);
    drawBits(canvas, size, data, dist, border);

    drawPoint(point1, 5, binary[0]==1? 2: 3);
    drawPoint(point2, 5, binary[1]==1? 2: 3);
    drawPoint(point3, 5, binary[2]==1? 2: 3);
    drawPoint(point4, 5, binary[3]==1? 2: 3);

    drawMainCube(canvas, [parseInt(binary[0]), parseInt(binary[1]),
      parseInt(binary[2]), parseInt(binary[3])],   620, 430);

    $('#select').text("Cube selected!");

    $('#selectedIndex .binary').text(binary);
    $('#selectedIndex').show();
    $('#indexLabels i').show();
    $('#selectedIndex .decimal').text("=" + dec);
    $('#instructions ul li').css({'font-weight': 'normal', 'color':'inherit'});
    $('#instructions ul li:nth-child(' + (dec + 1) + ')').css(
      {'font-weight': 'bold','color': 'red'});

    var interval = $('#slider').slider('value');
     setTimeout(function () {
       if(x === size-2){
         x = 0;
         y--;
       } else{
         x++;
       }
       if(y > 0)
        printLoop(x,y);
     }, interval);
  })(x,y);

}

/***
  Convert real pixel values into webgl -1, 1 2d space
*/
function getRealCoord(canvas, x, y){
  x = ((x + 1) / 2) * canvas.width;
  y = ((y + 1) / 2) * canvas.height;
  return {
    x: x,
    y: y
  };
}

/***
  Convert webgl -1, 1 space into pixels
*/
function getGLCoord(canvas, x, y){
  x = ((x / canvas.width) * 2) -  1;
  y = ((y / canvas.height) * 2) -  1;
  return {
    x: x,
    y: y
  };
}
