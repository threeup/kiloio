var KActorData = (function () 
{ 
    function KActorData() 
    { 
        this.userID = 0;
        this.actorID = 0;
        this.actorname = "-";
        this.inputJoy = { lfx: 0, lfy: 1, lsx: 0, lsy: 0, rfx: 0, rfy: 1, rsx: 0, rsy: 0, p:0, s:0 };
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.speed = 0.4;
        this.momentum = 0.2;
        this.mass = 1.0;
    }

    KActorData.prototype.cloneInput = function(p_inputJoy)
    {
        this.inputJoy = { 
            lfx: p_inputJoy.lfx, 
            lfy: p_inputJoy.lfy, 
            lsx: p_inputJoy.lsx, 
            lsy: p_inputJoy.lsy,
            rfx: p_inputJoy.rfx, 
            rfy: p_inputJoy.rfy, 
            rsx: p_inputJoy.rsx, 
            rsy: p_inputJoy.rsy, 
            p:   p_inputJoy.p, 
            s:   p_inputJoy.s };
    }

    KActorData.prototype.clone = function(p_other)
    {
        this.userID = p_other.userID;
        this.actorID = p_other.actorID;
        this.actorname = p_other.actorname;
        this.cloneInput(p_other.inputJoy);
        this.position = { x: p_other.position.x, y: p_other.position.y };
        this.velocity = { x: p_other.velocity.x, y: p_other.velocity.y };
        this.lastVelocity = { x: p_other.lastVelocity.x, y: p_other.lastVelocity.y };
        this.speed = p_other.speed;
        this.momentum = p_other.momentum;
        this.mass = p_other.mass;
    }

    return KActorData;  
})();

