/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var dragon;
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

    ScriptingEngine.addScript("Level");

    dragon = entities.push(new EntityModel(ModelLoader.loadModel("dragon"), "white", new Vector3f(0, 0, -6), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 12));
}

function tick(){
    // var material = MaterialManager.getColor(random.nextInt(256),random.nextInt(256),random.nextInt(256));
    // dragon.setMaterial(material);
    // Log.println(material.getName()+"");
    dragon.rotate(0, 1, 0);
}

function render(){

}