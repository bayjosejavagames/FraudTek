/**
 * Created by Bayjose Java Games on 8/10/2018.
 */

var entities;

//Shaders
var shader;
var bloom;
var h_blur;
var v_blur;
var subtract;
var combine;

var screenFBO;
var bloom_FBO;
var h_blurFBO;
var v_blurFBO;
var subtractFBO;
var combineFBO;

var screenQuad;

function init(screenFBO, entityCollection){
    this.screenFBO = screenFBO;
    this.entities = entityCollection;

    //Shader
    // shader = new Shader('cell_shading');

    h_blur = new Shader('h_gaussian_blur');
    v_blur = new Shader('v_gaussian_blur');
    bloom = new Shader('bloom');
    subtract = new Shader('subtract');
    combine = new Shader('add');

    bloom_FBO = new FBO(WIDTH/2, HEIGHT/2);
    h_blurFBO = new FBO(WIDTH/2, HEIGHT/2);
    v_blurFBO = new FBO(WIDTH/2, HEIGHT/2);
    subtractFBO = new FBO(WIDTH/2, HEIGHT/2);
    combineFBO = new FBO(WIDTH/2, HEIGHT/2);

    screenQuad = new EntityModel(ModelLoader.loadModel("quad"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 1);
}

function tick(){

}

function render(){
    //This code here writes what would be drawn to the screen to a seperate buffer, a frame buffer
    //this is a video frame of buffered data that we can manipulate as a texture.
    var blooms = [];
    for(var i = 0; i < entities.getLength(); i++){
        if(entities.get(i).hasAttribute("bloom")){
            blooms.push(entities.get(i));
        }
    }

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