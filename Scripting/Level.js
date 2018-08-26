// a chunk is a 15x15 array which stores terrain data
var chunk = {
    width:14,
    height:14,
    data:[]
};

// level width and height are between 10 and 20 for now
var random;
var levelWidth;
var levelHieght;

// create a 2d array of size width x height
var mapArray = [];


// h is the variation in parabola position in the x direction
var h1 = 50;
var h2 = 50;

// k is the variation in parabola position in the y direction
var k1 = 50;
var k2 = 50;

// randomCap is the maximum value of the array values +1
var randomCap = 100 + 1;

// islandCutOff is the minimum value for a chunk to exist
var islandCutOff = 173;

function init() {

    random = new Random(123);
    levelWidth = 10 + random.nextInt(11);
    levelHieght = 10 + random.nextInt(11);


    for(var i=0; i<chunk.width; i++){
        chunk.data[i] = new Array(chunk.height);
    }

    for(var i=0; i<levelWidth; i++){
        mapArray[i] = new Array(levelHieght);
    }

    // populate the array with random values (whole numbers between 0 and 100)
    for(var i=0; i<levelWidth; i++){
        for(var j=0; j<levelHieght; j++){
            mapArray[i][j] = chunk;
            // value is a product of random number + function of i&j
            mapArray[i][j].data[chunk.width/2[chunk.height/2]] = (-(i-h1)^2 + k1) + (-(j-h2) + k2) + random.nextInt(randomCap);
            // if it doesn't meet the cutoff, zero it
            if(mapArray[i][j].data[chunk.width/2[chunk.height/2]] < islandCutOff){
                mapArray[i][j].data[chunk.width/2[chunk.height/2]] = 0;
            }
            else{
                var entities = ScriptingEngine.getScript("EntityManager").var("entities");
                entities.push(new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f(i, 0, j), 0, 0, 0, 1));
            }

            Log.println(mapArray[i][j].data[chunk.width/2[chunk.height/2]]);
        }
    }
}

function tick() {

}

function render() {

}
