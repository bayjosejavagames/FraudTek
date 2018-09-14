/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var player;

var light;

var isCam2 = false;
var camera;
var camera2;

var location;

var cameraToggle;
var lightPlacer;
var gunBouncer;

var body;

function init(x, y){
    var entities = ScriptingEngine.getScript("EntityManager").var("entities");
    var model = new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(x, 1, y), 0, 0, 0, 1);
    body = new ComponentRigidBody(model, EnumPhysicsPrimitive.SPHERE);
    model.addComponent(body);
    player = entities.push(model);
    // player.addComponent(new ComponentGravity(player));

    light = LightingEngine.addLight(player.getExactPosition(), new Vector3f(0, 0.5, 1.0));

    // light = LightingEngine.addLight(CameraManager.getCamera().getPosition(), new Vector3f(1, 1, 1));
    lightPlacer = new Debouncer(false);
    gunBouncer = new Debouncer(false);

    cameraToggle = new Debouncer(false);
    camera2 = new FPSCamera();

    //Setup camera
    camera = new TargetCamera(player, new Vector3f(0, 10, 4), new Vector3f(0, 45, 0));
    CameraManager.setCamera(camera);
    MousePicker.setLocked(true);
}

function tick(){
    location = player.getPosition();

    light.setPosition(player.getPosition().add(new Vector3f(0, 2, 0)));

    var moved = false;

    if(ScriptingEngine.focused()){
        player.rotate(0, MousePicker.getDelta().x()/8 * -1, 0);
    }

    if(cameraToggle.risingAction(Keyboard.isKeyDown(KeyEvent.VK_T))){
        isCam2 = !isCam2;
        if(isCam2){
            CameraManager.setCamera(camera2);
            MousePicker.setLocked(false);
        }else{
            CameraManager.setCamera(camera);
            MousePicker.setLocked(true);
        }
    }

    if(!isCam2) {
        if (Keyboard.isKeyDown(KeyEvent.VK_E)) {
            MousePicker.setLocked(false);
        } else {
            MousePicker.setLocked(true);
        }

        if (Keyboard.isKeyDown(KeyEvent.VK_W)) {
            body.addAcceleration(player.getForwardVector().mul(1));
            // player.translate(player.getForwardVector().mul(0.1));
            moved = true;
        }
        if (Keyboard.isKeyDown(KeyEvent.VK_S)) {
            player.translate(player.getForwardVector().mul(0.1).mul(-1));
            moved = true;
        }
        if (Keyboard.isKeyDown(KeyEvent.VK_A)) {
            player.translate(player.getForwardVector(new Vector3f(0, 90, 0)).mul(0.1));
            moved = true;
        }
        if (Keyboard.isKeyDown(KeyEvent.VK_D)) {
            player.translate(player.getForwardVector(new Vector3f(0, -90, 0)).mul(0.1));
            moved = true;
        }
        // Log.println(player.getPosition()+" "+player.getForwardVector());
    }else{
        // light.setPosition(CameraManager.getCamera().getPosition());
    }

    if(lightPlacer.risingAction(Keyboard.isKeyDown(KeyEvent.VK_SPACE))){
        var materialID = MaterialManager.getColor(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
        var entities = ScriptingEngine.getScript("EntityManager").var("entities");
        var cube = entities.push(new EntityModel(ModelLoader.loadModel("cube2"), materialID.getName(), new Vector3f(CameraManager.getCamera().getPosition()), 0, 0, 0, 0.5));
        var RigidBody = new ComponentRigidBody(cube, EnumPhysicsPrimitive.CUBE);
        cube.addComponent(RigidBody);
        cube.getAttribute("weight").setData(1.0);
        RigidBody.addAcceleration(CameraManager.getCamera().getLookingDirection().mul(120));
        // body.addAcceleration(new Vector3f(0, 100, 0));
    }


    if (moved) {
        // ScriptingEngine.getScript('SoulGame').var('client').sendData({
        //     id:player.getID(),
        //     x:player.getPosition().x(),
        //     y:player.getPosition().y(),
        //     z:player.getPosition().z()
        // });
    }
}

function render(){

}

function setMoves(moves){
    this.moves = moves;
    this.maxMoves = moves;
}