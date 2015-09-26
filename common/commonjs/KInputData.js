define(function () 
{ 
    var KInputData = function()
    { 
        this.lfx = 0;
        this.lfy = 1;
        this.lsx = 0;
        this.lsy = 0;
        this.rfx = 0;
        this.rfy = 1;
        this.rsx = 0;
        this.rsy = 0;
        this.p   = 0;
        this.s   = 0;
    }

    KInputData.prototype.clone = function(p_inputData)
    {
        this.lfx = p_inputData.lfx;
        this.lfy = p_inputData.lfy;
        this.lsx = p_inputData.lsx;
        this.lsy = p_inputData.lsy;
        this.rfx = p_inputData.rfx;
        this.rfy = p_inputData.rfy;
        this.rsx = p_inputData.rsx;
        this.rsy = p_inputData.rsy;
        this.p   = p_inputData.p; 
        this.s   = p_inputData.s;
    }


    return KInputData;  
});

