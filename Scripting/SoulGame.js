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
    ScriptingEngine.addScript("LevelController", "helloWorld");

    client.registerCallback(new Callback(function (data) {
        Log.println(data);
    }));
}

function tick(){

}

function render(){

}