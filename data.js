dataCoords = [];
edges = [];
steps = {
  DATA: 0,
  SHOWDATA: 1,
  THRESHOLD: 2,
  VISUALISE: 3,
  CLICK: 4
};
thresh = 2;
step=steps.DATA;
data = generateData(30, 30);


/***
  Gereate Date for the animation
**/


function generateData(size, edge){
  count = 0;
  var val = 4;
  edge = 40;
  var data = Array.apply(null, Array(size*size)).map(function() { return val; });
  edges = Array.apply(null, Array(size*size)).map(function() { return 0; });
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(y === 0 || y === size - 1 ||x === 0 || x === size - 1)
        data[y * size + x] = 0;
    }
  }
  val --;
  for(var i = 0; i <= edge; i++){
    for(var x = 0; x < size; x++){
      for(var y = 0; y < size; y++){
        if(data[y * size + x] === 0){
          makeZ(x, y, data, size, 0);
        }
      }
    }
  }

  var val = 3;
  edge = 30;
  var data2 = Array.apply(null, Array(size*size)).map(function() { return val; });
  edges = Array.apply(null, Array(size*size)).map(function() { return 0; });
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(y === 0 || y === size - 1 ||x === 0 || x === size - 1)
        data2[y * size + x] = 0;
    }
  }
  val --;
  for(var i = 0; i <= edge; i++){
    for(var x = 0; x < size; x++){
      for(var y = 0; y < size; y++){
        if(data2[y * size + x] === 0){
          makeZ(x, y, data2, size, 0);
        }
      }
    }
  }
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      data[y * size + x] = data2[y * size + x] > data[y * size + x] ?
        data2[y * size + x] : data[y * size + x];
    }
  }


  var val = 2;
  edge = 20;
  var data2 = Array.apply(null, Array(size*size)).map(function() { return val; });
  edges = Array.apply(null, Array(size*size)).map(function() { return 0; });
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(y === 0 || y === size - 1 ||x === 0 || x === size - 1)
        data2[y * size + x] = 0;
    }
  }
  val --;
  for(var i = 0; i <= edge; i++){
    for(var x = 0; x < size; x++){
      for(var y = 0; y < size; y++){
        if(data2[y * size + x] === 0){
          makeZ(x, y, data2, size, 0);
        }
      }
    }
  }
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      data[y * size + x] = data2[y * size + x] > data[y * size + x] ?
        data2[y * size + x] : data[y * size + x];
    }
  }


  var val = 1;
  edge = 10;
  data2 = Array.apply(null, Array(size*size)).map(function() { return val; });
  edges = Array.apply(null, Array(size*size)).map(function() { return 0; });
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      if(y === 0 || y === size - 1 ||x === 0 || x === size - 1)
        data2[y * size + x] = 0;
    }
  }
  val --;
  for(var i = 0; i <= edge; i++){
    for(var x = 0; x < size; x++){
      for(var y = 0; y < size; y++){
        if(data2[y * size + x] === 0){
          makeZ(x, y, data2, size, 0);
        }
      }
    }
  }
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      data[y * size + x] = data2[y * size + x] > data[y * size + x] ?
        data2[y * size + x] : data[y * size + x];
    }
  }

  // var last = val;
  // edge -= 10;
  // for(var e = edge; e > 0; e-=10){
  //     for(var x = 0; x < size; x++){
  //       for(var y = 0; y < size; y++){
  //         if(data[y * size + x] === val){
  //           makeZ(x, y, data, size, val);
  //         }
  //       }
  //     }
  //   val--;
  // }


  // for(var x = 0; x < size; x++){
  //   for(var y = 0; y < size; y++){
  //     if(data[y * size + x] === 1){
  //       var yup = false;
  //       for(i = -1; i < 2; i++){
  //         if(i !== 0){
  //           if(data[(y+i) * size + x] === 1)
  //             yup = true;
  //           if(data[y * size + x+i] === 1)
  //             yup = true;
  //         }
  //       }
  //       if(!yup)
  //         data[y * size + x] = 0;
  //     }
  //   }
  // }

  return data;

}

/***
  Puts zeros in the dataset
**/
function makeZ(x, y, data, size, val){
  for(var mx = -1; mx < 2; mx++){
    for(var my = -1; my < 2; my++){
      if(mx+x > -1 && mx+x < size && my+y > -1 && my+y < size)
        if(Math.random() > 0.95)
          data[(y + my) * size + x + mx] = (typeof val == 'undefined')?0:val;
    }
  }
}
