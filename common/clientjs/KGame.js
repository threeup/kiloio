
define(["client/KWorldCli", "client/KSectorCli", "client/KUserCli", "client/KActorCli", "common/KUtil"], 
  function (KWorldCli, KSectorCli, KUserCli, KActorCli, KUtil) 
{ 
  var KGame = function(p_gamename)
  {
    this.gamename = p_gamename;
    this.world = null;
    this.localuserID = 0;
    this.localUser = null;
    this.users = [];
    this.actors = [];
    this.canvas = null;
    this.engine = null;
    this.scene = null;
    this.camera = null;

    this.groundMat = null;
    this.defaultMat = null;

    this.actorCameraLock = true;
    this.cameraAnchor = null;
    this.localCursor = null;
    this.neSphere = null;
    this.swSphere = null;
  }
  


  KGame.prototype.createCore = function()
  { 
    this.world = new KWorldCli(0);


    this.canvas = document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    this.scene.clearColor = new BABYLON.Color3(0, 0, 0);

    this.groundMat = new BABYLON.StandardMaterial("ground", this.scene);
    this.groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.2);
    this.groundMat.specularColor = new BABYLON.Color3(0, 0.1, 0);

    this.defaultMat = new BABYLON.StandardMaterial("def", this.scene);
    this.defaultMat.specularColor = BABYLON.Color3.Blue();

    this.wallMat = new BABYLON.StandardMaterial("wallMat", this.scene);
    this.wallMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.wallMat.specularColor = new BABYLON.Color3(0.4, 0.6, 0.4);

    this.brickMat = new BABYLON.StandardMaterial("brickMat", this.scene);
    this.brickMat.diffuseColor = new BABYLON.Color3(0.7, 0.3, 0.2);
    this.brickMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0);

    this.robotBlueMat = new BABYLON.StandardMaterial("robotblue", this.scene);
    this.robotBlueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 1);
    this.robotBlueMat.specularColor = new BABYLON.Color3(0.4, 0.6, 1);

    this.robotRedMat = new BABYLON.StandardMaterial("robotred", this.scene);
    this.robotRedMat.diffuseColor = new BABYLON.Color3(1, 0.4, 0.4);
    this.robotRedMat.specularColor = new BABYLON.Color3(1, 0.6, 0.4);



    this.redMat = new BABYLON.StandardMaterial("red", this.scene);
    this.redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.redMat.emissiveColor = BABYLON.Color3.Red();
      
  }

  KGame.prototype.createCamera = function()
  {
    this.camera = new BABYLON.KCamera("Camera", 1,1,1, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.setPosition(new BABYLON.Vector3(0, 250, -40));
    this.camera.wheelPrecision = 6.0;
    this.camera.attachControl(this.canvas, true);
    this.scene.activeCamera = this.camera;

    // scene's actions
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);      
  }




  KGame.prototype.createWorld = function()
  {
      var light1 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), this.scene);  
      light1.diffuse = BABYLON.Color3.White();
      light1.state = "on";

      // Ground
      var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.scene, true);
      ground.material = this.groundMat;      

      //var floor = BABYLON.Mesh.CreatePlane("floor", 30, this.scene);
      //floor.material = this.groundMat;      

      this.cameraAnchor = BABYLON.Mesh.CreateTorus("cameraAnchor", 10, 3, 8, this.scene, true);
      this.cameraAnchor.material = this.defaultMat;
      this.cameraAnchor.position.y = 10;

      this.localCursor = BABYLON.Mesh.CreateTorus("localCursor", 2, 1, 8, this.scene, true);
      this.localCursor.material = this.defaultMat;
      this.localCursor.position.y = 5;

      this.neSphere = BABYLON.Mesh.CreateSphere("neSphere", 10, 8, this.scene, true, 1);
      this.neSphere.material = this.redMat;

      this.swSphere = BABYLON.Mesh.CreateSphere("swSphere", 10, 8, this.scene, true, 1);
      this.swSphere.material = this.defaultMat;

      this.camera.setSoftTarget(this.cameraAnchor);

      var pick = function () {
        var pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY, null, true, game.camera);
        if (pickResult.hit) {
            game.localCursor.position.x = pickResult.pickedPoint.x;
            game.localCursor.position.z = pickResult.pickedPoint.z;
        }
      }
      
      setInterval(pick, 1000 / 20);

      this.scene.onPointerDown = function (evt, pickResult) {

          if( evt.button == 2 )
          {
            g_joy.secondary = true;
            if (pickResult.hit) {
                game.actorCameraLock = false;
                game.cameraAnchor.position.x = pickResult.pickedPoint.x;
                //game.cameraAnchor.position.y = pickResult.pickedPoint.y;
                game.cameraAnchor.position.z = pickResult.pickedPoint.z;
            }
          }
          else
          {
            g_joy.primary = true;
          }
      };      

      this.scene.onPointerUp = function (evt, pickResult) {
        if( evt.button == 2 )
        {
          g_joy.secondary = false;
        }
        else
        {
          g_joy.primary = false;
        }
      }
  }

  KGame.prototype.createTest = function()
  {
      
  
      // Boxes
      var redBox = BABYLON.Mesh.CreateBox("red", 20, this.scene);
      
      redBox.material = this.redMat;
      redBox.position.x -= 100;
  
      var greenBox = BABYLON.Mesh.CreateBox("green", 20, this.scene);
      var greenMat = new BABYLON.StandardMaterial("ground", this.scene);
      greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      greenMat.emissiveColor = BABYLON.Color3.Green();
      greenBox.material = greenMat;
      greenBox.position.z -= 100;
  
      var blueBox = BABYLON.Mesh.CreateBox("blue", 20, this.scene);
      var blueMat = new BABYLON.StandardMaterial("ground", this.scene);
      blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      blueMat.emissiveColor = BABYLON.Color3.Blue();
      blueBox.material = blueMat;
      blueBox.position.x += 100;
  
      // Sphere
      var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 20, this.scene);
      var sphereMat = new BABYLON.StandardMaterial("ground", this.scene);
      sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      sphereMat.emissiveColor = BABYLON.Color3.Purple();
      sphere.material = sphereMat;
      sphere.position.z += 100;
  
      // Rotating donut
      var donut = BABYLON.Mesh.CreateTorus("donut", 20, 8, 16, this.scene);
  

      // Animations
      var alpha = 0;
      this.scene.registerBeforeRender(function () {
          donut.position.x = 100 * Math.cos(alpha);
          donut.position.y = 5;
          donut.position.z = 100 * Math.sin(alpha);
          alpha += 0.01;
      });
  }

  KGame.prototype.setupGameSocket = function(socket) 
  {  
    
    socket.on('s-localPopulate', function (userData) {
        game.localuserID = userData.userID;
        userData.username = localUserName;
        socket.emit('c-userLaunch', userData);
      });
    socket.on('s-addUserData', function (userData) {
        game.rcvAddUser(userData);
        game.world.checkSectorPos(userData.homePosition);
      });
    socket.on('s-addSectorData', function (sectorData) {
        game.rcvAddSector(sectorData);
      });
    socket.on('s-addActorData', function (actorData) {
        game.rcvAddActor(actorData);
      });
    socket.on('s-remActorData', function (actorData) {
        game.rcvRemActor(actorData);
      });
    socket.on('s-updateUserData', function (userData) {
        var idx = KUtil.findUser(game.users, userData.userID);
        if( idx < 0 )
        {
          //console.log(idx);
          //console.log(userData);
          //console.log(userData.userID);
        }
        else
        {
          game.users[idx].rcvUserTick(userData.hue);
        }
        
      });
    socket.on('s-updateActorData', function (actorData) {
        var idx = KUtil.findActor(game.actors, actorData.actorID);
        if( idx < 0 )
        {
          //console.log(idx);
          //console.log(actorData);
          //console.log(actorData.actorID);
        }
        else
        {
          game.actors[idx].rcvActorTick(actorData.position, actorData.velocity);
        }
      });
    
  }
  KGame.prototype.requestSector = function(p_sector)
  {
    if( !p_sector.isRequested )
    {
      p_sector.isRequested = true;
      socket.emit('c-requestSector', {x:p_sector.secX, y:p_sector.secY});
    }
  }
  KGame.prototype.rcvAddUser = function(p_userData)
  {
    var uidx = KUtil.findUser(this.users, p_userData.userID);
    var user = null;
    if( uidx < 0 )
    {
      user = new KUserCli();
      user.userData.clone(p_userData);
      this.users.push(user);
    }
    else
    {
      user = this.users[uidx];
      user.userData.clone(p_userData);
      this.users[uidx] = user;
    }
    if( user.userData.userID === this.localuserID )
    {
      this.localUser = user;
    }
  }

  KGame.prototype.rcvAddSector = function(p_sectorData)
  {
    var sector = this.world.getSectorSecPos(p_sectorData.secX,p_sectorData.secY);
    sector.addData(p_sectorData.seed, p_sectorData.groundData);
    sector.populate();
  }

  KGame.prototype.rcvAddActor = function(p_actorData)
  {
    var aidx = KUtil.findActor(this.actors, p_actorData.actorID);
    var actor = null;
    if( aidx < 0 )
    {
      actor = new KActorCli();
      actor.actorData.clone(p_actorData);
      actor.addModel(actor.actorData.visual);
      this.actors.push(actor);
    }
    else
    {
      actor = this.actors[aidx];
      actor.actorData.clone(p_actorData);
      this.actors[aidx] = actor;
    }
    
    var uidx = KUtil.findUser(this.users, p_actorData.userID);
    if( uidx < 0 )
    {
      console.log('rcvAddActor missing user');
      console.log(p_actorData.userID);
    }
    else
    {
      this.users[uidx].actors.push(actor);
      if( this.users[uidx].mainActor === null )
      {
        this.users[uidx].selectActor(actor);
      }
    }   
  }

  KGame.prototype.rcvRemActor = function(p_actorData)
  {
    for(var i = this.actors.length-1; i >= 0; --i)
    {
        var actor = this.actors[i];
        if( actor.actorData.actorID === p_actorData.actorID)
        {
            var uidx = KUtil.findUser(this.users, actor.actorData.userID);
            var user = this.users[uidx];
            this.actors.splice(i, 1);
            user.removeActor(actor);
        }
    }
  }

  KGame.prototype.handleKeyUp = function(key)
  {
    if(key === KEY_SPACE) 
    {
      g_joy.primary = 0;
    }
    if(key === KEY_CTRL) 
    {
      g_joy.secondary = 0;
    }
    if(key === KEY_W) 
    {
      g_joy.up = 0;
    }
    if(key === KEY_S) 
    {
      g_joy.down = 0;
    }
    if(key === KEY_D) 
    {
      g_joy.right = 0;
    }
    if(key === KEY_A) 
    {
      g_joy.left = 0;
    }
  }

  KGame.prototype.handleKeyDown = function(key)
  {
    if(key === KEY_P) 
    {
      sendPing();
    }
    if(key === KEY_C) 
    {
      this.centerCamera();
    }
    if(key === KEY_SPACE) 
    {
      g_joy.primary = 1;
    }
    if(key === KEY_CTRL) 
    {
      g_joy.secondary = 1;
    }
    if(key === KEY_W) 
    {
      g_joy.up = 1;
    }
    if(key === KEY_S) 
    {
      g_joy.down = 1;
    }
    if(key === KEY_D) 
    {
      g_joy.right = 1;
    }
    if(key === KEY_A) 
    {
      g_joy.left = 1;
    }
  }

  KGame.prototype.centerCamera = function() 
  {
    game.actorCameraLock = true;
  }

  KGame.prototype.handleLogic = function() 
  {
    if( this.localUser !== null && this.localUser.mainActor !== null )
    {
      var localActorData = this.localUser.mainActor.actorData;
      var localInput = this.localUser.mainActor.inputData;
      
      var lsx = g_joy.right - g_joy.left;
      var lsy = g_joy.up - g_joy.down;
      var lslen = Math.max(0.05, Math.sqrt(lsx*lsx + lsy*lsy));
      if ( lslen > 0.1 )
      {
        localInput.lfx = lsx;
        localInput.lfy = lsy;
      }
      
      localInput.lsx = lsx/lslen;
      localInput.lsy = lsy/lslen;
      localInput.lslen = lslen;

      var rsx = this.localCursor.position.x - localActorData.position.x;
      var rsy = this.localCursor.position.z - localActorData.position.y;
      var rslen = Math.max(0.05, Math.sqrt(rsx*rsx+rsy*rsy));
      if( rslen > 0.1 )
      {
        localInput.rfx = rsx;
        localInput.rfy = rsy;
      }
      localInput.rsx = rsx/rslen;
      localInput.rsy = rsy/rslen;
      localInput.rslen = rslen;


      localInput.p = g_joy.primary;
      localInput.s = g_joy.secondary;

      this.localUser.mainActor.armlight.setEnabled(g_joy.primary);
      
    }
  }

  KGame.prototype.handleTurnFinished = function()
  {
    if( this.localUser !== null )
    {
      this.localUser.clientTransmit();
    }
  }

  KGame.prototype.handleGraphics = function() 
  {
    
    this.swSphere.position.x = this.camera.position.x - 120 + 5;
    this.swSphere.position.y = 4;
    this.swSphere.position.z = this.camera.position.z - 60  + 5;
    this.neSphere.position.x = this.camera.position.x + 120 + 5;
    this.neSphere.position.y = 4;
    this.neSphere.position.z = this.camera.position.z + 190 + 5;
    
    if( this.actorCameraLock && this.localUser !== null && this.localUser.mainActor !== null )
    {
      this.cameraAnchor.position.x = this.localUser.mainActor.actorData.position.x;
      this.cameraAnchor.position.z = this.localUser.mainActor.actorData.position.y;
    }

    this.actors.forEach( function(actor)
    {
      actor.renderTick();
    })

    this.world.setCameraBounds(this.swSphere.position.x, this.swSphere.position.z, this.neSphere.position.x, this.neSphere.position.z);
  }

  return KGame;  
});