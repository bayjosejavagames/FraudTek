/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var random;
var bloomTest2;
var dragon;
var sphere;

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
    // Log.startTimer();
    ScriptingEngine.addScript("Level", "testlevel");
    // Log.stopTimer();


    var cube = new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f(12, 8, 20), 45, 0, 0, 3);
    cube.addComponent(new ComponentRigidBody(cube));
    cube.addComponent(new ComponentBloom(cube));
    cube.getAttribute("bloomColor").setData(new Vector3f(1.0, 0.15, 0.15));
    cube.getAttribute("weight").setData(0.0);
    entities.push(cube);
    //
    // dragon = new EntityModel(ModelLoader.loadModel("dragon"), "white", new Vector3f(12, 1, 0), 0, 0, 0, 1);
    // dragon.addComponent(new ComponentBloom(dragon));
    // dragon.getAttribute("bloomColor").setData(new Vector3f(0.25, 1.0, 0.15));
    // entities.push(dragon);
    // CollisionChannels.register("worldStatic", dragon);
    //
    // bloomTest2 = new EntityModel(ModelLoader.loadModel("Totem3"), "white", new Vector3f(0, 1, 0), 0, 0, 0, 1);
    // bloomTest2.addComponent(new ComponentBloom(bloomTest2));
    // bloomTest2.getAttribute("bloomColor").setData(new Vector3f(0.0, 1.0, 0.75));
    // entities.push(bloomTest2);
    // CollisionChannels.register("worldStatic", bloomTest2);


    sphere = new EntityModel(ModelLoader.loadModel("sphere2"), "white", new Vector3f(0, 20, 0), 0, 0, 0, 1);
    sphere.addComponent(new ComponentRigidBody(sphere));
    sphere.addComponent(new ComponentLight(sphere, new Vector3f(1, 0, 0)));
    sphere.addComponent(new ComponentBloom(sphere));
    sphere.getAttribute("bloomColor").setData(new Vector3f(1.0, 0.15, 0.15));
    entities.push(sphere);

    // var quad = new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 12);
    // entities.push(quad);

}

function tick(){
    // dragon.rotate(0, 1, 0);
}

function render(){

}