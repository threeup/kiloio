define(function () 
{ 
    var validNick = function(nickname) {
        var regex = /^\w*$/;
        return regex.exec(nickname) !== null;
    };


    var findIndex = function(arr, id) {
        var len = arr.length;

        while (len--) {
            if (arr[len].id === id) {
                return len;
            }
        }

        return -1;
    };

    var randomColor = function() {
        var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var r = (parseInt(c[1], 16) - 32) > 0 ? (parseInt(c[1], 16) - 32) : 0;
        var g = (parseInt(c[2], 16) - 32) > 0 ? (parseInt(c[2], 16) - 32) : 0;
        var b = (parseInt(c[3], 16) - 32) > 0 ? (parseInt(c[3], 16) - 32) : 0;

        return {
            fill: color,
            border: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        };
    };

    var setCharAt = function(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    return {
        validNick:validNick, 
        findIndex:findIndex, 
        randomColor:randomColor, 
        setCharAt:setCharAt
    }
});