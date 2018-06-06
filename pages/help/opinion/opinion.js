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
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    //判断是否登陆
    if (app.globalData.userInfo == null) {
      var url = "/pages/help/opinion/opinion";
      var jumpType = "redirectTo";
      console.log("url", url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
      });
    } else {
      var url = app.globalData.siteRoot + "/api/services/app/opinion/CreateOpinionToMiniAsync";
      wx.request({
        url: url,
        data: {
          content: e.detail.value.content,
          weixinUserId: app.globalData.userInfo.id,
          formId: e.detail.formId
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if(res.statusCode!=200){
            console.log("请求出错");
            app.aldstat.sendEvent('请求出错',{
              "url":url,
              "message":res
            });
            return;
          }
          wx.showModal({
            title: '提示',
            content: '感谢您的反馈！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("跳转到个人中心");
                wx.switchTab({
                  url: '/pages/me/me'
                });
              }


            }
          })
        }
      })
    }




  }
})