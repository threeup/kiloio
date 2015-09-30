define(["common/KActorData"], 
    function (KActorData) 
{ 
    var KItemSrv = function(p_userID, p_actorID, p_name, p_circle, p_sector) 
    { 
        this.actorData = new KActorData();
        this.actorData.userID = p_userID;
        this.actorData.actorID = p_actorID;
        this.actorData.actorname = p_name;
        this.actorData.position.x = p_circle.pos.x;
        this.actorData.position.y = p_circle.pos.y;
        this.circle = p_circle;
        this.sector = p_sector;
        this.sector.actorList.push(this);
    }
    KItemSrv.prototype.momentumDesireMove = function(config)
    {
        this.actorData.velocity.x += this.actorData.lastVelocity.x*this.actorData.momentum;
        this.actorData.velocity.y += this.actorData.lastVelocity.y*this.actorData.momentum;
    }

    KActorSrv.prototype.finishDesireMove = function()
    {
        this.circle.pos.x = this.actorData.position.x + this.actorData.velocity.x;
        this.circle.pos.y = this.actorData.position.y + this.actorData.velocity.y;
    }

    return KActorSrv;  
});