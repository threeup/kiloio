
var KSectorSrv = require('./KSectorSrv');

//secx
//tilex
//realx
var KWorld = (function () 
{ 
    function KWorld(seed)
    {
        //max = 4294967295 ?
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
                var sectorSeed = this.seed + i*10000+j*100;
                sectorRow.push(new KSectorSrv(this,i,j,sectorSeed));
            }
            this.sectors.push(sectorRow);
        }
    }

    KWorld.prototype.getRealFromSecPos = function(v)
    {
        return v*this.sectorUnit*this.tileUnit;
    }
    KWorld.prototype.getRealFromTilePos = function(v)
    {
        return v*this.tileUnit;
    }
    KWorld.prototype.getTileFromSecPos = function(v)
    {
        return v*this.sectorUnit;
    }
    KWorld.prototype.getTileFromRealPos = function(v)
    {
        return Math.round(v/this.tileUnit);
    }

    KWorld.prototype.getTile = function(realPos)
    {
        var tileX = this.getTileFromRealPos(realPos.x);
        var tileY = this.getTileFromRealPos(realPos.y);
        return {x:tileX, y:tileY};
    }

    KWorld.prototype.getSectorSecPos = function(x,y)
    {
        var xindex = x+this.worldRadius;
        var yindex = y+this.worldRadius;
        return this.sectors[xindex][yindex];
    }

    KWorld.prototype.getSectorTilePos = function(x,y)
    {
        return this.getSectorSecPos( 
            Math.round(x/this.sectorUnit), 
            Math.round(y/this.sectorUnit));
    }

    KWorld.prototype.getSectorRealPos = function(x,y)
    {
        return this.getSectorSecPos( 
            Math.round((x/this.tileUnit)/this.sectorUnit), 
            Math.round((y/this.tileUnit)/this.sectorUnit));
    }

    KWorld.prototype.getLine = function(seed, row)
    {
        var localSeed = seed & 31; //0b11111 
        var isGrid = row % 2 == 1; //1, 3, ... 29, 31

        var isNorthSouth = row == 0 || row == 1 || row == 31;
        var isEastWest = row > 13 && row < 19;

        var vegetationSeed = (seed >> 6) & 7; //0b111
        var hasTree = vegetationSeed % 5 == 0;
        var hasCave = vegetationSeed % 5 == 1;
        var hasLake = vegetationSeed % 5 == 2;
        var hasBlue = vegetationSeed % 5 == 3;
        var hasPalm = vegetationSeed % 5 == 4;

        var line = "";  
        if( isGrid)
        {
            line = "X X XBX X X X X X X XBX X X X XX";
        }
        else
        {
            line = "X                             XX";  
        }
        if( isNorthSouth )
        {
            line = "XXXXXXXXXXXXXX     XXXXXXXXXXXXX";
        }
        else if( isEastWest )
        {
            line = " "+line.slice(1,29)+"    ";
        }

        /*if( hasTree )
        {
            line = line.slice(0,5)+"TTTT"+line.slice(9,32);
        }
        if( hasCave )
        {
            line = line.slice(0,25)+"CCCC"+line.slice(29,32);
        }
        if( hasLake )
        {
            line = line.slice(0,25)+"LLLL"+line.slice(29,32);
        }
        if( hasBlue )
        {
            line = line.slice(0,25)+"BBBB"+line.slice(29,32);
        }
        if( hasPalm )
        {
            line = line.slice(0,25)+"PPPP"+line.slice(29,32);
        }*/
        return line;

    }
    return KWorld;  
})();
module.exports = KWorld;