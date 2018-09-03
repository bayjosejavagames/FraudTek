/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var random;
var bloomTest2;
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
    //
    Log.startTimer();
    ScriptingEngine.addScript("Level", "testlevel");
    Log.stopTimer();

     bloomTest2 = new EntityModel(ModelLoader.loadModel("dragon"), "white", new Vector3f(0, 1, -6), 0, 0, 0, 1);
    bloomTest2.addComponent(new ComponentBloom(bloomTest2));
    bloomTest2.getAttribute("bloomColor").setData(new Vector3f(0.0, 1.0, 0.75));
    entities.push(bloomTest2);
}

function tick(){
    bloomTest2.rotate(0.1, 0, 0);
}

function render(){

}