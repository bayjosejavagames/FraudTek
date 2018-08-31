var client;
var otherPlayer;

function init(){
    ServerManager.connect('localhost', '8160');
    client = ServerManager.addClient('localhost', '8160');

    //GUIS should be initialized BEFORE the entity manager starts.
    guis.add(new Gui("Broken_Sword", new Vector2f(0.85, 0), new Vector2f(0.2, 0.2)));
    guis.add(new Gui("Mini_Map_Border", new Vector2f(0.55, -0.6), new Vector2f(0.35, 0.35)));

    ScriptingEngine.addScript("EntityManager");

    ScriptingEngine.addScript("Player",  -2, -2);
    ScriptingEngine.addScript("Door",  6, -6);
    ScriptingEngine.addScript("LevelController", "helloWorld");

    client.registerCallback(new Callback(function (data) {
        Log.println(data);
    }));

    // otherPlayer = LightingEngine.addLight(new Vector3f(0, 2, 0), new Vector3f(1, 0, 0));
    // LightingEngine.addLight(new Vector3f(0, 6, 1), new Vector3f(1, 0, 0));
    LightingEngine.addLight(new Vector3f(0, 6, 1), new Vector3f(1, 1, 1));
}

function tick(){
    if(client.getData()) {
        if (client.getData('id') != ScriptingEngine.getScript('Player').var('player').getID()) {
            if(client.hasData('x')&& client.hasData('y')&& client.hasData('z')) {
                // otherPlayer.setPosition(new Vector3f(client.getData('x'), client.getData('y'), client.getData('z')));
            }
        }
    }
}

function render(){

}