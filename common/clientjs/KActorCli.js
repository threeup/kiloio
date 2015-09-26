define(["commonjs/KActorData","commonjs/KInputData"], 
    function (KActorData,KInputData) 
{ 
    var KActorCli = function()
    { 
        this.actorData = new KActorData();
        this.inputData = new KInputData();
        this.torso = null;
        this.hips = null;
        this.head = null;
        this.larm = null;
        this.rarm = null;
        this.lthi = null;
        this.rthi = null;
        this.lleg = null;
        this.rleg = null;
        this.hand = null;
        this.armlight = null;
    };


    KActorCli.prototype.addModel = function()
    {
        
    var shoulders = g_unit * 0.9;
    var waist = g_unit * 0.5;
    
    this.torsobone = BABYLON.Mesh.CreateSphere("torsobone", 2, 2, game.scene);
    this.torsobone.position.y = g_unit * 1.15; 
    
    this.torso = BABYLON.Mesh.CreateCylinder("torso", g_unit * 0.6, shoulders, waist, 4, 1, game.scene, true);
    this.torso.material = game.robotBlueMat;
    this.torso.scaling.x = 0.5;
    this.torso.parent = this.torsobone;
    
    
    this.hipsbone = BABYLON.Mesh.CreateSphere("hipsbone", 2, 2, game.scene);
    this.hipsbone.position.y = g_unit * 0.85; 
    
    this.hips = BABYLON.Mesh.CreateBox("hips", g_unit * 0.55, game.scene, true);
    this.hips.material = game.robotBlueMat;
    this.hips.scaling.y = 0.4;
    this.hips.scaling.x = 0.55;
    this.hips.parent = this.hipsbone;
    
    this.head = BABYLON.Mesh.CreateBox("head", 3, game.scene, true);
    this.head.material = game.robotRedMat;
    this.head.position.y = g_unit * 0.4;
    this.head.parent = this.torsobone;
    
    
    this.lthi = BABYLON.Mesh.CreateBox("lthi", g_unit * 0.5, game.scene);
    this.lthi.material = game.robotBlueMat;
    this.lthi.scaling.x = 0.4;
    this.lthi.scaling.y = 0.8;
    this.lthi.scaling.z = 0.4;
    this.lthi.position.x = g_unit * 0.1;
    this.lthi.position.z = g_unit * -0.25;
    this.lthi.position.y = g_unit * -0.25;
    this.lthi.rotation.x = Math.PI / 10;
    this.lthi.rotation.z = Math.PI / 6;
    this.lthi.parent = this.hipsbone;
    
    this.rthi = BABYLON.Mesh.CreateBox("rthi", g_unit * 0.5, game.scene);
    this.rthi.material = game.robotBlueMat;
    this.rthi.scaling.x = 0.35;
    this.rthi.scaling.y = 0.8;
    this.rthi.scaling.z = 0.35;
    this.rthi.position.x = g_unit * 0.1;
    this.rthi.position.z = g_unit * 0.25;
    this.rthi.position.y = g_unit * -0.25;
    this.rthi.rotation.x = -Math.PI / 10;
    this.rthi.rotation.z = Math.PI / 6;
    this.rthi.parent = this.hipsbone;
    
    this.lleg = BABYLON.Mesh.CreateBox("lleg", g_unit * 0.5, game.scene);
    this.lleg.material = game.robotBlueMat;
    this.lleg.scaling.x = 0.55;
    this.lleg.scaling.y = 1.0;
    this.lleg.scaling.z = 0.55;
    this.lleg.position.x = g_unit * 0.1;
    this.lleg.position.z = g_unit * -0.25;
    this.lleg.position.y = g_unit * -0.5;
    this.lleg.rotation.z = -Math.PI / 6;
    this.lleg.parent = this.hipsbone;
    
    this.rleg = BABYLON.Mesh.CreateBox("rleg", g_unit * 0.5, game.scene);
    this.rleg.material = game.robotBlueMat;
    this.rleg.scaling.x = 0.55;
    this.rleg.scaling.y = 1.0;
    this.rleg.scaling.z = 0.55;
    this.rleg.position.x = g_unit * 0.1;
    this.rleg.position.z = g_unit * 0.25;
    this.rleg.position.y = g_unit * -0.5;
    this.rleg.rotation.z = -Math.PI / 6;
    this.rleg.parent = this.hipsbone;
    
    this.larm = BABYLON.Mesh.CreateBox("larm", g_unit * 0.5, game.scene);
    this.larm.material = game.robotBlueMat;
    this.larm.scaling.z = 0.4;
    this.larm.scaling.y = 0.4;
    this.larm.scaling.x = 1.3;
    this.larm.position.z = -g_unit * 0.35;
    this.larm.position.y = g_unit * 0.15;
    this.larm.position.x = g_unit * 0.3;
    this.larm.parent = this.torsobone;
    
    this.rarm = BABYLON.Mesh.CreateBox("rarm", g_unit * 0.5, game.scene);
    this.rarm.material = game.robotBlueMat;
    this.rarm.scaling.z = 0.4;
    this.rarm.scaling.y = 0.4;
    this.rarm.scaling.x = 1.3;
    this.rarm.position.z = g_unit * 0.35;
    this.rarm.position.y = g_unit * 0.15;
    this.rarm.position.x = g_unit * 0.3;
    this.rarm.parent = this.torsobone;

    this.hand = new BABYLON.Mesh.CreateSphere("hand", 2, 2, game.scene);
    this.hand.position.z = g_unit * 0.35;
    this.hand.position.y = g_unit * 0.15;
    this.hand.position.x = g_unit * 0.6;
    this.hand.parent = this.torsobone;
    
    this.armlight = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(2, 0, 0), game.scene);
    this.armlight.diffuse = new BABYLON.Color3(1, 0, 0);
    this.armlight.specular = new BABYLON.Color3(1, 1, 1);
    this.armlight.parent = this.hand;
    this.armlight.range = 20;

    }

    KActorCli.prototype.renderTick = function()
    {
        var yawTorso = Math.atan2(-this.inputData.rfy, this.inputData.rfx);
        var yawHips = Math.atan2(-this.inputData.lfy, this.inputData.lfx);
        this.torsobone.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yawTorso, 0, 0);
        this.hipsbone.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yawHips, 0, 0);
    }

    KActorCli.prototype.rcvActorTick = function(pos, vel)
    {
        this.actorData.position.x = pos.x;
        this.actorData.position.y = pos.y;
        this.actorData.velocity.x = vel.x;
        this.actorData.velocity.y = vel.y;

        this.torsobone.position.x = Math.round(this.actorData.position.x);
        this.torsobone.position.z = Math.round(this.actorData.position.y);
        this.hipsbone.position.x = Math.round(this.actorData.position.x);
        this.hipsbone.position.z = Math.round(this.actorData.position.y);
    }
    return KActorCli;  
});



