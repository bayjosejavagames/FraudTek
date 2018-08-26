/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

function init(levelName){
    Log.println("Generating Levels"+levelName);
    loadLevel(levelName);
}

function loadLevel(seed){
    var entities = ScriptingEngine.getScript("EntityManager").var("entities");
    //Move into level class
    //Shrine
    //Forrest
    //SkullBridge
    var random = new Random();
    var x = random.nextInt(22)+10;
    var y = random.nextInt(22)+10;
    // for(var i = 0; i < y; i++){
    //     for(var j = 0; j < x; j++){
    //         entities.push(new EntityModel(ModelLoader.loadModel("hex"), "white", new Vector3f(i * 2, random.nextFloat(), j * 2), 0, 0, 0, 2));
    //     }
    // }

    ScriptingEngine.addScript("Level");

    entities.push(new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 12));
}

function tick(){

}

function render(){

}