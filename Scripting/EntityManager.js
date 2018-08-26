/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var entities;
var shader;

function init(){
    //Entity Container
    entities = new EntityContainer(new ComparitorVAO());
    //Shader
    // shader = new Shader('cell_shading');
    shader = new Shader('cell_shading');
}

function tick(){
    entities.sort();
}

function render(){
    shader.start();
    shader.loadData("viewMatrix", Maths.createViewMatrix(CameraManager.getCamera()));
    shader.loadData("cameraRot", Maths.getCameraRot(CameraManager.getCamera()));
    shader.run("loadLights", LightingEngine.getLights());
    var lastVao = -1;
    for(var i = 0; i < entities.getLength(); i++){
        shader.loadData("rotationMatrix", Maths.getEntityRot(entities.get(i)));
        var model = entities.get(i).getComponent(EnumComponentType.MESH).getModel();
        if(lastVao != model.getVaoID()) {
            shader.bindVAOFromID(model.getVaoID());
        }
        shader.run("loadMaterial", entities.get(i).getMaterial());
        lastVao = model.getVaoID();
        shader.render(entities.get(i));
    }
    shader.unBindVAO();
    shader.stop();
}