/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var entities;
var shader;

function init(){
    //Entity Container for use with rendering
    entities = new EntityContainer(new ComparitorVAO());
    //Shader
    // shader = new Shader('cell_shading');
    shader = new Shader('cell_shading');
}

function tick(){
    entities.sort();
}

function render(){
    var player = ScriptingEngine.getScript("Player").var("player");
    shader.start();
    shader.loadData("viewMatrix", Maths.createViewMatrix(CameraManager.getCamera()));
    shader.loadData("cameraRot", Maths.getCameraRot(CameraManager.getCamera()));
    shader.run("loadLights", LightingEngine.getLights());
    var lastVao = -1;
    for(var i = 0; i < entities.getLength(); i++){
        if(DistanceCalculator.distance(player.getPosition(), entities.get(i).getPosition()) < 12.0){
            shader.loadData("rotationMatrix", Maths.getEntityRot(entities.get(i)));
            var model = entities.get(i).getComponent(EnumComponentType.MESH).getModel();
            if(lastVao != model.getVaoID()) {
                shader.bindVAOFromID(model.getVaoID());
            }
            shader.run("loadMaterial", entities.get(i).getMaterial());
            lastVao = model.getVaoID();
            shader.render(entities.get(i));
        }
    }
    shader.unBindVAO();
    shader.stop();
}