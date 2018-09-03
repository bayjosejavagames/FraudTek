/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var entities;

//Shaders
var shader;
var bright;
var bloom;
var h_blur;
var v_blur;
var subtract;
var combine;

var ticks = 0;

var screenFBO;
var bloom_FBO;
var h_blurFBO;
var v_blurFBO;
var subtractFBO;
var combineFBO;

var screenQuad;

var modelGroup;

function init(){
    //Entity Container for use with rendering
    entities = new EntityContainer(new ComparitorVAO());
    //Shader
    // shader = new Shader('cell_shading');

    shader = new Shader('cell_shading');
    h_blur = new Shader('h_gaussian_blur');
    v_blur = new Shader('v_gaussian_blur');
    bloom = new Shader('bloom');
    subtract = new Shader('subtract');
    combine = new Shader('add');

    screenFBO = new FBO(WIDTH/2, HEIGHT/2);
    bloom_FBO = new FBO(WIDTH/2, HEIGHT/2);
    h_blurFBO = new FBO(WIDTH/2, HEIGHT/2);
    v_blurFBO = new FBO(WIDTH/2, HEIGHT/2);
    subtractFBO = new FBO(WIDTH/2, HEIGHT/2);
    combineFBO = new FBO(WIDTH/2, HEIGHT/2);

    // guis.add(new Gui(screenFBO.getTextureID(), new Vector2f(-0.6, 0.8), new Vector2f(0.1, 0.1)));
    // guis.add( new Gui(bloom_FBO.getTextureID(), new Vector2f(-0.4, 0.8), new Vector2f(0.1, 0.1)));
    // guis.add( new Gui(h_blurFBO.getTextureID(), new Vector2f(-0.2, 0.8), new Vector2f(0.1, 0.1)));
    // guis.add( new Gui(v_blurFBO.getTextureID(), new Vector2f(-0.0, 0.8), new Vector2f(0.1, 0.1)));
    // guis.add( new Gui(subtractFBO.getTextureID(), new Vector2f(0.2, 0.8), new Vector2f(0.1, 0.1)));
    // guis.add( new Gui(combineFBO.getTextureID(), new Vector2f(0.4, 0.8), new Vector2f(0.1, 0.1)));

    var scene = new Gui(combineFBO.getTextureID(), new Vector2f(0.0, 0.0), new Vector2f(1.0, 1.0));
    guis.add(scene);

    screenQuad = new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 1);

    // var modelArray = [];
    // for(var i = 0; i < 1000; i++){
    //     modelArray.push(new EntityModel(ModelLoader.loadModel("cube2"), "brick", new Vector3f(0, 1, i), 0, 0, 0, 1))
    // }
    // modelGroup = new ModelGroup(modelArray);

}

function tick(){
    entities.sort();
    ticks++;
    ticks%=720;
}

function render(){
    //This code here writes what would be drawn to the screen to a seperate buffer, a frame buffer
    //this is a video frame of buffered data that we can manipulate as a texture.
    var blooms = [];
    //Render all entities push entities to be bloom lit to seperate array
    screenFBO.bindFrameBuffer();
        GL11.glClearColor(0.0, 0.0, 1.0, 1.0);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT);
        var player = ScriptingEngine.getScript("Player").var("player");
        shader.start();
        shader.loadData("viewMatrix", Maths.createViewMatrix(CameraManager.getCamera()));
        shader.loadData("cameraRot", Maths.getCameraRot(CameraManager.getCamera()));
        shader.run("loadLights", LightingEngine.getLights());
        shader.run("setAnimationOffset", new Vector3f(0, 0, 0));
        var lastVao = -1;
        for(var i = 0; i < entities.getLength(); i++){
            // if(DistanceCalculator.distance(player.getPosition().add(player.getForwardVector().mul(20)), entities.get(i).getPosition()) < 50.0){
                if(entities.get(i).hasAttribute("bloom")){
                    blooms.push(entities.get(i));
                }
                shader.loadData("rotationMatrix", Maths.getEntityRot(entities.get(i)));
                if(entities.get(i).hasComponent(EnumComponentType.MESH)) {
                    var model = entities.get(i).getComponent(EnumComponentType.MESH).getModel();
                    if (lastVao != model.getVaoID()) {
                        shader.bindVAOFromID(model.getVaoID());
                    }
                    shader.run("loadMaterial", entities.get(i).getMaterial());
                    lastVao = model.getVaoID();
                }
                if(entities.get(i).hasComponent(EnumComponentType.MODEL_GROUP)){
                    var model = entities.get(i).getComponent(EnumComponentType.MODEL_GROUP).getModelGroup();
                    shader.bindVAOFromID(model.getVAOID());
                    lastVao = model.getVAOID();
                }
                shader.render(entities.get(i));
            // }
        }
        shader.stop();
    screenFBO.unbindFrameBuffer();

    //Render bloomed entities in their respective bloom colors
    bloom_FBO.bindFrameBuffer();
        GL11.glClearColor(0.0, 0.0, 0.0, 0.0);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT);
        bloom.start();
        bloom.loadData("viewMatrix", Maths.createViewMatrix(CameraManager.getCamera()));
        for(var i = 0; i < blooms.length; i++) {
            bloom.loadData("bloomColor", blooms[i].getAttribute("bloomColor").getData());
            var model = blooms[i].getComponent(EnumComponentType.MESH).getModel();
            bloom.bindVAOFromID(model.getVaoID());
            bloom.render(blooms[i]);
        }
        bloom.stop();
    bloom_FBO.unbindFrameBuffer();

    //Execute Gausian blur
    h_blurFBO.bindFrameBuffer();
        GL11.glClearColor(0.0, 0.0, 0.0, 0.0);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT);
        h_blur.start();
        h_blur.loadData("targetWidth", 11);
        h_blur.loadData("blurDivide", 20);
        h_blur.loadData("originalTexture", bloom_FBO.getTextureID());
        var model = screenQuad.getComponent(EnumComponentType.MESH).getModel();
        h_blur.bindVAOFromID(model.getVaoID());
        h_blur.render(screenQuad);
        h_blur.stop();
    h_blurFBO.unbindFrameBuffer();

    v_blurFBO.bindFrameBuffer();
        GL11.glClearColor(0.0, 0.0, 0.0, 0.0);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT);
        v_blur.start();
        v_blur.loadData("targetWidth", 11);
        v_blur.loadData("blurDivide", 20);
        v_blur.loadData("originalTexture", h_blurFBO.getTextureID());
        var model = screenQuad.getComponent(EnumComponentType.MESH).getModel();
        v_blur.bindVAOFromID(model.getVaoID());
        v_blur.render(screenQuad);
        v_blur.stop();
    v_blurFBO.unbindFrameBuffer();

    // subtract initial bloomed image from gaussian blurred image.
    subtractFBO.bindFrameBuffer();
        subtract.start();
        subtract.loadData("originalTexture", v_blurFBO.getTextureID());
        subtract.loadData("subtractTexture", bloom_FBO.getTextureID());
        var model = screenQuad.getComponent(EnumComponentType.MESH).getModel();
        subtract.bindVAOFromID(model.getVaoID());
        subtract.render(screenQuad);
        subtract.stop();
    subtractFBO.unbindFrameBuffer();

    // add result of previous step to the scene image.
    combineFBO.bindFrameBuffer();
        GL11.glClearColor(0.0, 0.0, 0.0, 0.0);
        GL11.glClear(GL11.GL_COLOR_BUFFER_BIT);
        combine.start();
        combine.loadData("textureOne", screenFBO.getTextureID());
        combine.loadData("textureTwo", subtractFBO.getTextureID());
        var model = screenQuad.getComponent(EnumComponentType.MESH).getModel();
        combine.bindVAOFromID(model.getVaoID());
        combine.render(screenQuad);
        combine.stop();
    combineFBO.unbindFrameBuffer();
}