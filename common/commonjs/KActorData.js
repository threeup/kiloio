define(function () 
{ 
    var KActorData = function()
    { 
        this.userID = 0;
        this.actorID = 0;
        this.actorname = "-";
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastVelocity = { x: 0, y: 0 };
        this.actorState = 0;
        this.speed = 0.4;
        this.momentum = 0.2;
        this.mass = 1.0;
        this.ttl = -1;
    }

    KActorData.prototype.clone = function(p_other)
    {
        this.userID = p_other.userID;
        this.actorID = p_other.actorID;
        this.actorname = p_other.actorname;
        this.position = { x: p_other.position.x, y: p_other.position.y };
        this.velocity = { x: p_other.velocity.x, y: p_other.velocity.y };
        this.lastVelocity = { x: p_other.lastVelocity.x, y: p_other.lastVelocity.y };
        this.speed = p_other.speed;
        this.momentum = p_other.momentum;
        this.mass = p_other.mass;
        this.ttl = p_other.ttl;
    }

    return KActorData;  
});

