var entities;
var shader;

function init(){
    entities = new EntityContainer(new ComparitorVAO());

    //Camera
    CameraManager.setCamera(new FPSCamera());

    //Light
    LightingEngine.addLight(CameraManager.getCamera().getPosition(), new Vector3f(1, 1, 1));

    //Shader
    shader = new Shader('PBR');
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(-6, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "lava", new Vector3f(-4, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "brick", new Vector3f(-2, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(0, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("quad2"), "brick", new Vector3f(0, -2, 0), 0, 0, 0, 12));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(2, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(4, 0, 0), 0, 0, 0, 1));
    entities.push(new EntityModel(ModelLoader.loadModel("sphere_smooth"), "white", new Vector3f(6, 0, 0), 0, 0, 0, 1));
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