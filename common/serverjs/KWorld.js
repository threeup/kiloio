define(["server/KSectorSrv", "common/KUtil"], 
    function (KSectorSrv, KUtil) 
{ 
    var KWorld = function(seed, io)
    {
        //max = 4294967295 ?
        this.seed = seed*1000000;
        this.tileUnit = 10;
        this.sectorRadius = 16; //16 units
        this.sectorUnit = 32; //32 units
        this.worldRadius = 5; //5 sectors
        this.sectors = [];
        this.users = [];
        this.actors = [];
        this.io = io;
        for(var i = -this.worldRadius; i <= this.worldRadius; ++i)
        {
            var sectorRow = [];
            for(var j = -this.worldRadius; j <= this.worldRadius; ++j)
            {
                var sectorSeed = this.seed + i*10000+j*100;
                sectorRow.push(new KSectorSrv(this,i,j,sectorSeed));
            }
            this.sectors.push(sectorRow);
        }
        this.worldUser = null;
    }

    KWorld.prototype.getRealFromSecPos = function(v)
    {
        return v*this.sectorUnit*this.tileUnit;
    }
    KWorld.prototype.getRealFromTilePos = function(v)
    {
        return v*this.tileUnit;
    }
    KWorld.prototype.getTileFromSecPos = function(v)
    {
        return v*this.sectorUnit;
    }
    KWorld.prototype.getTileFromRealPos = function(v)
    {
        return Math.round(v/this.tileUnit);
    }

    KWorld.prototype.getTile = function(realPos)
    {
        var tileX = this.getTileFromRealPos(realPos.x);
        var tileY = this.getTileFromRealPos(realPos.y);
        return {x:tileX, y:tileY};
    }

    KWorld.prototype.getSectorSecPos = function(x,y)
    {
        var xindex = x+this.worldRadius;
        var yindex = y+this.worldRadius;
        return this.sectors[xindex][yindex];
    }

    KWorld.prototype.getSectorTilePos = function(x,y)
    {
        return this.getSectorSecPos( 
            Math.round(x/this.sectorUnit), 
            Math.round(y/this.sectorUnit));
    }

    KWorld.prototype.getSectorRealPos = function(x,y)
    {
        return this.getSectorSecPos( 
            Math.round((x/this.tileUnit)/this.sectorUnit), 
            Math.round((y/this.tileUnit)/this.sectorUnit));
    }

    KWorld.prototype.tickLoop = function(config, sockets)
    {
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            while(user.commandQueue.length > 0)
            {
                var command = user.commandQueue.pop();
                if(command === 's')
                {
                    var g_unit = 10;
                    var posX = user.userData.homePosition.x - 10+20*user.actors.length;
                    var posY = user.userData.homePosition.y - 10+20*user.actors.length;
                    var physics = {
                        x:posX, y:posY, 
                        vx:0, vy:0, 
                        momentum: 0.2,
                        r:g_unit*0.4, 
                        timeToLive:-1}

                    var username = user.userData.username.substring(0, 3);
                    var actor = this.createActor(user, username, physics, "A");
                    if( user.mainActor === null )
                    {
                        user.selectActor(actor);
                    }
                }
            }
            if(user.lastHeartbeat < new Date().getTime() - config.maxHeartbeatInterval) 
            {
                var userData = user.userData;
                if( userData.socketid > 0 )
                {
                    sockets[userData.socketid].emit('s-kick', 'Last heartbeat received over ' + config.maxHeartbeatInterval + ' ago.');
                    sockets[userData.socketid].disconnect();
                }
            }
        }
    }

    KWorld.prototype.doPunch = function(heroActor, leftHand)
    {
        var uidx = KUtil.findUser(this.users, heroActor.actorData.userID);
        var user = this.users[uidx];
        var g_unit = 10;
        var facX = Math.round(heroActor.actorData.facingHead.x*10)/10;
        var facY = Math.round(heroActor.actorData.facingHead.y*10)/10;
        var posX = heroActor.actorData.position.x+facX;
        var posY = heroActor.actorData.position.y+facY;
        var velX = facX*0.1;
        var velY = facY*0.1;
        var physics = {
            x:posX, y:posY, 
            vx:velX, vy:velY, 
            r:g_unit*0.1, 
            momentum:0.2, 
            timeToLive:10}
        var username = user.userData.username.substring(0, 3)+'punch';
        var punch = this.createActor(user, username, physics, "P");
    }

    KWorld.prototype.doShoot = function(heroActor, leftHand, chargeTime)
    {
        var uidx = KUtil.findUser(this.users, heroActor.actorData.userID);
        var user = this.users[uidx];
        var g_unit = 10;
        var facX = Math.round(heroActor.actorData.facingHead.x*10)/10;
        var facY = Math.round(heroActor.actorData.facingHead.y*10)/10;
        var posX = heroActor.actorData.position.x+facX;
        var posY = heroActor.actorData.position.y+facY;
        var velX = facX*(Math.min(6, chargeTime)+4);
        var velY = facY*(Math.min(6, chargeTime)+4);
        var physics = {
            x:posX, y:posY, 
            vx:velX, vy:velY, 
            r:g_unit*0.1, 
            momentum:1, 
            timeToLive:50}
        var username = user.userData.username.substring(0, 3)+'shoot';
        var shoot = this.createActor(user, username, physics, "S");
    }
    KWorld.prototype.createActor = function(p_user, p_name, p_physics, p_visual)
    {
        var sector = this.getSectorRealPos(p_physics.x, p_physics.y);
        var actor = p_user.makeActor(p_name, p_physics, sector, p_visual);
        this.actors.push(actor);

        this.io.emit('s-addActorData', actor.actorData );
        return actor;
    }


    KWorld.prototype.turnLoop = function(config)
    {
        var world = this;
        this.sectors.forEach( function(sectorRow)
        { 
            sectorRow.forEach( function(sector)
            { 
                sector.turnStart();
            });
        });
        this.actors.forEach( function(actor)
        {
            actor.beforeTurn();
            actor.momentumDesireMove(config);
            actor.inputDesireMove(config);
            actor.finishDesireMove(config);
        });
        this.actors.forEach( function(actor)
        {
            actor.attemptMove(config);
        });
        this.actors.forEach( function(actor)
        {
            actor.applyMove(config);
            actor.doAbilities(config, world);
        });
        for(var i = this.actors.length-1; i >= 0; --i)
        {
            var actor = this.actors[i];
            actor.afterTurn();
            if( actor.actorData.actorState === "D")
            {
                var uidx = KUtil.findUser(this.users, actor.actorData.userID);
                var user = this.users[uidx];
                user.removeActor(actor.actorData)
                this.io.emit('s-remActorData', actor.actorData );
                this.actors.splice(i, 1);
            }
        }
        this.sectors.forEach( function(sectorRow)
        { 
            sectorRow.forEach( function(sector)
            { 
                sector.turnEnd();
            });
        });
    }

    

    KWorld.prototype.getLine = function(seed, row)
    {
        var localSeed = seed & 31; //0b11111 
        var isGrid = row % 2 == 1; //1, 3, ... 29, 31

        var isNorthSouth = row == 0 || row == 1 || row == 31;
        var isEastWest = row > 13 && row < 19;

        var vegetationSeed = (seed >> 6) & 7; //0b111
        var hasTree = vegetationSeed % 5 == 0;
        var hasCave = vegetationSeed % 5 == 1;
        var hasLake = vegetationSeed % 5 == 2;
        var hasBlue = vegetationSeed % 5 == 3;
        var hasPalm = vegetationSeed % 5 == 4;

        var line = "";  
        if( isGrid)
        {
            line = "X X XBX X X X X X X XBX X X X XX";
        }
        else
        {
            line = "X                             XX";  
        }
        if( isNorthSouth )
        {
            line = "XXXXXXXXXXXXXX     XXXXXXXXXXXXX";
        }
        else if( isEastWest )
        {
            line = " "+line.slice(1,29)+"    ";
        }

        /*if( hasTree )
        {
            line = line.slice(0,5)+"TTTT"+line.slice(9,32);
        }
        if( hasCave )
        {
            line = line.slice(0,25)+"CCCC"+line.slice(29,32);
        }
        if( hasLake )
        {
            line = line.slice(0,25)+"LLLL"+line.slice(29,32);
        }
        if( hasBlue )
        {
            line = line.slice(0,25)+"BBBB"+line.slice(29,32);
        }
        if( hasPalm )
        {
            line = line.slice(0,25)+"PPPP"+line.slice(29,32);
        }*/
        return line;
    }
    return KWorld;  
});