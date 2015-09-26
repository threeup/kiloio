var btn = null;
var nickErrorText = null;
var playerNameInput = null;
var loginBlock = null;
var renderCanvas = null;
var hudCanvas = null;

var checkNick = function() { console.log('checkNick'); }
var doHandleKeyDown = function(key) { }
var doHandleKeyUp = function(key) { }

window.onload = function() {
    'use strict';

    btn = document.getElementById('startButton');
    nickErrorText = document.querySelector('#startMenu .input-error');
    playerNameInput = document.getElementById('playerNameInput');
    loginBlock = document.getElementById('startMenuWrapper');
    renderCanvas = document.getElementById("renderCanvas");
    hudCanvas = document.getElementById("hudCanvas");
    renderCanvas.style.display = 'none';
    hudCanvas.style.display = 'none';
    
    btn.onclick = function () {
        checkNick();
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === KEY_ENTER) {
            checkNick();
        }
    });
};


window.addEventListener('keydown',
    function(event){
        var key = event.which || event.keyCode;
        doHandleKeyDown(key);
    }
);
window.addEventListener('keyup',
    function(event){
        var key = event.which || event.keyCode;
        doHandleKeyUp(key);
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