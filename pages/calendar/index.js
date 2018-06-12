//index.js
//获取应用实例
var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
Page({
  //事件处理函数
  calendarSign: function() {
   calendarSignData[date]=date;
    console.log(calendarSignData);
    calendarSignDay=calendarSignDay+1;
   wx.setStorageSync("calendarSignData",calendarSignData);
   wx.setStorageSync("calendarSignDay",calendarSignDay);
 
   wx.showToast({
  title: '签到成功',
  icon: 'success',
  duration: 2000
})
  this.setData({
      
        calendarSignData:calendarSignData,
        calendarSignDay:calendarSignDay
      })
  },
  onLoad: function () {
    var mydate=new Date();//当前日期
    var year=mydate.getFullYear();//当前年份
    var month=mydate.getMonth()+1;//当前月份
    date=mydate.getDate();//当日
    console.log("date=》"+date)
    var day=mydate.getDay();//当前星期，0表示星期日
    console.log(day)
    var nbsp;
    if((date-day)<=0){
      nbsp=day-date+1;
      console.log(111111)
    }else{
      console.log(33333333)
      nbsp=7-((date-day)%7)+1;
    }
    console.log("nbsp=》"+nbsp);
    var monthDaySize;
    if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
      monthDaySize=31;
    }else if(month==4||month==6||month==9||month==11){
      monthDaySize=30;
    }else if(month==2){
       // 计算是否是闰年,如果是二月份则是29天
      if((year-2000)%4==0){
        monthDaySize=29;
      }else{
        monthDaySize=28;
      }
    };
    // 判断是否签到过
    if(wx.getStorageSync("calendarSignData")==null||wx.getStorageSync("calendarSignData")==''){
      wx.setStorageSync("calendarSignData",new Array(monthDaySize));
    };
     if(wx.getStorageSync("calendarSignDay")==null||wx.getStorageSync("calendarSignDay")==''){
      wx.setStorageSync("calendarSignDay",0);
    }
     calendarSignData=wx.getStorageSync("calendarSignData")
      calendarSignDay=wx.getStorageSync("calendarSignDay")
    console.log(calendarSignData);
    console.log(calendarSignDay)
    this.setData({
        year:year,
        month:month,
        nbsp:nbsp,
        monthDaySize:monthDaySize,
        date:date,
        calendarSignData:calendarSignData,
        calendarSignDay:calendarSignDay,
        week:day
      })
  }
})
