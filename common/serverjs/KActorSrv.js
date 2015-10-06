define(["common/KActorData","common/KInputData", "server/KSectorSrv"], 
    function (KActorData,KInputData, KSectorSrv) 
{ 
    var SAT     = require('sat');
    var g_unit = 10; // 10 
    var KActorSrv = function(p_userID, p_actorID, p_name, p_sector, p_visual) 
    { 
        
        this.actorData = new KActorData();
        this.actorData.userID = p_userID;
        this.actorData.actorID = p_actorID;
        this.actorData.actorname = p_name;
        this.actorData.visual = p_visual;
        this.inputData = new KInputData();
       
        this.sector = p_sector;
        this.sector.actorList.push(this);
        this.isStopped = true;
        this.isWeaponLeft = true;
        this.isCharging = false;
        this.chargeTime = 0;
    }
    KActorSrv.prototype.addCircle = function(p_x, p_y, p_r)
    {        
        this.circle = new SAT.Circle(new SAT.Vector(p_x, p_y), p_r);;
        this.actorData.position.x = p_x;
        this.actorData.position.y = p_y;
    }

    
    KActorSrv.prototype.beforeTurn = function(config)
    {
        this.actorData.facingHead.x = this.inputData.lsx;
        this.actorData.facingHead.y = this.inputData.lsy;
        this.actorData.facingEngine.x = this.inputData.rsx;
        this.actorData.facingEngine.y = this.inputData.rsy;
    }
    KActorSrv.prototype.afterTurn = function(config)
    {
        if( this.actorData.timeToLive > 0)
        {
            this.actorData.timeToLive--;
            if( this.actorData.timeToLive === 0 )
            {
                console.log("dead");
                this.actorData.actorState = "D";
            }
        }
    }
    
    KActorSrv.prototype.momentumDesireMove = function(config)
    {
        this.actorData.velocity.x += this.actorData.lastVelocity.x*this.actorData.momentum;
        this.actorData.velocity.y += this.actorData.lastVelocity.y*this.actorData.momentum;
    }

    KActorSrv.prototype.inputDesireMove = function(config)
    {
        var velX = this.inputData.lsx;
        var velY = this.inputData.lsy;
        var length = Math.sqrt(velX * velX + velY * velY);

        var speed = this.actorData.speed * config.baseMoveSpeed;
        if( length > 0 )
        {
            velX = velX/length * speed;
            velY = velY/length * speed;

            this.actorData.velocity.x += velX * config.turnLength / 1000;
            this.actorData.velocity.y += velY * config.turnLength / 1000;
        }
    }

    KActorSrv.prototype.finishDesireMove = function()
    {
        this.circle.pos.x = this.actorData.position.x + this.actorData.velocity.x;
        this.circle.pos.y = this.actorData.position.y + this.actorData.velocity.y;        
        
    }

    KActorSrv.prototype.attemptMove = function()
    {
        var diffX = this.circle.pos.x - this.actorData.position.x;
        var diffY = this.circle.pos.y - this.actorData.position.y;
        this.isStopped = (diffX*diffX+diffY*diffY) < 0.1;
        if( !this.isStopped)
        {
            this.sector.attemptMoveGround(this)
            this.sector.attemptMoveActors(this); 
        }
    }

    KActorSrv.prototype.applyMove = function()
    {
        this.circle.pos.x = Math.round(this.circle.pos.x);
        this.circle.pos.y = Math.round(this.circle.pos.y);
        this.actorData.lastVelocity.x = this.circle.pos.x - this.actorData.position.x;
        this.actorData.lastVelocity.y = this.circle.pos.y - this.actorData.position.y;
        this.actorData.position.x = this.circle.pos.x;
        this.actorData.position.y = this.circle.pos.y;
        this.actorData.velocity.x = 0;
        this.actorData.velocity.y = 0;

    }

    KActorSrv.prototype.collisionProcess = function(overlapX, overlapY, amount) 
    {
        this.circle.pos.x += overlapX*amount*1;
        this.circle.pos.y += overlapY*amount*1;
        
    }

    KActorSrv.prototype.collisionMoveTo = function(posX, posY) 
    {
        this.circle.pos.x = posX;
        this.circle.pos.y = posY;        
    }

    KActorSrv.prototype.collisionStop = function() 
    {
        this.circle.pos.x = this.actorData.position.x;
        this.circle.pos.y = this.actorData.position.y;

        
    }

    KActorSrv.prototype.getRealCircle = function(offsetX, offsetY)
    {
        return { 
            x:this.circle.pos.x+this.circle.r*offsetX, 
            y:this.circle.pos.y+this.circle.r*offsetY };
    }


    KActorSrv.prototype.doAbilities = function(config, world)
    {
        
        if( this.isCharging )
        {
            if( this.inputData.p )
            {
                this.chargeTime += config.turnLength;
            }
            else
            {
                world.doShoot(this, this.isWeaponLeft, this.chargeTime);
                this.isCharging = false;
                this.chargeTime = 0;
            }
        }
        else
        {
            if( this.inputData.p )
            {
                this.isCharging = true;
                this.isWeaponLeft = !this.isWeaponLeft;
                world.doPunch(this, this.isWeaponLeft);
            }
        }

        
    }

    return KActorSrv;  
});