function init(){
  canvas = document.getElementById("mycanvas");



  var desiredWidthInCSSPixels = 800;
  var desiredHeightInCSSPixels = 500;

  // set the display size of the canvas.
  canvas.style.width = desiredWidthInCSSPixels + "px";
  canvas.style.height = desiredHeightInCSSPixels + "px";

  // set the size of the drawingBuffer
  devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = desiredWidthInCSSPixels * devicePixelRatio;
  canvas.height = desiredHeightInCSSPixels * devicePixelRatio;

  gl = canvas.getContext("webgl");


  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.09, 0.09, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // compile shaders into DOM
  var v = document.getElementById("vertex").firstChild.nodeValue;
  var f = document.getElementById("fragment").firstChild.nodeValue;

  var vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, v);
  gl.compileShader(vs);

  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, f);
  gl.compileShader(fs);

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Make sure the shaders were correctly compiled
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(vs));
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(fs));
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.log(gl.getProgramInfoLog(program));

  animate();
  $("#step1").on('click', function(e){
    animate();
    $("#step1").hide();
  });
  // $('#step2').on('click',function(){
  //   animate();
  //   $('#data_container').hide();
  // });
  $('#instructions ul li').on('click',function(){
    step = 5;
    animate();
  });

  $('#thresh').on('click', function(){
    for (var i = 0; i < data.length; i++) {
      data[i] = data[i] > thresh ? 1 : 0;
    }
    showData(canvas,30,data,$('#data_container'),devicePixelRatio,function(){
      $('#step2').html("Now we have the binary data for our contour we need to look at each cube formed by the data. Click the button bellow to see the cubes. <br><button id='vis' onclick='vis();'>Continue</button>");
      gl.clearColor(0.08, 0.09, 0.09, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
  });

}
function vis(){
  $('#data_container').hide();
  step = steps.VISUALISE;
  animate();
}
function drawLine(start, end, color){
    var vertices = new Float32Array([
      start.x, start.y, 0,
      end.x, end.y, 0
    ]);

    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    itemSize = 3;
    numItems = vertices.length / itemSize;

    gl.useProgram(program);
    program.uColor = gl.getUniformLocation(program, "uColor");
    if(typeof color === "undefined")
      gl.uniform4fv(program.uColor, [0.8, 0.8, 0.8, 1.0]);
    else
      gl.uniform4fv(program.uColor, color);
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, numItems);

}

function drawPoint(point,size, on){

  var aspect = canvas.width / canvas.height;

  var width = size/canvas.width * devicePixelRatio;
  var height = size/canvas.height * devicePixelRatio;

  var vertices = new Float32Array([
    point.x - width, point.y - width * aspect,  // L
    point.x + width, point.y - width * aspect,
    point.x + width, point.y + width * aspect,

    point.x + width, point.y + width * aspect,  // L
    point.x - width, point.y + width * aspect,
    point.x - width, point.y - width * aspect
  ]);

  vbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  itemSize = 2;
  numItems = vertices.length / itemSize;


  gl.useProgram(program);

  program.uColor = gl.getUniformLocation(program, "uColor");
  if(on)
    if(on === 2)
      gl.uniform4fv(program.uColor, [1, 0, 0, 1.0]);
    else if(on === 3)
      gl.uniform4fv(program.uColor, [1, 0.68, 0.68, 1.0]);
    else
      gl.uniform4fv(program.uColor, [1, 1, 1, 1.0]);
  else
      gl.uniform4fv(program.uColor, [0.4, 0.4, 0.4, 1.0]);



  program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, numItems);
}


function animate(){

  var dist = 30;
  var offset = 40;
  var size = 30;



  var border = 20;
  if(step === steps.DATA){
    step = steps.SHOWDATA;
  } else if (step === steps.SHOWDATA){
    showData(canvas,size,data,$('#data_container'),devicePixelRatio, function(){$('#step2').show();
      gl.clearColor(0.08, 0.09, 0.09, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      thresholdSelector(-1, 610, 150, 30);
    });

    //step = steps.THRESHOLD;
  } else if(step===steps.VISUALISE) {
    drawBits(canvas, size, data, dist, border);
    $('#step2').html('Now we have something that is starting to resemble an island, we now need to construct a countour around the edge of the island. This is where the marching cubes algorithm comes into play. Each cube on the grid can be represended by a number. This number is then used to look up the required edge. click on a few cubes to see how this works.<br>When you are finished click the "solve" button below');
    step = 4;
    $('#solve').css('visibility', 'visible').on('click',function(){
      solveWithAnimation(canvas,size,data,dist,border);
    });
  }

  var cLeft = canvas.offsetLeft,
      cTop = canvas.offsetTop;

  canvas.addEventListener('click', function(e){

    if(step === steps.DATA){
      step = steps.SHOWDATA;

    } if(step === steps.SHOWDATA){
      curPoint = {x: e.offsetX*devicePixelRatio,
        y: e.offsetY};
      for (var i = 0; i < tsPoints.length; i++) {
        if(curPoint.x + 10 * devicePixelRatio > tsPoints[i].x &&
          curPoint.x + 10 * devicePixelRatio < tsPoints[i].x2 &&
          curPoint.y - 10 * 2 * devicePixelRatio - 5 > tsPoints[i].y &&
          curPoint.y - 10 * 2 * devicePixelRatio - 5 < tsPoints[i].y2){
            gl.clearColor(0.08, 0.09, 0.09, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            thresholdSelector(i, 610, 150, 30);


          break;

        }

      }
    } else if (step === steps.CLICK) {
      $('#step2').hide();
      var coords = getGLCoord(canvas,
        e.offsetX * devicePixelRatio, e.offsetY * devicePixelRatio);

      // compare to dataCoords here
      var elem = 0;
      for(var i = 0; i < dataCoords.length; i++){
        if(coords.x < dataCoords[i].x){
          if(-coords.y < dataCoords[i].y){
            elem = i;
            break;
          }
        }
      }
      drawBits(canvas, size, data, dist, border);
      drawPoint({x: dataCoords[elem].x,
        y: dataCoords[elem].y}, 5,
        data[elem]==1? 2: 3);
      drawPoint({x: dataCoords[elem-1].x,
        y: dataCoords[elem-1].y}, 5,
        data[elem-1]==1? 2: 3);
      drawPoint({x: dataCoords[elem-size].x,
        y: dataCoords[elem-size].y}, 5,
        data[elem-size]==1? 2: 3);
      drawPoint({x: dataCoords[elem-size-1].x,
        y: dataCoords[elem-size-1].y}, 5,
        data[elem-size-1]==1? 2: 3);

      var point2 = dataCoords[elem];
      var point1 = dataCoords[elem-1];
      var point3 = dataCoords[elem-size];
      var point4 = dataCoords[elem-size-1];




      drawMainCube(canvas,[data[elem - 1], data[elem],
        data[elem-size], data[elem-size-1]],
        620, 430);
      $('#instructions').show();
      $('#select').text("Cube selected!");
      var binary = data[elem - 1] + "" + data[elem] + "" +
        data[elem-size] + "" + data[elem-size-1];
      $('#selectedIndex .binary').text(binary);
      $('#selectedIndex').show();
      $('#indexLabels i').show();
      var dec = parseInt(binary,2);
      $('#selectedIndex .decimal').text("=" + dec);
      $('#instructions ul li').css({'font-weight': 'normal', 'color':'inherit'});
      $('#instructions ul li:nth-child(' + (dec + 1) + ')').css(
        {'font-weight': 'bold','color': 'red'});
      drawConnections(point1, point2, point3, point4, dec);


    }

  });
  canvas.addEventListener('click', function(e){
    if(e.offsetX < 500){
      canvas.style.cursor = "pointer";
      if(step === steps.CLICK){
        $('#step2').hide();
        var coords = getGLCoord(canvas,
          e.offsetX * devicePixelRatio, e.offsetY * devicePixelRatio);

        // compare to dataCoords here
        var elem = 0;
        for(var i = 0; i < dataCoords.length; i++){
          if(coords.x < dataCoords[i].x){
            if(-coords.y < dataCoords[i].y){
              elem = i;
              break;
            }
          }
        }
        drawBits(canvas, size, data, dist, border);
        drawPoint({x: dataCoords[elem].x,
          y: dataCoords[elem].y}, 5,
          data[elem]==1? 2: 3);
        drawPoint({x: dataCoords[elem-1].x,
          y: dataCoords[elem-1].y}, 5,
          data[elem-1]==1? 2: 3);
        drawPoint({x: dataCoords[elem-size].x,
          y: dataCoords[elem-size].y}, 5,
          data[elem-size]==1? 2: 3);
        drawPoint({x: dataCoords[elem-size-1].x,
          y: dataCoords[elem-size-1].y}, 5,
          data[elem-size-1]==1? 2: 3);

        var point2 = dataCoords[elem];
        var point1 = dataCoords[elem-1];
        var point3 = dataCoords[elem-size];
        var point4 = dataCoords[elem-size-1];




        drawMainCube(canvas,[data[elem - 1], data[elem],
          data[elem-size], data[elem-size-1]],
          620, 430);
        $('#instructions').show();
        $('#select').text("Cube selected!");
        var binary = data[elem - 1] + "" + data[elem] + "" +
          data[elem-size] + "" + data[elem-size-1];
        $('#selectedIndex .binary').text(binary);
        $('#selectedIndex').show();
        $('#indexLabels i').show();
        var dec = parseInt(binary,2);
        $('#selectedIndex .decimal').text("=" + dec);
        $('#instructions ul li').css({'font-weight': 'normal', 'color':'inherit'});
        $('#instructions ul li:nth-child(' + (dec + 1) + ')').css(
          {'font-weight': 'bold','color': 'red'});
        drawConnections(point1, point2, point3, point4, dec);
      }
    }else{
      if(step === steps.SHOWDATA){
        curPoint = {x: e.offsetX*devicePixelRatio,
          y: e.offsetY};
        if(devicePixelRatio == 1){
          if(curPoint.y > 356 && curPoint.y < 368){
            if(curPoint.x > 594 && curPoint.x < 606){
              gl.clearColor(0.08, 0.09, 0.09, 1);
              gl.clear(gl.COLOR_BUFFER_BIT);
              thresh = 0;
              thresholdSelector(thresh, 610, 150, 30);
            }
            if(curPoint.x > 624 && curPoint.x < 636){
              gl.clearColor(0.08, 0.09, 0.09, 1);
              gl.clear(gl.COLOR_BUFFER_BIT);
              thresh = 1;
              thresholdSelector(thresh, 610, 150, 30);
            }

            if(curPoint.x > 654 && curPoint.x < 666){
              gl.clearColor(0.08, 0.09, 0.09, 1);
              gl.clear(gl.COLOR_BUFFER_BIT);
              thresh = 2;
              thresholdSelector(thresh, 610, 150, 30);
            }

            if(curPoint.x > 684 && curPoint.x < 696){
              gl.clearColor(0.08, 0.09, 0.09, 1);
              gl.clear(gl.COLOR_BUFFER_BIT);
              thresh = 3;
              thresholdSelector(thresh, 610, 150, 30);
            }

            canvas.style.cursor = "pointer";
            $('.num').css({"font-weight":"normal","color":"inherit"});
            for (var n = thresh; n < tsPoints.length; n++) {
              $('.n'+ (n + 1)).css({"font-weight":"bold","color":"rgb(255,255,255)"});
            }
          }
        }
        for (var i = 0; i < tsPoints.length; i++) {
          if(curPoint.x + 10 * devicePixelRatio > tsPoints[i].x &&
            curPoint.x + 10 * devicePixelRatio < tsPoints[i].x2 &&
            curPoint.y - 10 * 2 * devicePixelRatio - 5 > tsPoints[i].y &&
            curPoint.y - 10 * 2 * devicePixelRatio - 5 < tsPoints[i].y2){
            canvas.style.cursor = "pointer";
            $('.num').css({"font-weight":"normal","color":"inherit"});
            for (var n = i; n < tsPoints.length; n++) {
              $('.n'+ (n + 1)).css({"font-weight":"bold","color":"rgb(255,255,255)"});
            }
            gl.clearColor(0.08, 0.09, 0.09, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            thresh = i;
            thresholdSelector(i, 610, 150, 30);
            break;

          } else {
            canvas.style.cursor = "auto";
          }

        }
      } else {
        canvas.style.cursor = "auto";
      }
    }
  });


}

function drawMainCube(canvas, data, x, y){
  // to much to do on each point placement to
  // warrent a loop
  size = 5 * devicePixelRatio;
  distance = 60 * devicePixelRatio;
  var point1 = getGLCoord(canvas,
    x * devicePixelRatio,
    y * devicePixelRatio);

  var point2 = getGLCoord(canvas,
    x * devicePixelRatio + distance,
    y * devicePixelRatio);

  var point3 = getGLCoord(canvas,
    x * devicePixelRatio + distance,
    y * devicePixelRatio - distance);

  var point4 = getGLCoord(canvas,
    x * devicePixelRatio,
    y * devicePixelRatio - distance);

  drawLine(point1, point2);
  drawLine(point2, point3);
  drawLine(point3, point4);
  drawLine(point4, point1);

  drawPoint(point1, size, data[0]);
  drawPoint(point2, size, data[1]);
  drawPoint(point3, size, data[2]);
  drawPoint(point4, size, data[3]);

}

function drawBits(canvas, size, data, dist, border){
  gl.clearColor(0.08, 0.09, 0.09, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawGrid(canvas, size, border);
  showDots(canvas, size, data, dist, border);
  var start = {
    x: 0.25,
    y: -1
  };
  var end = {
    x: 0.25,
    y: 1
  };
  drawLine(start, end,	[0.49, 0.7, 0.30, 1]);
  if(step > 3)
    drawLookUpCubes(canvas);
}

function testing(){
  var testData = Array.apply(null, Array(30*30)).map(function() {
    return Math.floor(Math.random() * 9) + 1 ;
  });



  console.log(testData.sort());

}
