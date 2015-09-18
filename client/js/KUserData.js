var KUserData = (function () 
{ 
    function KUserData(p_socketid, p_userID) 
    { 
        this.socketid = p_socketid;
        this.userID = p_userID;
        this.username = "-";
        this.homePosition = { x: 100, y: 100 };
        this.hue = Math.round(Math.random() * 360);

        this.actorIDs = [];
        this.mainActorID = -1;
    }

    KUserData.prototype.clone = function(p_other)
    {
        this.socketid = p_other.socketid;
        this.userID = p_other.userID;
        this.username = p_other.username;
        this.homePosition = p_other.homePosition;
        this.hue = p_other.hue;
        this.actorIDs = p_other.actorIDs.slice(0);
        this.mainActorID = p_other.mainActorID;
    }
    return KUserData;  
})();