//require sector
var KWorldCli = (function () 
{ 
	function KWorldCli(seed)
	{
		this.seed = seed*1000000;
        this.tileUnit = 10;
        this.sectorRadius = 16; //16 units
        this.sectorUnit = 32; //32 units
        this.worldRadius = 5; //5 sectors
        this.sectors = [];
        for(var i = -this.worldRadius; i <= this.worldRadius; ++i)
        {
            var sectorRow = [];
            for(var j = -this.worldRadius; j <= this.worldRadius; ++j)
            {
                sectorRow.push(new KSectorCli(i,j));
            }
            this.sectors.push(sectorRow);
        }
  	}

  	KWorldCli.prototype.getSectorSecPos = function(x,y)
    {
        var xindex = x+this.worldRadius;
        var yindex = y+this.worldRadius;
        return this.sectors[xindex][yindex];
    }

    KWorldCli.prototype.getSectorRealPos = function(x,y)
    {
        return this.getSectorSecPos( 
            Math.round((x/this.tileUnit)/this.sectorUnit), 
            Math.round((y/this.tileUnit)/this.sectorUnit));
    }

	KWorldCli.prototype.checkSector = function(sector)
	{
		if( !sector.isPopulated )
		{
			game.requestSector(sector);
		}
	}

	KWorldCli.prototype.checkSectorPos = function(pos)
	{
		this.checkSector(this.getSectorRealPos(pos.x,pos.y));
	}

	KWorldCli.prototype.setCameraBounds = function(minX, minY, maxX, maxY)
	{
		this.checkSector(this.getSectorRealPos(minX,minY));
		this.checkSector(this.getSectorRealPos(maxX,minY));
		this.checkSector(this.getSectorRealPos(maxX,maxY));
		this.checkSector(this.getSectorRealPos(minX,maxY));
	}



	
	return KWorldCli;  
})();