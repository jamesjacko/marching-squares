console.clear();
var a = [2, 2, 2, 2, 2, 3, 4, 2, 2, 4, 3, 2, 2, 2, 2, 2];
var threshold = 2;

var sq = Math.sqrt(a.length);

var applyThreshold = function(el, ind, array){
  a[ind] = (el <= threshold)? 0: 1;
};

a.forEach(applyThreshold);
var b = a.slice();
var cubeCount = Math.floor(a.length / 4);
var ind = new Array(cubeCount);

for(var i = 0; i < cubeCount; i++){
    ind[i] = "" + b[0] + "" + b[1] + "" + b[sq+1] + ""  + b[sq];
    b.splice(0, 1);
    b.splice(1, 1);
    b.splice(sq , 1);
    b.splice(1 + sq, 1);
    for(var j = 0; j < b.length / 4; j++){
      console.log(b[0 + (sq * i)], b[1 + (sq * i)], b[2 + (sq * i)], b[3 + (sq * i)], ":" + j);
    }
}
console.log(ind);


clear();

var w = Math.sqrt(a.length);
var cb = a.length/4;
var sq = Math.sqrt(cb);
var go = true;
var i = 0;
var c = 0;
while(go){
  console.log(a[i] + '' + a[i+1] + '' + a[i+w+1] + '' + a[i+w]);
  c++;
  if(c % sq === 0){
    i += w + sq;
  } else {
  i+=2;
  }
  go = i < a.length;
}


for(var i = 0; i < a.length - w; i++){
  console.log(a[i*2] + '' + a[i*2+1] + '' + a[i*2+4+1] + '' + a[i*2+4]);
  if((i+1) % sq === 0){
    i += w / 2;
  }
}

// coin toss function which will return true or false based on a given chance
// i.e. a chance of 2 is 1 in 2 chance.
var coinToss = function(chance){
  return Math.floor(Math.random() * chance) === 0;
};

// Gereate a random world based on the given size and the supplied
// edge size. This edge size must be at most half the size of the
// world as it does not make sense otherwise.
var randomWorld = function(size, edge){
  if(edge > size/2){
    console.error("You need to use an edge that is" +
      "at most have of your selected size");
    return;
  }
  var world = Array.apply(null, Array(size * size)).map(Number.prototype.valueOf,1);
  for(var i = 0; i < size; i++){
    // top edge
    world[i] = 0;
    // left edge
    world[i + (size * (size - 1))] = 0;
    // bottom
    world[i * size] = 0;
    // right edge
    world[(size * (i + 1)) - 1] = 0;
  }
  return world;
};

// Loop over the neighbours of a given index within the array and
// update the value based on a coin toss (which is assigned a chance
// which is 1/chance probability
var neighbourEdge = function(index, world, edge, size, chance){
  // use bitwise shift 0 places which will floor the value;
  var x = index % size;
  var y = (index / size) << 0;
  // loop over neighbours
  for(var i = -edge; i <= edge; i++){
    // calculate the current coords and ensure they are in the world
    var nx = x + i;
    var ny = y + i;
    // if not, ignore this loop.
    if(nx < 0 || nx > size - 1 || ny < 0 || ny > size - 1)
      continue;
    for(var j = -edge; j <= edge; j++){
      world[index + (i * j)] = 0;
    }
  }
  console.log(x,y);
};

// function to print the data in the array
var printWorld = function(world, size){
  var str = "";
  for(var i = 0; i < size * size; i++){
    str += world[i];
    if((i+1) % size === 0)
      str += "\n";
  }
  return str;
};

var size = 100;
var world = randomWorld(size, 2);
var str = printWorld(world, size);
console.log(str);
