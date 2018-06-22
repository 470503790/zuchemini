// pages/help/novice/novice.js
const app = getApp()
var network = require("../../../utils/network.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //app.aldstat.sendEvent('订单列表');
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
    this.loadData();
  },
  loadData: function () {
    var that = this;
    //判断是否登陆
    if (app.globalData.userInfo == null) {
      var url = "/pages/order/order-list/order-list";
      var jumpType = "navigateTo";
      console.log("url", url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
      });
      return;
    }
    var userId = app.globalData.userInfo.id;
    //获取订单列表
    var url = app.globalData.siteRoot + "/api/services/app/reservation/GetReservationsToMiniAsync";
    var params={
      "weixinUserId": userId
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      that.setData({
        orders: res.result
      })
    });
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
    this.loadData();
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
  //跳转订单详情
  orderDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/order/order-detail/order-detail?id=' + id,
    })
  },
  click_go: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //打开地图查看位置  取车门店
  openLocation: function (e) {
    var latitude = parseFloat(e.currentTarget.dataset.latitude);
    var longitude = parseFloat(e.currentTarget.dataset.longitude);
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;
    console.log("纬度:" + latitude);
    console.log("经度:" + longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 28
    })
  },
})