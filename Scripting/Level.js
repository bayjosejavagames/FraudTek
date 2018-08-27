

// level width and height are between 10 and 20 for now
var random;
var levelWidth;
var levelHieght;

// create a 2d array of size width x height
var mapArray = [];

// randomCap is the maximum value of the array values +1
var randomCap = 50 + 1;

// islandCutOff is the minimum value for a chunk to exist
var islandCutOff = 0;

//Structures in the level
var structures = [];

var LinkDirections = Object.freeze({UP:0,DOWN:1,LEFT:2,RIGHT:3});

function init() {

    random = new Random(123);
    levelWidth = 10 + random.nextInt(21);
    levelHieght = 10 + random.nextInt(21);




    for(var i=0; i<levelWidth; i++){
        mapArray[i] = new Array(levelHieght);
    }

    // populate the array with random values (whole numbers between 0 and 100)
    for(var i=0; i<levelWidth; i++){
        for(var j=0; j<levelHieght; j++){
            var chunk = generateChunk();
            mapArray[i][j] = chunk;
            // value is a product of random number + function of i&j
            mapArray[i][j].data[Math.floor(chunk.width/2)][Math.floor(chunk.height/2)] = randomCap -Math.pow((i-(levelWidth/2)),2) - Math.pow((j-(levelHieght/2)),2) + random.nextInt(randomCap);
            // if it doesn't meet the cutoff, zero it
            if(mapArray[i][j].data[Math.floor(chunk.width/2)][Math.floor(chunk.height/2)] < islandCutOff){
                mapArray[i][j].data[Math.floor(chunk.width/2)][Math.floor(chunk.height/2)] = 0;
            }
            else
            {
                for(var k=0; k<chunk.width;k++){
                    for(var l=0; l<chunk.width;l++){
                        var entities = ScriptingEngine.getScript("EntityManager").var("entities");
                        var materialID = MaterialManager.getColor(0, clamp(mapArray[i][j].data[Math.floor(chunk.width/2)][Math.floor(chunk.height/2)], 0, 255),0);
                        var entity = new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f(i+(k/chunk.width), 0, j+(l/chunk.height)), 0, 0, 0, 0.5/chunk.width);
                        entity.setMaterial(materialID);
                        entities.push(entity);
                    }
                }
                // var entities = ScriptingEngine.getScript("EntityManager").var("entities");
                // entities.push(new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f(i, 0, j), 0, 0, 0, 0.5));
            }

            Log.println(mapArray[i][j].data[Math.floor(chunk.width/2)][Math.floor(chunk.height/2)]);
        }
    }

    // perform linear interpolation
    for(var i=0; i<levelWidth; i++){
        for(var j=0; j<levelHieght; j++){

        }
    }
}

function tick() {

}

function render() {

}

function generateChunk(){
    var chunkSize = 3;
    var outdata = [];
    for(var i=0; i<chunkSize; i++){
        outdata[i] = new Array(chunkSize);
        for(var j=0; j<chunkSize;j++){
            outdata[i][j] = 0;
        }
    }
    return {
        width:chunkSize,
        height:chunkSize,
        data:outdata,
        link:LinkDirections.UP
    }
}

function addStructure(){
    structures.push({
        name:name,
        links:links,
        entity:entity,
        placed:false
    });
}

function addStructure(name, links, entity){
    structures.push({
        name:name,
        links:links,
        entity:entity,
        placed:false
    });
}

function generateStructures(){
    for(var i = 0; i < structures.length; i++){

    }
}

function clamp(x, min, max){
    return (x<min?0:x>max?max:x);
}