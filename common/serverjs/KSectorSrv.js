define(["server/KWorld", "common/KUtil", "libjs/quadtree"], 
    function (KWorld, KUtil, quadtree) 
{ 
    var SAT     = require('sat');

    var KSectorSrv = function(world,secX,secY,seed)
    {
        this.secX = secX;
        this.secY = secY;
        this.world = world;
        this.seed = seed;
        
        var treeargs = {
            x: this.world.getRealFromSecPos(secX-0.5), 
            y: this.world.getRealFromSecPos(secY-0.5), 
            h: this.world.getRealFromSecPos(1), 
            w: this.world.getRealFromSecPos(1), 
            maxChildren: 1, 
            maxDepth: 3
        };

        this.actorList = [];
        this.groundList = [];

        this.sectorUnit = this.world.sectorUnit;
        this.sectorRadius = this.world.sectorRadius;

        for(var row=0; row<this.sectorUnit; ++row)
        {
            var line = world.getLine(this.seed, row);
            this.groundList.push(line);
        }
        this.tree = quadtree.init(treeargs);
    }

    KSectorSrv.prototype.getPosFromRelTile = function(relTileX, relTileY)
    {
        //0 should be -16, should be -160
        var posX = this.secX*this.sectorUnit+(relTileX - this.sectorRadius)*this.tileUnit;
        var posY = this.secY*this.sectorUnit+(relTileY - this.sectorRadius)*this.tileUnit;
        return {x:posX, y:posY};
    }

    KSectorSrv.prototype.getGround = function(tile)
    {
        var relTileX = (tile.x + this.sectorRadius) % this.sectorUnit;
        var relTileY = (tile.y + this.sectorRadius) % this.sectorUnit;
        return this.groundList[relTileY][relTileX];
    }

    

    KSectorSrv.prototype.setGround = function(tile, val)
    {
        var relTileX = (tile.x + this.sectorRadius) % this.sectorUnit;
        var relTileY = (tile.y + this.sectorRadius) % this.sectorUnit;
        var line = KUtil.setCharAt(this.groundList[relTileY], relTileX, val);
        return this.groundList[relTileY] = line;
    }
    
    KSectorSrv.prototype.check = function(otherActor) 
    {
        if( otherActor.actorData.actorID == bufferActor.actorData.actorID)
            return;

        //dont use 'this'
        var response = new SAT.Response();
        var collided = SAT.testCircleCircle(bufferActor.circle, otherActor.circle, response);
        if (collided) {
            response.aUser = bufferActor;
            response.bUser = otherActor;
            bufferCollisions.push(response);
        }
    }
    KSectorSrv.prototype.remLetter = function(actor)
    {
        var originTile = this.world.getTile(actor.actorData.position);
        var groundOrigin = this.getGround(originTile);
        if(groundOrigin == 'A')
        {
            this.setGround(originTile, ' ');
        }
        
    }

    KSectorSrv.prototype.addLetter = function(actor)
    {
        var originTile = this.world.getTile(actor.actorData.position);
        if(this.getGround(originTile) == ' ')
        {
            this.setGround(originTile, 'A');
        }
    }

    KSectorSrv.prototype.turnStart = function() 
    {
        this.tree.clear();
        this.tree.insert(this.actorList);

        for(var i=0;i<this.actorList.length;++i)
        {
            this.remLetter(this.actorList[i]);
        }
    }

    KSectorSrv.prototype.turnEnd = function() 
    {
        for(var i=0;i<this.actorList.length;++i)
        {
            this.addLetter(this.actorList[i]);
        }

    }

    KSectorSrv.prototype.collisionProcess = function(response) 
    {
        if( response.aInB || response.bInA )
        {
            //idk
        }
        else
        {
            var tot = response.aUser.actorData.mass + response.bUser.actorData.mass;
            
            var adjustedDir = response.overlapN;
            if( adjustedDir.x > 0.924 ) { adjustedDir.x = 1; }
            else if( adjustedDir.x > 0.383 ) { adjustedDir.x = 0.707; }
            else if( adjustedDir.x > -0.383 ) { adjustedDir.x = 0; }
            else if ( adjustedDir.x > -0.924 ) { adjustedDir.x = -0.707; }
            else { adjustedDir.x = -1; }

            if( adjustedDir.y > 0.924 ) { adjustedDir.y = 1; }
            else if( adjustedDir.y > 0.383 ) { adjustedDir.y = 0.707; }
            else if( adjustedDir.y > -0.383 ) { adjustedDir.y = 0; }
            else if ( adjustedDir.y > -0.924 ) { adjustedDir.y = -0.707; }
            else { adjustedDir.y = -1; }
            
            response.aUser.collisionProcess(
                -adjustedDir.x * response.overlap, 
                -adjustedDir.y * response.overlap, 
                response.bUser.actorData.mass/tot);
            response.bUser.collisionProcess(
                adjustedDir.x * response.overlap, 
                adjustedDir.y * response.overlap, 
                response.aUser.actorData.mass/tot);
            
        }
    }

    KSectorSrv.prototype.attemptMoveGround = function(moveActor) 
    {
        var originPos = moveActor.actorData.position;
        var originTile = this.world.getTile(originPos);
        var groundOrigin = this.getGround(originTile);
        if(groundOrigin != ' ')
        {
            return;
        }

        var tileNE = this.world.getTile(moveActor.getRealCircle(1,1));
        var tileSE = this.world.getTile(moveActor.getRealCircle(1,-1));
        var tileSW = this.world.getTile(moveActor.getRealCircle(-1,-1));
        var tileNW = this.world.getTile(moveActor.getRealCircle(-1,1));

        var groundNE = this.getGround(tileNE);
        var groundSE = this.getGround(tileSE);
        var groundSW = this.getGround(tileSW);
        var groundNW = this.getGround(tileNW);

        var hasVelX = Math.abs(moveActor.actorData.velocity.x) > 0.1;
        var hasVelY = Math.abs(moveActor.actorData.velocity.y) > 0.1;
        
        var stopCountY = 0;
        var stopCountX = 0;
        var slideCountY = 0;
        var slideCountX = 0;
        if( groundNE != ' ')
        {
            if( hasVelY && originTile.x == tileNE.x ) { stopCountY++; } else { slideCountX++; }
            if( hasVelX && originTile.y == tileNE.y ) { stopCountX++; } else { slideCountY++; }
        }
        if( groundSE != ' ')
        {
            if( hasVelY && originTile.x == tileSE.x ) { stopCountY++; } else { slideCountX++; }
            if( hasVelX && originTile.y == tileSE.y ) { stopCountX++; } else { slideCountY++; }
        }
        if( groundSW != ' ')
        {
            if( hasVelY && originTile.x == tileSW.x ) { stopCountY++; } else { slideCountX++; }
            if( hasVelX && originTile.y == tileSW.y ) { stopCountX++; } else { slideCountY++; }
        }
        if( groundNW != ' ')
        {
            if( hasVelY && originTile.x == tileNW.x ) { stopCountY++; } else { slideCountX++; }
            if( hasVelX && originTile.y == tileNW.y ) { stopCountX++; } else { slideCountY++; }
        }
        
        var posX = moveActor.circle.pos.x;
        var posY = moveActor.circle.pos.y;
        if(stopCountX >= 1)
        {
            posX = originPos.x;   
        }
        else if( slideCountX >= 1)
        {
            posX = this.world.getRealFromTilePos(originTile.x); 
        }
        if(stopCountY >= 1)
        {
            posY = originPos.y;   
        }
        else if( slideCountY >= 1)
        {
            posY = this.world.getRealFromTilePos(originTile.y); 
        }
        moveActor.collisionMoveTo(posX, posY);
    }


    KSectorSrv.prototype.attemptMoveActors = function(moveActor) 
    {
        bufferCollisions = [];
        bufferActor = moveActor;



        
        this.actorList.forEach(this.check);
        this.tree.retrieve(bufferActor, this.check);

        bufferCollisions.forEach(this.collisionProcess);

    }

    KSectorSrv.prototype.draw = function()
    {
        console.log('actors'+this.actorList.length);
        for(var row=this.sectorUnit-1; row>=0; --row)
        {
            console.log(this.groundList[row]);
        }
    }
    return KSectorSrv;  
});