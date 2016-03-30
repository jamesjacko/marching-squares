dataCoords = [];
edges = [];
step=0;
data = generateData(30, 5);
/***
  Gereate Date for the animation
**/

$(function(){
  $('#slider').slider({
    min: 0,
    max: 500,
    value:50
  });
});

function generateData(size, edge){
  count = 0;
  var data = Array.apply(null, Array(size*size)).map(function() { return 1; });
  edges = Array.apply(null, Array(size*size)).map(function() { return 0; });
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(y === 0 || y === size - 1 ||x === 0 || x === size - 1)
        data[y * size + x] = 0;
    }
  }

  for(var i = 0; i <= edge; i++){
    for(var x = 0; x < size; x++){
      for(var y = 0; y < size; y++){
        if(data[y * size + x] === 0){
          makeZ(x, y, data, size);
        }
      }
    }
  }

  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(data[y * size + x] === 1){
        var yup = false;
        for(i = -1; i < 2; i++){
          if(i !== 0){
            if(data[(y+i) * size + x] === 1)
              yup = true;
            if(data[y * size + x+i] === 1)
              yup = true;
          }
        }
        if(!yup)
          data[y * size + x] = 0;
      }
    }
  }

  return data;
}

/***
  Puts zeros in the dataset
**/
function makeZ(x, y, data, size){
  for(var mx = -1; mx < 2; mx++){
    for(var my = -1; my < 2; my++){
      if(mx+x > -1 && mx+x < size && my+y > -1 && my+y < size)
        if(Math.random() > 0.95)
          data[(y + my) * size + x + mx] = 0;
    }
  }
}
