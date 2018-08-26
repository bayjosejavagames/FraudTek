/**
 * Created by Bayjose Java Games on 8/10/2018.
 */
var door;
var open = false;
function init(x, y){
    var entities = ScriptingEngine.getScript("EntityManager").var("entities");
    door = entities.push(new EntityModel(ModelLoader.loadModel("cube2"), "white", new Vector3f(x, 2, y), 0, 0, 0, 1));
}

function tick(){
    if(open == true){
       if(door.getPosition().y() > 0){
           door.translate(new Vector3f(0, -0.01, 0));
       }
    }else{
        if(door.getPosition().y() < 2){
            door.translate(new Vector3f(0, 0.01, 0));
        }
    }
}

function unlock(){

}

function render(){

}