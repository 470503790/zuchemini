var app = getApp();
// pages/cat-list/cat-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {
      startDate: null,
      endDate: null,
      day: 0
    },

    cars: [],
    car: {},
    showPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      options: options
    });
  },
  loadData: function (options) {
    var that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/car/GetCarsToMiniAsync",
      method: "POST",
      data: {
        startDate: options.startDate,
        endDate: options.endDate,
        day: options.day
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        console.log(res.data);
        that.setData({
          cars: res.data.result
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
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
    var that = this;
    var options = that.data.options;
    this.loadData(options);
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
    var that = this;
    var options = that.data.options;
    this.loadData(options);
    
    app.aldstat.sendEvent('刷新车列表');
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

  },
  showCarInfo: function (e) {
    var that = this;
    console.info("显示车信息");
    var id = e.currentTarget.dataset.id;
    console.log("id=>" + id);
    wx.showLoading({
      title: "加载中..."
    })
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/car/GetCarToMiniAsync",
      method: "POST",
      data: {
        id: id,
        startDate: that.options.startDate,
        endDate: that.options.endDate,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          car: res.data.result,
          showPopup: !that.data.showPopup
        });
        app.aldstat.sendEvent('查看汽车信息',{
          "名称":res.data.result.name
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  hideCarInfo: function () {
    var that = this;
    that.setData({
      showPopup: !that.data.showPopup
    })
  },
  //预约跳转
  click_go: function (e) {
    var that=this;
    console.log(e);
    app.aldstat.sendEvent('点击预约',{
      "名称":that.data.car.name
    });
    if (app.globalData.userInfo == null) {
      var url = "/pages/car-list/car-list----startDate---"+that.data.options.startDate+">endDate---"+that.data.options.endDate+">day---"+that.data.options.day;
      var jumpType="redirectTo";
      console.log("url",url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url+'&jumpType='+jumpType,
      });
    } else {
      var carId = e.currentTarget.dataset.id;
      var totalAmount = e.currentTarget.dataset.totalamount;
      console.log("carId=>" + carId);
      wx.navigateTo({
        url: '../reservation/reservation?carId=' + carId + '&totalAmount=' + totalAmount,
      })
    }


  }
})