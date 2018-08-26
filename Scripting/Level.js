// level width and height are between 10 and 20 for now
var random = new Random(123);
var levelWidth = 10 + random.nextInt(11);
var levelHieght = 10 + random.nextInt(11);

// create a 2d array of size width x height
var mapArray = new Array(levelWidth);
for(var i=0; i<levelWidth; i++){
    mapArray[i] = new Array(levelHieght);
}

// h is the variation in parabola position in the x direction
var h1 = 50;
var h2 = 50;

// k is the variation in parabola position in the y direction
var k1 = 50;
var k2 = 50;

// randomCap is the maximum value of the array values +1
var randomCap = 100 + 1;

// populate the array with random values (whole numbers between 0 and 100)
for(var i=0; i<levelWidth; i++){
    for(var j=0; j<levelHieght; j++){
        // value is a product of random number + function of i&j
        mapArray[i[j]] = (-(i-h1)^2 + k1) + (-(j-h2) + k2) + random.nextInt(randomCap);
    }
}