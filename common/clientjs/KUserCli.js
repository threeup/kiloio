define(["common/KUserData", "client/KActorCli"], 
  function (KUserData, KActorCli) 
{
  var KUserCli = function()
  { 
    this.userData = new KUserData();
    this.actors = [];
    this.mainActor = null;
  }

  KUserCli.prototype.clone = function(p_other) 
  { 
    this.userData.clone(p_other.userData);
  }


  KUserCli.prototype.selectActor = function(actor)
  {
    this.mainActor = actor;
    this.userData.mainActorID = actor.actorID;
  }

  KUserCli.prototype.removeActor = function(p_actor)
  {
    var removeID = p_actor.actorData.actorID;
    for(var i = this.actors.length-1; i >= 0; --i)
    {
        var actor = this.actors[i];
        if( actor.actorData.actorID === removeID)
        {
            this.actors.splice(i, 1);
            actor.dispose();
            break;
        }
    }
  }

  KUserCli.prototype.rcvUserTick = function(hue)
  {
    this.userData.hue = hue;
  }
  KUserCli.prototype.rcvActorTick = function(pos, vel)
  {
  this.actors.forEach( function(actor) 
  {
    actor.rcvActorTick(pos, vel);
  });
  }

  KUserCli.prototype.clientTransmit = function()
  {
    if( this.mainActor !== null)
    {
      
      socket.emit('0', this.mainActor.inputData);
    }
  }
  return KUserCli;
});
