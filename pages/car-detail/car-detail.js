var app = getApp();
var utils = require("../../utils/util.js")
var network = require("../../utils/network.js")
var ext = require('../../pages/index/indexExt.js')
// pages/car-detail/car-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    car: null,
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
    startDate: null,
    endDate: null,
    //天数
    day: 1,
    //预约默认最少多少天
    defaultDay: 2,
    calendar: null,
    //控制弹出层
    showPopup: false,
    setting: null,
    //右侧浮动按钮控制
    class:{
      right_button_2:"right_button_3",
    },
  },
  loadData(id) {
    var that = this;

    //that.carAllInfo(id);
    //that.go();
  },
  loadDateAndWeek: function () {
    var that = this;
    var myDate = new Date();
    //取车日期，(当前日期+1)+60天

    var dates = ext.getDateAndWeek(myDate);
    var times = ext.getTimes();

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
    that.go();
  },
  //左边时间选择
  handleDateFieldClick: function (e) {

    this.setData({
      'pickerViewConfig1.show': true
    });
    //app.aldstat.sendEvent('取车时间点击');
  },
  //把值存到缓存
  handlePopupDateChange(e) {
    console.log(e);
    var date = this.data.pickerViewConfig1.year[e.detail.value[0]].FullDate
    console.log(date);
    //取车时间 缓存
    wx.setStorageSync("getDate", date)
    //还车时间列表重新生成
    var dates = ext.getDateAndWeek(date);
    this.setData({
      'pickerViewConfig1.value': e.detail.value,
      'pickerViewConfig2.year': dates,
      'pickerViewConfig2.value': [this.data.defaultDay - 1, 0],
      day: this.data.defaultDay
    });
  },
  hideDatePopup() {
    this.setData({
      'pickerViewConfig1.show': false
    });
  },
  //取车时间取消
  cancel1: function () {
    this.hideDatePopup();
  },
  //取车时间确定
  ok1: function () {
    this.hideDatePopup();
    this.handleDateFieldClick2();
  },
  //右边时间选择
  handleDateFieldClick2: function (e) {
    this.setData({
      'pickerViewConfig2.show': true
    });
  },
  handlePopupDateChange2(e) {
    console.log(e.detail);
    var date2 = this.data.pickerViewConfig2.year[e.detail.value[0]].FullDate
    console.log(date2);
    //取车时间
    var date1 = wx.getStorageSync("getDate");
    var day = (new Date(date2)).getTime() - (new Date(date1)).getTime();
    day = parseInt(day / (1000 * 60 * 60 * 24));
    console.log("day:" + day);
    this.setData({
      'pickerViewConfig2.value': e.detail.value,
      "day": day
    });
  },
  hideDatePopup2() {
    this.setData({
      'pickerViewConfig2.show': false
    });
  },
  //还车时间取消
  cancel2: function () {
    this.hideDatePopup2();
  },
  //还车时间确定
  ok2: function () {
    this.hideDatePopup2();
    this.go();
  },
  go() {
    var that = this;
    //取车对象
    var pickerDateObj = that.data.pickerViewConfig1.year[that.data.pickerViewConfig1.value[0]];
    var pickerTimeObj = that.data.pickerViewConfig1.time[that.data.pickerViewConfig1.value[1]];

    //还车对象
    var returDateObj = that.data.pickerViewConfig2.year[that.data.pickerViewConfig2.value[0]];
    var returTimeObj = that.data.pickerViewConfig2.time[that.data.pickerViewConfig2.value[1]];

    app.globalData.day = that.data.day;
    //以后用这个存取值
    app.globalData.pickUpCar = {
      Date: pickerDateObj,
      Time: pickerTimeObj,
      StoreId: that.data.pickUpStore
    };
    app.globalData.returnCar = {
      Date: returDateObj,
      Time: returTimeObj,
      StoreId: that.data.returnStore
    }



    console.log("取车对象=>", app.globalData.pickUpCar);
    console.log("天数=>", app.globalData.day);
    console.log("还车对象=>", app.globalData.returnCar);
    //请求
    that.carAllInfo(that.data.id, app.globalData.pickUpCar.Date.FullDate, app.globalData.returnCar.Date.FullDate)
  },
  carAllInfo(id, startDate, endDate) {
    var that = this;
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarAllInfoToMiniAsync";
    var params = {
      id: id,
      startDate: startDate,
      endDate: endDate
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      console.log(res.result);
      that.setData({
        car: res.result,
        calendar: res.result.calendar,
        startDate: res.result.startDate,
        endDate: res.result.endDate
      })
    })
  },
  tobuy(e) {
    var that = this;
    that.setData({
      showPopup: true
    })
  },
  hideCarInfo: function () {
    var that = this;
    that.setData({
      showPopup: false
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    app.globalData.pickUpCar.StoreId = e.detail.value;
    app.globalData.returnCar.StoreId = e.detail.value;
  },
  gobuy(e) {
    var that = this;
    console.log(e);
    if (app.globalData.pickUpCar.StoreId == null) {
      wx.showToast({
        title: "请选择门店",
        icon: 'success',
        duration: 1000
      });
      return;
    }
    //判断是否登陆
    var user = wx.getStorageSync('userInfo');
    if (user == "") {
      var url = "/pages/car-detail/car-detail----id---" + that.data.car.id;
      var jumpType = "redirectTo";
      console.log("url", url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
      });
    } else {

      //点击预约前，检查是否能下单
      var url = app.globalData.siteRoot + '/api/services/app/Reservation/IsCanOrder';
      var params = {
        userId: user.id
      }
      network.requestLoading(url, params, "加载中...", function (res) {
        //弹出提示框
        if (res.result == false) {
          wx.showModal({
            title: "提示",
            content: "您有一个订单在进行中,无法再次下单！",
            showCancel: false
          })
        } else {
          var carId = e.currentTarget.dataset.id;
          var totalAmount = e.currentTarget.dataset.totalamount;
          console.log("carId=>" + carId);
          wx.navigateTo({
            url: '../reservation/reservation?carId=' + carId + '&totalAmount=' + totalAmount,
          })
        }
      });
    }
  },
  share(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var sd = that.data.startDate;
    var ed = that.data.endDate;
    if (app.globalData.pickUpCar != null) {
      sd = app.globalData.pickUpCar.Date.FullDate;
    }
    if (app.globalData.returnCar != null) {
      ed = app.globalData.returnCar.Date.FullDate;
    }
    wx.navigateTo({
      url: '/pages/share/share?id=' + id + "&startDate=" + sd + "&endDate=" + ed,
    })
  },
  homeButton: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id=options.id;
    //var id = 15;
    that.setData({
      id: id
    })
    this.loadDateAndWeek();
    //this.loadData(id);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})