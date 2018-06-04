// pages/help/novice/novice.js
const app = getApp()
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
    app.aldstat.sendEvent('订单列表');
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
    var userId = app.globalData.userInfo.id;
    //获取订单列表
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/reservation/GetReservationsToMiniAsync",
      method: "POST",
      data: {
        "weixinUserId": userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          orders: res.data.result
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
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
  }
})