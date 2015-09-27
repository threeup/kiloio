define(["commonjs/KActorData","commonjs/KInputData", "serverjs/KSectorSrv"], 
    function (KActorData,KInputData, KSectorSrv) 
{ 
    var SAT     = require('sat');
    var g_unit = 10; // 10 
    var KActorSrv = function(p_userID, p_actorID, p_name, p_circle, p_sector) 
    { 
        var posX = p_circle.pos.x;
        var posY = p_circle.pos.y;
        this.actorData = new KActorData();
        this.actorData.userID = p_userID;
        this.actorData.actorID = p_actorID;
        this.actorData.acotrname = p_name;
        this.actorData.position.x = posX;
        this.actorData.position.y = posY;
        this.inputData = new KInputData();
        this.circle = p_circle;
        this.sector = p_sector;
        this.sector.actorList.push(this);
        this.isStopped = true;
        this.isWeaponLeft = true;
        this.isCharging = false;
        this.chargeTime = 0;
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

            this.actorData.velocity.x += velX * config.movePeriod / 1000;
            this.actorData.velocity.y += velY * config.movePeriod / 1000;
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


    KActorSrv.prototype.doAbilities = function(config)
    {
        
        if( this.isCharging )
        {
            if( this.inputData.p )
            {
                this.chargeTime += config.movePeriod;
            }
            else
            {
                this.doShoot(this.isWeaponLeft, this.chargeTime);
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
                this.doPunch(this.isWeaponLeft);
            }
        }

        
    }

    KActorSrv.prototype.doPunch = function(leftHand)
    {
        console.log('punch');
    }

    KActorSrv.prototype.doShoot = function(leftHand, chargeTime)
    {
        console.log('shoot');
        console.log(chargeTime);
    }
    return KActorSrv;  
});