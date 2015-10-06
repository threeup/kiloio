define(function () 
{ 
    var KActorData = function()
    { 
        this.userID = 0;
        this.actorID = 0;
        this.actorname = "-";
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.facingHead = { x: 0, y: 0 };
        this.facingEngine = { x: 0, y: 0 };
        this.lastVelocity = { x: 0, y: 0 };
        this.actorState = "I";//I nit, A live D ead
        this.speed = 0.4;
        this.momentum = 0.2;
        this.mass = 1.0;
        this.timeToLive = -1;
        this.visual = "a";
    }

    KActorData.prototype.clone = function(p_other)
    {
        this.userID = p_other.userID;
        this.actorID = p_other.actorID;
        this.actorname = p_other.actorname;
        this.position = { x: p_other.position.x, y: p_other.position.y };
        this.velocity = { x: p_other.velocity.x, y: p_other.velocity.y };
        this.facingHead = { x: p_other.facingHead.x, y: p_other.facingHead.y };
        this.facingEngine = { x: p_other.facingEngine.x, y: p_other.facingEngine.y };
        this.lastVelocity = { x: p_other.lastVelocity.x, y: p_other.lastVelocity.y };
        this.speed = p_other.speed;
        this.momentum = p_other.momentum;
        this.mass = p_other.mass;
        this.timeToLive = p_other.timeToLive;
        this.visual = p_other.visual;
    }

    return KActorData;  
});

