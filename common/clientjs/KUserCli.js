define(["commonjs/KUserData", "clientjs/KActorCli"], 
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
