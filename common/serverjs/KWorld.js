define(["server/KSectorSrv", "common/KUtil"], 
    function (KSectorSrv, KUtil) 
{ 
    var KWorld = function(seed)
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

    KWorld.prototype.tickLoop = function(config, io, sockets)
    {
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            while(user.commandQueue.length > 0)
            {
                var command = user.commandQueue.pop();
                if(command === 's')
                {
                    var sector = this.getSectorRealPos(
                        user.userData.homePosition.x, 
                        user.userData.homePosition.y);

                    var actor = user.makeHeroActor(sector);
                    if( user.mainActor === null )
                    {
                        user.selectActor(actor);
                    }
                    this.actors.push(actor);

                    io.emit('s-addActorData', actor.actorData );
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
        this.sectors.forEach( function(sectorRow)
        { 
            sectorRow.forEach( function(sector)
            { 
                sector.turnEnd();
            });
        });
    }

    KWorld.prototype.doPunch = function(heroActor, leftHand)
    {
        var uidx = KUtil.findUser(this.users, heroActor.actorData.userID);
        var user = this.users[uidx];
        var punch = user.makeItemActor(heroActor, {x:1, y:1})
        console.log('punch');
    }

    KWorld.prototype.doShoot = function(heroActor, leftHand, chargeTime)
    {
        var uidx = KUtil.findUser(this.users, heroActor.actorData.userID);
        var user = this.users[uidx];
        var bullet = user.makeItemActor(heroActor, {x:1, y:1})
        console.log('shoot');
        console.log(chargeTime);
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