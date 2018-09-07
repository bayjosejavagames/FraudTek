var entities;
var shader;

function init(){
    entities = new EntityContainer(new ComparitorVAO());

    //Camera
    CameraManager.setCamera(new FPSCamera());

    //Light
    LightingEngine.addLight(CameraManager.getCamera().getPosition(), new Vector3f(1, 1, 1));

}

function tick(){
    entities.sort();
}

function render(){

}