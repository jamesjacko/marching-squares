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
  gl.clearColor(0.13, 0.15, 0.17, 1);
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
  $('#step2').on('click',function(){
    animate();
    $('#data_container').hide();
  });
  $('#instructions ul li').on('click',function(){
    console.log("HERE");
    step = 5;
    animate();
  });
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

  //vbuffer = gl.createBuffer();
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
      gl.uniform4fv(program.uColor, [0.6, 1, 1, 1.0]);
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
  if(step === 0){
    step = 1;
  } else if (step ===1){
    showData(canvas,size,data,$('#data_container'),devicePixelRatio, function(){$('#step2').show();});

    step = 3;
  } else if(step===3) {
    drawBits(canvas, size, data, dist, border);
    $('#step2').html('Now we have something that is starting to resemble an island, we now need to construct a countour around the edge of the island. This is where the marching cubes algorithm comes into play. Each cube on the grid can be represended by a number. This number is then used to look up the required edge. click on a few cubes to see how this works.<br>When you are finished click the "solve" button below');
    step = 4;
    $('#slider').css('visibility', 'visible');
    $('#solve').css('visibility', 'visible').on('click',function(){
      solveWithAnimation(canvas,size,data,dist,border);
    });
  }

  var cLeft = canvas.offsetLeft,
      cTop = canvas.offsetTop;

  canvas.addEventListener('click', function(e){

    if(step === 0){
      step = 1;
    } else if (step === 4) {
      $('#step2').hide();
      var coords = getGLCoord(canvas,
        e.offsetX * devicePixelRatio, e.offsetY * devicePixelRatio);
      console.log(e.offsetX);

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
  canvas.addEventListener('mousemove', function(e){
    if(e.offsetX < 500){
      canvas.style.cursor = "pointer";
    }else{
      canvas.style.cursor = "auto";
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
  gl.clearColor(0.13, 0.15, 0.17, 1);
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
  drawLine(start, end,	[0.17, 0.7, 0.90, 1]);
  if(step > 3)
    drawLookUpCubes(canvas);
}
