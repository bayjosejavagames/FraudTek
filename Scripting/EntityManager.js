/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var entities;
var shader;
var ticks = 0;

var screenFBO;

function init(){
    //Entity Container for use with rendering
    entities = new EntityContainer(new ComparitorVAO());
    //Shader
    // shader = new Shader('cell_shading');
    shader = new Shader('cell_shading');
    screenFBO = new FBO();
    var scene = new Gui(screenFBO.getTextureID(), new Vector2f(0.0, 0.0), new Vector2f(1.0, 1.0));
    scene.setRotation(new Vector3f(0, 0, 180));
    guis.add(scene);
}

function tick(){
    entities.sort();
    ticks++;
    ticks%=720;
}

function render(){
    //This code here writes what would be drawn to the screen to a seperate buffer, a frame buffer
    //this is a video frame of buffered data that we can manipulate as a texture.
    screenFBO.bindFrameBuffer();
        var player = ScriptingEngine.getScript("Player").var("player");
        shader.start();
        shader.loadData("viewMatrix", Maths.createViewMatrix(CameraManager.getCamera()));
        shader.loadData("cameraRot", Maths.getCameraRot(CameraManager.getCamera()));
        shader.run("loadLights", LightingEngine.getLights());
        shader.run("setAnimationOffset", new Vector3f(0, 0, 0));
        var lastVao = -1;
        for(var i = 0; i < entities.getLength(); i++){
            if(DistanceCalculator.distance(player.getPosition().add(player.getForwardVector().mul(20)), entities.get(i).getPosition()) < 24.0){
                shader.loadData("rotationMatrix", Maths.getEntityRot(entities.get(i)));
                var model = entities.get(i).getComponent(EnumComponentType.MESH).getModel();
                if(lastVao != model.getVaoID()) {
                    // if(model.getVaoID() == 3){
                    //     shader.run("setAnimationOffset", new Vector3f(0, Math.sin(ticks/180), 0));
                    // }else{
                    //     shader.run("setAnimationOffset", new Vector3f(0, 0, 0));
                    // }
                    shader.bindVAOFromID(model.getVaoID());
                }
                shader.run("loadMaterial", entities.get(i).getMaterial());
                lastVao = model.getVaoID();
                shader.render(entities.get(i));
            }
        }
        shader.unBindVAO();
        shader.stop();
    screenFBO.unbindFrameBuffer();
}