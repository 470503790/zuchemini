// pages/help/opinion/opinion.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/opinion/CreateOpinionToMiniAsync",
      data:{
        content: e.detail.value.content,
        weixinUserId: app.globalData.userInfo.id,
        formId:e.detail.formId
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: '感谢您的反馈！',
          icon: 'success',
          duration: 2000
        })
      }
    })
    
  }
})