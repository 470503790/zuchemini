var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
// pages/help/commonProblem/commonProblem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.loadData();
  },
loadData:function(){
  var that = this;
  wx.showLoading({
    title: "加载中...",
    mask: true
  })
  var url = app.globalData.siteRoot + "/api/services/app/commonProblem/GetCommonProblemToMini";
  wx.request({
    url: url,
    method: "POST",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {

      console.log(res.data);
      if(res.statusCode!=200){
        console.log("请求出错");
        app.aldstat.sendEvent('请求出错',{
          "url":url,
          "message":res
        });
        return;
      }
      WxParse.wxParse('content', 'html', res.data.result.content, that, 5);
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