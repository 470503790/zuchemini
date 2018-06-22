
var app = getApp();
var network = require("../../../../utils/network.js")
// pages/help/service/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    that.loadData();
  },
  loadData: function () {
    var that = this;
    var url = app.globalData.siteRoot + "/api/services/app/service/GetServiceByIdToMiniAsync";
    var params={
      id: that.data.id
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      wx.setNavigationBarTitle({
        title: res.result.title
      })
      that.setData({
        content: res.result.content
      })
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

  }
})