var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
	
    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 2, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
	
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("cam", 3, 3, 3, sphere, scene);
	
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
	camera.setPosition(new BABYLON.Vector3(0, 250, -40));
	
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

	var g_unit = 10;
	var game = {  };
	game.defaultMat = new BABYLON.StandardMaterial("def", scene);
	game.robotBlueMat = new BABYLON.StandardMaterial("robotblue", scene);
	game.robotBlueMat.diffuseColor = BABYLON.Color3.Blue();
	game.robotRedMat = new BABYLON.StandardMaterial("robotred", scene);
	game.robotRedMat.diffuseColor = BABYLON.Color3.Red();
	game.scene = scene;

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

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);

    return scene;

};