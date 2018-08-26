/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var player;

var light;

var camera;

var location;

function init(x, y){
    var entities = ScriptingEngine.getScript("EntityManager").var("entities");
    player = entities.push(new EntityModel(ModelLoader.loadModel("sphere2"), "lava", new Vector3f(x, 1, y), 0, 0, 0, 1));
    player.addComponent(new ComponentGravity(player));

    light = LightingEngine.addLight(player.getExactPosition(), new Vector3f(0, 0.5, 1.0));

    //Setup camera
    var camera = new TargetCamera(player, new Vector3f(0, 10, 4), new Vector3f(0, 45, 0));
    CameraManager.setCamera(camera);
    MousePicker.setLocked(true);
}

function tick(){
    location = player.getPosition();

    var moved = false;

    if(ScriptingEngine.focused()){
        player.rotate(0, MousePicker.getDelta().x()/8 * -1, 0);
    }

    if (Keyboard.isKeyDown(KeyEvent.VK_E)) {
        MousePicker.setLocked(false);
    }else{
        MousePicker.setLocked(true);
    }

    if (Keyboard.isKeyDown(KeyEvent.VK_W)) {
        player.translate(player.getForwardVector().mul(0.1));
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


    if (moved) {
        ScriptingEngine.getScript('SoulGame').var('client').sendData({
            id:player.getID(),
            x:player.getPosition().x(),
            y:player.getPosition().y(),
            z:player.getPosition().z()
        });
    }
}

function render(){

}

function setMoves(moves){
    this.moves = moves;
    this.maxMoves = moves;
}