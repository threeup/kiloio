var express = require('express');
var app     = express();

var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var requirejs = require('requirejs');

// Boiler plate stuff - as per r.js's instructions
requirejs.config({
    paths: {
        commonjs: '../common/commonjs',
        serverjs: './serverjs',
        libjs: './lib',
        text: './lib/text',
        json: './lib/json'
    },

    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});




var config  = requirejs('json!libjs/config.json');
var treeargs = null;

var g_world = null;;
var g_users = [];
var g_actors = [];
var g_sockets = {};
var g_unit = 10; // 10 
var nextWorlduserID = 10;
var nextuserID = 100;

var worldUser = null;
var bufferCollider = null;
var bufferCollisions = [];
var serverPort = 0;


app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../common'));

function gameStart(KWorld, KUserSrv, KUtil)
{
    treeargs = {
        x: 0, 
        y: 0, 
        h: config.gameHeight, 
        w: config.gameWidth, 
        maxChildren: 1, 
        maxDepth: 5
    };
    g_world = new KWorld(2);
    worldUser = new KUserSrv(0,nextWorlduserID);
    worldUser.userData.homePosition.x = 0;
    worldUser.userData.homePosition.y = 0;
    g_users.push(worldUser);

    socketStart(KUserSrv, KUtil);        
    setInterval(moveLoop, config.movePeriod);
    setInterval(tickLoop, 1000 / 60);
    setInterval(sendUpdates, 1000 / config.networkUpdateFactor);
    setInterval(sendReport, 1000*10);

}

function socketStart(KUserSrv, KUtil)
{

    io.on('connection', function (socket) {
    	console.log("Socket setup start");
    	

    	var user = new KUserSrv(socket.id, nextuserID);
        
    	nextuserID = nextuserID + 1;

    	user.lastHeartbeat = new Date().getTime();

    	socket.on('c-userLaunch', function (populatedUserData) {
            console.log('Connection ' + populatedUserData.socketid + ' connecting');

            if (KUtil.findIndex(g_users, populatedUserData.socketid) > -1) {
                console.log('That userID is already connected, kicking');
                socket.disconnect();
            } else if (!KUtil.validNick(populatedUserData.username)) {
                socket.emit('s-kick', 'Invalid username');
                socket.disconnect();
            } else {
                user.userData.clone(populatedUserData);
                console.log('Connection ' + user.userData.socketid + ' connected');
                g_sockets[user.userData.socketid] = socket;

                sendAddPacketsToSocket(user.userData.socketid);
                console.log('Sent first data to ' + user.userData.socketid);

                user.lastHeartbeat = new Date().getTime();
                io.emit('s-addUserData', user.userData );
                user.commandQueue.push('s');
                user.commandQueue.push('s');
            	g_users.push(user);

                console.log('Total users: ' + g_users.length);
            }

        });
    	socket.on('c-ping', function () {
            socket.emit('s-pong');
        });

        socket.on('windowResized', function (data) {
            user.screenWidth = data.screenWidth;
            user.screenHeight = data.screenHeight;
        });

        socket.on('c-requestSector', function (sectorData) {
            
            console.log('requested sector');
            console.log(sectorData);

            var sector = g_world.getSectorSecPos(sectorData.x,sectorData.y);
            socket.emit('s-addSectorData', {
                secX: sector.secX,
                secY: sector.secY,
                seed: sector.seed,
                groundData: sector.groundList
            });
        });

        socket.on('c-spawn', function () {
        	if (KUtil.findIndex(g_users, user.userData.socketid) > -1)
                g_users.splice(KUtil.findIndex(g_users, user.userData.socketid), 1);
            socket.emit('s-localPopulate', user.userData);
            socket.emit('s-gameSetup', {
                gameWidth: config.gameWidth,
                gameHeight: config.gameHeight
            });
            console.log('Connection ' + user.userData.socketid + ' initialized');
        });

        socket.on('disconnect', function () {
            if (KUtil.findIndex(g_users, user.userData.socketid) > -1)
                g_users.splice(KUtil.findIndex(g_users, user.userData.socketid), 1);
            console.log('Connection' + user.userData.socketid + ' disconnected');

            socket.broadcast.emit('playerDisconnect', { name: user.userData.username });
        });

    	// Heartbeat function, update everytime
        socket.on('0', function(inputData) {
            user.lastHeartbeat = new Date().getTime();
            if( user.mainActor !== null )
            {
                
            	user.mainActor.inputData.clone(inputData);
            }
            else
            {
                console.log('missing main actor');
                console.log(user);
            }
        });
        console.log('Socket setup finish');
    });
    serverPort = process.env.PORT || config.port;
    http.listen(serverPort, function() {
      console.log("Server is listening on port " + serverPort);
    });

}



function sendAddPacketsToSocket(socketid)
{
    g_users.forEach( function(user) 
    {
        g_sockets[socketid].emit('s-addUserData', user.userData );
    });
    g_actors.forEach( function(actor) 
    {
        g_sockets[socketid].emit('s-addActorData', actor.actorData );
    });
}


function tickUser(user) {

    if(user.lastHeartbeat < new Date().getTime() - config.maxHeartbeatInterval) 
    {
        var userData = user.userData;
        if( userData.socketid > 0 )
        {
            g_sockets[userData.socketid].emit('s-kick', 'Last heartbeat received over ' + config.maxHeartbeatInterval + ' ago.');
            g_sockets[userData.socketid].disconnect();
        }
    }

    moveUser(user);
}


function moveLoop() {
    g_world.sectors.forEach( function(sectorRow)
    { 
        sectorRow.forEach( function(sector)
        { 
            sector.tickStart();
        });
    });
    g_actors.forEach( function(actor)
    {
        actor.momentumDesireMove(config);
        actor.inputDesireMove(config);
        actor.finishDesireMove(config);
    });
    var x = Date.now();
    g_actors.forEach( function(actor)
    {
        actor.attemptMove(config);
    });
    g_actors.forEach( function(actor)
    {
        actor.applyMove(config);
        actor.doAbilities(config);
    });
    g_world.sectors.forEach( function(sectorRow)
    { 
        sectorRow.forEach( function(sector)
        { 
            sector.tickEnd();
        });
    });
    var y = Date.now();
    var z = y-x;
    if(z > 5)
    {
        console.log(z);
    }
}

function tickLoop() {
    

    for (var i = 0; i < g_users.length; i++) {
        var user = g_users[i];
        while(user.commandQueue.length > 0)
        {
            var command = user.commandQueue.pop();
            if(command === 's')
            {

                var sector = g_world.getSectorRealPos(
                    user.userData.homePosition.x, 
                    user.userData.homePosition.y);

                var actor = user.makeActor(sector);
                if( user.mainActor === null )
                {
                    user.selectActor(actor);
                }
                g_actors.push(actor);

                io.emit('s-addActorData', actor.actorData );
            }
        }
    }

}


function sendUpdates() {

    
	g_actors.forEach( function(actor) 
    {
        io.emit('s-updateActorData', actor.actorData);
    });
    g_users.forEach( function(user) 
    {
        io.emit('s-updateUserData', user.userData);

    });
}

function sendReport() {
	console.log('users');
    g_users.forEach( function(user) 
    {
    	console.log(user.userData.socketid+','+user.userData.userID);
	});
	console.log('actors');
	g_actors.forEach( function(actor) 
    {
        console.log(actor.actorData.actorname);
        console.log(actor.actorData.position);
    });
    //console.log('sectorZero');
    //var sector = g_world.getSectorSecPos(0,0);
    //sector.draw();
    /*
    g_world.sectors.forEach( function(sectorRow)
    { 
        sectorRow.forEach( function(sector)
        { 
            sector.draw();
        });
    });;*/
}

requirejs(["serverjs/KWorld", "serverjs/KUserSrv", "serverjs/KUtil"], 
    function(KWorld, KUserSrv, KUtil) {
        gameStart(KWorld, KUserSrv, KUtil);
    }
);
