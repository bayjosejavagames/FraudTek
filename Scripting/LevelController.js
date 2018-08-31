/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var random;

function init(levelName){
    Log.println("Generating Levels"+levelName);
    loadLevel(levelName);
}

function loadLevel(seed){
    random = new Random();

    var entities = ScriptingEngine.getScript("EntityManager").var("entities");
    //Move into level class
    //Shrine
    //Forrest
    //SkullBridge

    ScriptingEngine.addScript("Level", "testlevel");

    entities.push(new EntityModel(ModelLoader.loadModel("quad"), "brick", new Vector3f(0, 2, 0), 0, 0, 0, 1));
    // ParticleEngine.push(new EntityParticleEmitter(new Vector3f(0, 0, 0), "fruit", 100));
}

function tick(){

}

function render(){

}