var client;
var otherPlayer;

function init(){
    ServerManager.connect('localhost', '8160');
    client = ServerManager.addClient('localhost', '8160');

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