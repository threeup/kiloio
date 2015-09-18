
var socket;
var localUserName;

var playerNameInput = document.getElementById('playerNameInput');


var reenviar = true;

var startPingTime = 0;


var game = new KGame("KGame");

function startGame() {
    localUserName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    //document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';
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

window.onload = function() {
    'use strict';

    var btn = document.getElementById('startButton'),
        nickErrorText = document.querySelector('#startMenu .input-error');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === KEY_ENTER) {
            if (validNick()) {
                startGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });
};

function sendPing()
{
    startPingTime = Date.now();
    socket.emit('c-ping');
}

    
function setupAppSocket(socket) 
{
    console.log("Socket setup start");
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
    console.log("Socket setup finish");
}

function gameInput(mouse) 
{
    game.handleMouseInput(mouse);
}

function outOfBounds() 
{
    //var mouse = { x : 0, y: 0 };
    //game.handleMouseInput(mouse);
}

function keyInput(event) 
{
    var key = event.which || event.keyCode;
    if(reenviar) 
    {
        game.handleKeyInput(key);
    }
}

window.addEventListener("contextmenu", function (evt)
{
    evt.preventDefault();
});

window.addEventListener('keydown',
    function(event){
        var key = event.which || event.keyCode;
        game.handleKeyDown(key);
    }
);
window.addEventListener('keyup',
    function(event){
        var key = event.which || event.keyCode;
        game.handleKeyUp(key);
    }
);

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
})();

function animloop(){
    requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    game.handleLogic();
    game.handleGraphics();
}