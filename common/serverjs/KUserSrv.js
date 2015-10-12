define(["common/KUserData","server/KActorSrv"], 
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
        this.nextActorID = 1;
    }

    KUserSrv.prototype.clone = function(p_other) 
    { 
        this.userData.clone(p_other.userData);
        this.lastHeartbeat = p_other.lastHeartbeat;
        this.commandQueue = p_other.commandQueue;    
    }

    KUserSrv.prototype.makeActor = function(p_name, p_physics, p_sector, p_visual) {    

        var actorID = this.userData.userID+this.actors.length;
        var actor = new KActorSrv(this.userData.userID, actorID, p_name+actorID, p_sector, p_visual);
        actor.addCircle(p_physics.x, p_physics.y, p_physics.r);
        actor.actorData.actorState = "A";
        this.actors.push(actor.actorID);
        this.userData.actorIDs.push(actor.actorID);
        actor.actorData.timeToLive = p_physics.timeToLive;
        actor.actorData.velocity.x = p_physics.vx;
        actor.actorData.velocity.y = p_physics.vy;
        
        actor.actorData.momentum = p_physics.momentum;
        return actor;
    }

    KUserSrv.prototype.removeActor = function(p_actorData)
    {
        for(var i = this.actors.Count; i >= 0; ++i)
        {
            var actor = this.actors[i];
            if( actor.actorData.actorID === p_actorData.actorID)
            {
                this.actors.splice(i, 1);
            }
        }
    }

    /*KUserSrv.prototype.makeHeroActor = function(p_sector) {
        var userData = this.userData;
        var shortName = userData.username.substring(0, 3);
        var actorID = userData.userID+this.actors.length;
        var posX = userData.homePosition.x - 10+20*this.actors.length;
        var posY = userData.homePosition.y - 10+20*this.actors.length;

        var circle = new SAT.Circle(new SAT.Vector(posX, posY), g_unit*0.4);
        var actor = new KActorSrv(userData.userID, actorID, shortName+actorID, circle, p_sector, "a");
        this.actors.push(actor.actorID);
        this.userData.actorIDs.push(actor.actorID);
        return actor;
    }

    KUserSrv.prototype.makeItemActor = function(p_heroActor, p_velocity) {
        var userData = this.userData;
        var shortName = userData.username.substring(0, 3);
        var actorID = userData.userID+this.nextActorID;
        this.nextActorID = (this.nextActorID + 1) % 10;

        var circle = new SAT.Circle(p_heroActor.circle.pos, g_unit*0.1);
        var actor = new KActorSrv(userData.userID, actorID, shortName+actorID, circle, p_heroActor.sector, "p");
        actor.actorData.velocity.x = p_velocity.x;
        actor.actorData.velocity.y = p_velocity.y;
        actor.actorData.ttl = 1;
        this.actors.push(actor.actorID);
        this.userData.actorIDs.push(actor.actorID);
        return actor;
    }*/

    KUserSrv.prototype.killActor = function(p_actor)
    {
        this.actors.removeNumber(p_actor.actorID);
        this.userData.actorIDs.removeNumber(p_actor.actorID);
        delete p_actor;
    }

    KUserSrv.prototype.selectActor = function(actor)
    {
        this.mainActor = actor;
        this.userData.mainActorID = actor.actorID;
    }
    return KUserSrv;
});