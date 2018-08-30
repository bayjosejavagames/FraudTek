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
}

function tick(){

}

function render(){

}