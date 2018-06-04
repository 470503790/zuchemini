//index.js
//获取应用实例
const app = getApp()
//引入扩展文件
const { Tab, extend } = require('../../dist/index');
const Zan = require('../../dist/index');
Page(extend({}, Tab, Zan.Field,{
  data: {
    tab: {//选项卡
      list: [{
        id: '1',
        title: '汕尾店'
      }, {
        id: '2',
        title: '海丰店'
      }],
      selectedId: '1',
      scroll: false,
      height: 45
    },
    pickUpStore:1,
    returnStore:1,
    // 取车
    pickerViewConfig1: {
      show: false,
      value: [0, 0],
      year: [],
      time: []
    },
    //还车
    pickerViewConfig2: {
      show: false,
      value: [0, 0],
      year: [],
      time: []
    },
    //天数
    day:1,
    //预约默认最少多少天
    defaultDay:2
  },
  
  onLoad: function () {
    wx.showLoading({
      title: "加载中..."
    })
    this.loadData();
    wx.hideLoading();
  },
  loadData:function(){
    var myDate = new Date();
    //取车日期，(当前日期+1)+60天

    var dates = this.getDateAndWeek(myDate);
    var times = this.getTimes();

    this.setData({
      "pickerViewConfig1.year": dates,
      "pickerViewConfig1.time": times,
      "pickerViewConfig2.year": dates,
      "pickerViewConfig2.time": times,
      'pickerViewConfig2.value': [this.data.defaultDay, 0],
      day: this.data.defaultDay
    });
    //取车时间 缓存
    wx.setStorageSync("getDate", dates[0].FullDate);
    //还车日期，取车日期+60天
  },
  onShow: function () {
    
  },
  //日期与星期
  getDateAndWeek:function(date){
    var d_w_list=[];
    
    for(var i=0;i<60;i++){
      
      var newDate=this.addDate(date);
      var date = this.getDate(newDate);
      var week = this.getWeek(newDate);
      var obj={};
      var d_w = date + " " + week;
      obj.DateStr=d_w;
      obj.Date=date;
      obj.Week=week;
      obj.FullDate=newDate;
      d_w_list.push(obj);
      date = newDate;
    }
    return d_w_list;
  },
  //获取日期
  getDate:function(date){
    var date = new Date(date);
    //var year=myDate.getFullYear(); //获取完整的年份(4位,1970)
    var month = date.getMonth()+1; //获取当前月份(0-11,0代表1月)
    var day = date.getDate(); //获取当前日(1-31)
    return month + "月" + this.getFormatDate(day)+"日";
  },
  //获取星期
  getWeek:function(date){
    var date = new Date(date);
    var w=date.getDay(); 
    if(w==0){
      return "星期日";
    }else if(w==1){
      return "星期一";
    }else if(w==2){
      return "星期二";
    }else if(w==3){
      return "星期三";
    }else if(w==4){
      return "星期四";
    }else if(w==5){
      return "星期五";
    }else if(w==6){
      return "星期六";
    }
  },
  //日期+1天
  addDate:function (date, days) {
    if(days == undefined || days == '') {
      days = 1;
    }
            var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
  },
  // 日期月份/天的显示，如果是1位数，则在前面加上'0'
  getFormatDate:function (arg) {
    if(arg == undefined || arg == '') {
      return '';
    }

            var re = arg + '';
    if(re.length < 2) {
      re = '0' + re;
    }

            return re;
  },
  //获取固定时间列表
  getTimes:function(){
    var time = new Date("2018-5-20 9:00:00");
    var times=[];
    var b=30;
    for(var i=0;i<22;i++){
      time.setMinutes(time.getMinutes() + b);
      var hour=time.getHours();
      var minutes = time.getMinutes();
      minutes=minutes==0?"00":minutes+"";
      var t=hour + ":" + minutes;
      console.log(t);
      times.push(t);
    }
    return times;
  },
  //tab事件
  handleZanTabChange(e) {
    console.log(e);
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    
    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      "pickUpStore" : selectedId,
      "returnStore":selectedId
    });
    
    app.aldstat.sendEvent('tab',{
      'selectedId': selectedId
    });
  },
  //左边时间选择
  handleDateFieldClick:function(e){

    this.setData({
      'pickerViewConfig1.show': true
    });
    app.aldstat.sendEvent('取车时间点击');
  },
  //把值存到缓存
  handlePopupDateChange(e) {
    console.log(e);
    var date=this.data.pickerViewConfig1.year[e.detail.value[0]].FullDate
    console.log(date);
    //取车时间 缓存
    wx.setStorageSync("getDate",date)
    //还车时间列表重新生成
    var dates=this.getDateAndWeek(date);
    this.setData({
      'pickerViewConfig1.value': e.detail.value,
      'pickerViewConfig2.year':dates,
      'pickerViewConfig2.value': [this.data.defaultDay-1,0],
      day:this.data.defaultDay
    });
  },
  hideDatePopup() {
    this.setData({
      'pickerViewConfig1.show': false
    });
  },
  //取车时间取消
  cancel1:function(){
    this.hideDatePopup();
  },
  //取车时间确定
  ok1:function(){
    this.hideDatePopup();
    this.handleDateFieldClick2();
  },
  //右边时间选择
  handleDateFieldClick2:function(e){
    this.setData({
      'pickerViewConfig2.show': true
    });
    app.aldstat.sendEvent('还车时间点击');
  },
  handlePopupDateChange2(e) {
    console.log(e.detail);
    var date2=this.data.pickerViewConfig2.year[e.detail.value[0]].FullDate
    console.log(date2);
    //取车时间
    var date1=wx.getStorageSync("getDate");
    var day=(new Date(date2)).getTime()-(new Date(date1)).getTime();
    day=parseInt(day / (1000 * 60 * 60 * 24));
    console.log("day:"+day);
    this.setData({
      'pickerViewConfig2.value': e.detail.value,
      "day":day
    });
  },
  hideDatePopup2() {
    this.setData({
      'pickerViewConfig2.show': false
    });
  },
  //还车时间取消
  cancel2:function(){
    this.hideDatePopup2();
  },
  //还车时间确定
  ok2:function(){
    this.hideDatePopup2();
  },
  click_go:function(){
    var that=this;
    //取车对象
    var pickerDateObj = that.data.pickerViewConfig1.year[that.data.pickerViewConfig1.value[0]];
    var pickerTimeObj=that.data.pickerViewConfig1.time[that.data.pickerViewConfig1.value[1]];
    
    //还车对象
    var returDateObj = that.data.pickerViewConfig2.year[that.data.pickerViewConfig2.value[0]];
    var returTimeObj = that.data.pickerViewConfig2.time[that.data.pickerViewConfig2.value[1]];

    app.globalData.pickerDateObj = pickerDateObj;
    app.globalData.pickerTimeObj = pickerTimeObj;
    app.globalData.returnDateObj = returDateObj;
    app.globalData.returnTimeObj = returTimeObj;
    app.globalData.day=that.data.day;
    app.globalData.pickUpStore = that.data.pickUpStore;
    app.globalData.returnStore = that.data.returnStore;
    var pickerDate = pickerDateObj.FullDate;
    var returnDate = returDateObj.FullDate;

    console.log("取车对象");
    console.log(pickerDateObj);
    console.log(pickerTimeObj);
    console.log("还车对象");
    console.log(returDateObj);
    console.log(returTimeObj);
    console.log("取车日期=》"+pickerDate);
    console.log("还车日期=》" + returnDate);
    console.log("天数=》" + that.data.day);
    app.aldstat.sendEvent('去选车按钮');
    wx.navigateTo({
      url: '../car-list/car-list?startDate=' + pickerDate + '&endDate=' + returnDate + '&day=' + that.data.day,
    })
  },
  //打电话
  call:function(){
    app.aldstat.sendEvent('打电话');
    wx.makePhoneCall({
      phoneNumber: '13692950061' //仅为示例，并非真实的电话号码
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
}))
