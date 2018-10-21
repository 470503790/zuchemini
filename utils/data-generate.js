//日期与星期
function getDateAndWeek(date) {
    var d_w_list = [];

    for (var i = 0; i < 60; i++) {

        var newDate = addDate(date);
        var date = getDate(newDate);
        var week = getWeek(newDate);
        var obj = {};
        var d_w = date + " " + week;
        obj.DateStr = d_w;
        obj.Date = date;
        obj.Week = week;
        obj.FullDate = newDate;
        d_w_list.push(obj);
        date = newDate;
    }
    return d_w_list;
}
//获取日期
function getDate(date) {
    var date = new Date(date);
    //var year=myDate.getFullYear(); //获取完整的年份(4位,1970)
    var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var day = date.getDate(); //获取当前日(1-31)
    return month + "月" + getFormatDate(day) + "日";
}
//获取星期
function getWeek(date) {
    var date = new Date(date);
    var w = date.getDay();
    if (w == 0) {
        return "星期日";
    } else if (w == 1) {
        return "星期一";
    } else if (w == 2) {
        return "星期二";
    } else if (w == 3) {
        return "星期三";
    } else if (w == 4) {
        return "星期四";
    } else if (w == 5) {
        return "星期五";
    } else if (w == 6) {
        return "星期六";
    }
}
//日期+1天
function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}
// 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}

//生成时间：9:30-22:00
function getTimes() {
    var hours=9;
    var minutes="30";
    var times=[];
    for(var i=0;i<22;i++){
        var time=combination(hours,minutes);
        times.push(time);
        if(i==0 || minutes=="30"){
            hours=addHours(hours);
        }
        minutes=addMinutes(minutes);
        
        
    }
    return times;
}
//组合成9:00
function combination(hours,minutes){
    
    return hours+":"+minutes;
}
//小时加1
function addHours(index){
    return ++index;
}
//分钟处理
function addMinutes(index){
    if(index=="00"){
        return "30";
    }else{
        return "00";
    }
}

module.exports.getDateAndWeek = getDateAndWeek
exports.getTimes = getTimes