function getTimes(){
    var times=[];
    var s="小时";
    for(var i=1;i<=24;i++){
        var t=i+s;
        var obj = {};
        obj.time=i;
        obj.timeStr=t;
        times.push(obj);
    }
    return times;
}

function getKms(){
    var kms=[];
    var s="公里";
    for(var i=5;i<=16;i++){
        var t=i*10+s;
        var obj = {};
        obj.km=i*10;
        obj.kmStr=t;
        kms.push(obj);
    }
    return kms;
}

module.exports.getTimes = getTimes
exports.getKms = getKms