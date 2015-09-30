define(["client/KActorCli"], 
	function (KActorCli) 
{ 
    var KSectorCli = function(secX, secY)
	{
		this.secX = secX;
        this.secY = secY;
        this.seed = -1;
        this.sectorUnit = 32;
        this.sectorRadius = 16;
        this.tileUnit = 10;
		this.elementList = [];
		this.groundList = [];
		this.isRequested = false;
		this.isPopulated = false;
  	}

  	KSectorCli.prototype.addData = function(seed, groundData)
  	{
  		this.seed = seed;
  		this.groundList = [];
  		for(var row=0; row<this.sectorUnit; ++row)
        {
            var line = groundData[row];
            this.groundList.push(line);
        }
  	}

	KSectorCli.prototype.populate = function()
	{
		for(var row = 0; row < this.sectorUnit; ++row)
		{
			var line = this.groundList[row];
			for(var column = 0; column < this.sectorUnit; ++column)
			{
				this.addElement(column, row, line[column]);
			}
		}
		console.log('populated'+this.secX+','+this.secY);
		this.isPopulated = true;
	}

	KSectorCli.prototype.getPosFromRelTile = function(relTileX, relTileY)
    {
    	//0 should be -16, should be -160
        var posX = (this.secX*this.sectorUnit + relTileX - this.sectorRadius)*this.tileUnit;
        var posY = (this.secY*this.sectorUnit + relTileY - this.sectorRadius)*this.tileUnit;
        return {x:posX, y:posY};
    }

	KSectorCli.prototype.addElement = function(relativeX, relativeY, contents)
	{
		if( contents == 'X' )
		{
			var realPos = this.getPosFromRelTile(relativeX, relativeY);
			var wall = BABYLON.Mesh.CreateBox("wall", this.tileUnit, game.scene);
			wall.material = game.wallMat;
			wall.position = new BABYLON.Vector3(realPos.x, 0, realPos.y);
			this.elementList.push(wall);
		}
		if( contents == 'B' )
		{
			var realPos = this.getPosFromRelTile(relativeX, relativeY);
			var brick = BABYLON.Mesh.CreateBox("brick", this.tileUnit, game.scene);
			brick.material = game.brickMat;
			brick.position = new BABYLON.Vector3(realPos.x, 0, realPos.y);
			this.elementList.push(brick);
		}
	}
	return KSectorCli;  
});