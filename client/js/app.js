
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        clientjs: '/clientjs',
        commonjs: '/commonjs'
    }
});

var game = null;

require(["commonjs/KUserData", "clientjs/KUserCli", "commonjs/KActorData", "clientjs/KActorCli", "clientjs/KSectorCli", "clientjs/KWorldCli", "clientjs/KGame"], 
    function(KUserData, KUserCli, KActorData, KActorCli, KSectorCli, KWorldCli, KGame) {

    game = new KGame('abc');

    doHandleKeyDown = function(key) {
        game.handleKeyDown(key);
    }
    doHandleKeyUp = function(key) {
        game.handleKeyUp(key);
    }

    checkNick = function() {
        // check if the nick is valid
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    }
});


var socket;
var localUserName;

var reenviar = true;

var startPingTime = 0;



function startGame() {
    localUserName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    loginBlock.style.display = 'none';
    renderCanvas.style.display = 'block';
    hudCanvas.style.display = 'block';
    socket = io();
    game.createCore();
    game.createCamera();
    game.createWorld();

    game.engine.runRenderLoop(function () {
        game.scene.render();
    });

    // Resize
    window.addEventListener("resize", function () {
        game.engine.resize();
    });
    
    setupAppSocket(socket);
    
    
    socket.emit('c-spawn');
    animloop();
}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    var regex = /^\w*$/;
    console.log('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null;
}


function sendPing()
{
    startPingTime = Date.now();
    socket.emit('c-ping');
}

    
function setupAppSocket(socket) 
{
    console.log("Socket setup");
        // Handle ping
    socket.on('s-pong', function () {
        var latency = Date.now() - startPingTime;
        console.log('Latency: ' + latency + 'ms');
    });

    // Handle error
    socket.on('connect_failed', function () {
        socket.close();
        disconnected = true;
    });


    socket.on('s-kick', function () {
        console.log('kicked');
        
    });

    socket.on('disconnect', function () {
        socket.close();
        disconnected = true;
    });

    socket.on('s-gameSetup', function(data) {
        gameWidth = data.gameWidth;
        gameHeight = data.gameHeight;
    });
    

    game.setupGameSocket(socket);
    console.log(socket);
}


window.addEventListener("contextmenu", function (evt)
{
    evt.preventDefault();
});


function animloop(){
    requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    game.handleLogic();
    game.handleGraphics();
}