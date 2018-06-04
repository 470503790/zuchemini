// pages/help/service/service.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    services: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取服务列表
    that.loadData();
  },
  loadData:function(){
    var that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/service/GetServiceTitleToMini",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        console.log(res.data);
        that.setData({
          services: res.data.result
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