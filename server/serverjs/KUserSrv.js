define(["commonjs/KUserData","serverjs/KActorSrv"], 
    function (KUserData, KActorSrv) 
{ 
    var SAT     = require('sat');
    var g_unit = 10; // 10 

    var KUserSrv = function(p_socketid, p_userID) 
    { 
        this.userData = new KUserData();
        this.userData.socketid = p_socketid;
        this.userData.userID = p_userID;
        this.actors = [];
        this.mainActor = null;
        this.lastHeartbeat = 0;
        this.commandQueue = [];
    }

    KUserSrv.prototype.clone = function(p_other) 
    { 
        this.userData.clone(p_other.userData);
        this.lastHeartbeat = p_other.lastHeartbeat;
        this.commandQueue = p_other.commandQueue;    
    }

    KUserSrv.prototype.makeActor = function(p_sector) {
        var userData = this.userData;
        var shortName = userData.username.substring(0, 3);
        var actorID = userData.userID+this.actors.length;
        var posX = userData.homePosition.x - 10+20*this.actors.length;
        var posY = userData.homePosition.y - 10+20*this.actors.length;

        var circle = new SAT.Circle(new SAT.Vector(posX, posY), g_unit*0.4);
        var actor = new KActorSrv(userData.userID, actorID, shortName+actorID, circle, p_sector);
        this.actors.push(actor.actorID);
        this.userData.actorIDs.push(actor.actorID);
        return actor;
    }

    KUserSrv.prototype.selectActor = function(actor)
    {
        this.mainActor = actor;
        this.userData.mainActorID = actor.actorID;
    }
    return KUserSrv;
});