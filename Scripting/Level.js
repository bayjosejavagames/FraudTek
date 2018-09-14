

// level width and height are between 10 and 20 for now
var random;
var levelWidth;
var levelHeight;

// create a 2d array of size width x height
var chunks = [];

var seedTable = [];

// randomCap is the maximum value of the array values +1
var randomCap = 50 + 1;

// islandCutOff is the minimum value for a chunk to exist
var islandCutOff = 20;

//Structures in the level
var structures = [];

var LinkDirections = Object.freeze({UP:0,DOWN:1,LEFT:2,RIGHT:3});

function init(seed) {
    //Generate a random Level based on a seed
    // random = new Random(seed.hashCode()); //Generate a random sequence of numbers based on the passed String
    random = new Random(); //Generate a random sequence of numbers based on the passed String
    levelWidth = 16 + random.nextInt(16)+1; //Generate a random number between 16 and 32
    levelHeight = 16 + random.nextInt(16)+1;//Generate a random number between 16 and 32

    var entities = ScriptingEngine.getScript("EntityManager").var("entities");

    //Generate a random value for each entry in our seed table. Bias the center towards a point.
    for(var j=0; j<levelHeight+1; j++){
        //Sneeky array init
        for(var i=0; i<levelWidth+1; i++){
            seedTable[i+(j*(levelWidth+1))] = (random.nextInt(41)-20) + ((-Math.pow(i-(levelWidth/2), 2)) + (-Math.pow(j-(levelHeight/2), 2)) + 20);
        }
    }

    for(var i=0; i<levelWidth; i++){
        chunks[i] = [];
    }

    for(var j=0; j<levelHeight; j++){
        for(var i=0; i<levelWidth; i++){
            var chunk = generateChunk();
            chunks[i][j] = chunk;
            {
                //Since we are putting data into this chunk, we are going to set the generated flag = to true
                chunks[i][j].x = i;
                chunks[i][j].y = j;

                //Using data from our seedTable, get the corner values for this grid, then lerp all tiles to create a smooth grid.
                chunks[i][j] = lerpChunk(chunks[i][j], seedTable[((i)+((j)*(levelWidth+1)))],seedTable[((i)+((j+1)*(levelWidth+1)))],seedTable[((i+1)+((j)*(levelWidth+1)))],seedTable[((i+1)+((j+1)*(levelWidth+1)))]);

                // If the tile height is above the cutoff
                for(var k = 0; k < chunk.height; k++){
                    for(var l = 0; l < chunk.width; l++){
                        if(chunks[i][j].heights[l+(k * chunk.width)] > 2) {
                            var materialID = MaterialManager.getColor(0, 255, 0);
                            // var entity = new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f((i + (k / chunk.width) - (levelWidth / 2)) * chunk.width * 2, chunks[i][j].heights[l + (k * chunk.width)], (j + (l / chunk.height) - (levelHeight / 2)) * chunk.height * 2), 0, 0, 0, 1);
                            var entity = new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(((k / chunk.width)) * chunk.width * 2, -0, ((l / chunk.height)) * chunk.height * 2), 0, 0, 0, 1);
                            chunk.tiles.push(entity);
                            entity.setMaterial(materialID);
                            // entities.push(entity);
                        }
                    }
                }

                // for(var k = 0; k < chunk.height; k++){
                //     for(var l = 0; l < chunk.width; l++){
                //         var materialID = MaterialManager.getColor(0, 255, 0);
                //         // var entity = new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f((i + (k / chunk.width) - (levelWidth / 2)) * chunk.width * 2, chunks[i][j].heights[l + (k * chunk.width)], (j + (l / chunk.height) - (levelHeight / 2)) * chunk.height * 2), 0, 0, 0, 1);
                //         var entity = new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f((i + (k / chunk.width) - (levelWidth / 2)) * chunk.width * 2, random.nextInt(120), (j + (l / chunk.height) - (levelHeight / 2)) * chunk.height * 2), 0, 0, 0, 1);
                //         chunk.tiles.push(entity);
                //         entity.setMaterial(materialID);
                //         // entities.push(entity);
                //     }
                // }

                //To see if a chunk was generated or not, we can check if tiles are present.
                if(chunk.tiles.length > 0){
                    chunks[i][j].generated = true;
                }

                var mg = new ModelGroup(chunk.tiles);
                chunk.modelGroup = new EntityModel(mg.modelID(), "white", new Vector3f((i - (levelWidth /2)) * chunk.width * 2 , 0, (j - (levelHeight /2)) * chunk.height * 2), 0, 0, 0, 1);
                entities.push(chunk.modelGroup);
            }
        }
    }

    for(var i=0; i<levelWidth; i++){
        for(var j=0; j<levelHeight; j++){
            if(inChunkBounds(i, j-1)) { //up
                if(chunks[i][j-1].generated){
                    chunks[i][j].neighbors.push(LinkDirections.UP);
                }
            }
            if(inChunkBounds(i, j+1)) { //up
                if(chunks[i][j+1].generated){
                    chunks[i][j].neighbors.push(LinkDirections.DOWN);
                }
            }
            if(inChunkBounds(i-1, j)) { //left
                if(chunks[i-1][j].generated){
                    chunks[i][j].neighbors.push(LinkDirections.LEFT);
                }
            }
            if(inChunkBounds(i+1, j)) { //right
                if(chunks[i+1][j].generated){
                    chunks[i][j].neighbors.push(LinkDirections.RIGHT);
                }
            }
        }
    }

    // Find the entire path given the starting point
    // determine starting point & populate path
    var startingChunk = selectRandomStartingChunk();
    startingChunk.chunkIndex = 0;
    var chunkPath = [];
    chunkPath.push(startingChunk);

    generateTraversalPath(chunkPath);


}

//find primary path
//select random starting point from the top row
// INPUTS: None
// OUTPUTS: [x, y]
function selectRandomStartingChunk(){
    var y = 0;

    var startingChunks = [];
    while(true){
        for(var i = 0; i < levelWidth; i++){
            if(chunks[i][y].generated){
                if(chunks[i][y].neighbors.length >= 3) {
                    startingChunks.push(chunks[i][y]);
                }
            }
        }
        if(startingChunks.length == 0){
            y++
        }else{
            break;
        }
    }

    var chunk = startingChunks[random.nextInt(startingChunks.length)];

    var materialID = MaterialManager.getColor(255,0,0);
    for(var i = 0; i < chunk.tiles.length; i++){
        chunk.tiles[i].setMaterial(materialID);
    }
    chunk.onPrimaryPath = true;
    return chunk;
}

// select random next chunk
// INPUTS: Chunk[]
// OUTPUTS: Chunk[]
function generateTraversalPath(chunkPath){
    var tmpChunk = getRelativeChunk(chunkPath[0], LinkDirections.DOWN);
    tmpChunk.chunkIndex = chunkPath.length;
    var materialID = MaterialManager.getColor(255,0,0);
    for(var i = 0; i < tmpChunk.tiles.length; i++){
        tmpChunk.onPrimaryPath = true;
        tmpChunk.tiles[i].setMaterial(materialID);
    }
    chunkPath.push(tmpChunk);
    while(tmpChunk.y <= levelHeight){
        //Choose a direction left right or down.
        var dir = random.nextInt(5);
        if(dir == 0){ //Down
            tmpChunk = getRelativeChunk(tmpChunk, LinkDirections.DOWN);
            for(var i = 0; i < tmpChunk.tiles.length; i++){
                tmpChunk.onPrimaryPath = true;
                tmpChunk.tiles[i].setMaterial(materialID);
            }
        }
        if(dir == 1 || dir == 3){ //LEFT
            while(tmpChunk != null){
                if(random.nextInt(3) == 0){
                    tmpChunk = getRelativeChunk(tmpChunk, LinkDirections.DOWN);
                    for(var i = 0; i < tmpChunk.tiles.length; i++){
                        tmpChunk.onPrimaryPath = true;
                        tmpChunk.tiles[i].setMaterial(materialID);
                    }
                    break;
                }
                tmpChunk = getRelativeChunk(tmpChunk, LinkDirections.LEFT);
                for(var i = 0; i < tmpChunk.tiles.length; i++){
                    tmpChunk.onPrimaryPath = true;
                    tmpChunk.tiles[i].setMaterial(materialID);
                }
            }
        }
        if(dir == 2 || dir == 4){ //RIGHT
            while(tmpChunk != null){
                if(random.nextInt(3) == 0){
                    tmpChunk = getRelativeChunk(tmpChunk, LinkDirections.DOWN);
                    for(var i = 0; i < tmpChunk.tiles.length; i++){
                        tmpChunk.onPrimaryPath = true;
                        tmpChunk.tiles[i].setMaterial(materialID);
                    }
                    break;
                }
                tmpChunk = getRelativeChunk(tmpChunk, LinkDirections.RIGHT);
                for(var i = 0; i < tmpChunk.tiles.length; i++){
                    tmpChunk.onPrimaryPath = true;
                    tmpChunk.tiles[i].setMaterial(materialID);
                }
            }
        }
    }

}

function tick() {

}

function render() {

}

function generateChunk(){
    var chunkSize = 15;
    var outdata = [];
    for(var i=0; i<chunkSize; i++){
        outdata[i] = new Array(chunkSize);
        for(var j=0; j<chunkSize;j++){
            outdata[i][j] = 0;
        }
    }
    return {
        x:-1,
        y:-1,
        width:chunkSize,
        height:chunkSize,
        data:outdata,
        tiles:[],
        heights:[],
        entities:[],
        neighbors:[],
        generated:false,
        onPrimaryPath:false,
        link:LinkDirections.UP,
        modelGroup:undefined,
        chunkIndex:-1
    }
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

function getRelativeChunk(chunk, direction){
    if(contains(chunk.neighbors, direction)) {
        switch (direction) {
            case LinkDirections.UP:
                if(inChunkBounds(chunk.x, chunk.y-1)){
                    if(chunks[chunk.x][chunk.y - 1].generated) {
                        return chunks[chunk.x][chunk.y - 1];
                    }
                }
            case LinkDirections.DOWN:
                if(inChunkBounds(chunk.x, chunk.y + 1)) {
                    if(chunks[chunk.x][chunk.y + 1].generated) {
                        return chunks[chunk.x][chunk.y + 1];
                    }
                }
            case LinkDirections.LEFT:
                if(inChunkBounds(chunk.x - 1, chunk.y)) {
                    if(chunks[chunk.x - 1][chunk.y].generated) {
                        return chunks[chunk.x - 1][chunk.y];
                    }
                }
            case LinkDirections.RIGHT:
                if(inChunkBounds(chunk.x + 1, chunk.y)) {
                    if(chunks[chunk.x + 1][chunk.y].generated) {
                        return chunks[chunk.x + 1][chunk.y];
                    }
                }
        }
    }
    return null;
}

function lerpChunk(chunk, x, xx, xy, yy){
    chunk.heights = new Array(chunk.width * chunk.height);

    for(var j = 0; j < chunk.height; j++){
        for(var i = 0; i < chunk.width; i++){
            chunk.heights[i+(j * chunk.width)] = lerp(lerp(x, xx, (i/(chunk.width-1))), lerp(xy, yy, (i/(chunk.width-1))), (j/(chunk.height-1)));
        }
    }

    return chunk;
}

function inChunkBounds(x, y){
    if(x >= 0 && x < levelWidth){
        if(y >= 0 && y < levelHeight){
            return true;
        }
    }
    return false;
}

function clamp(x, min, max){
    return (x<min?0:x>max?max:x);
}

function lerp(x, xx, d){
    return ((1.0 - d) * x) + (d * xx);
}

function contains(array, value){
    for(var i = 0; i < array.length; i++){
        if(array[i] === value){
            return true;
        }
    }
    return false;
}