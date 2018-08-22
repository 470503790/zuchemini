// pages/wallet/liushui/liushui.js
const app = getApp()
var network = require("../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liushuis:[]
  },
  loadData(){
    var that=this;
    var url=app.globalData.siteRoot + '/api/services/app/AmountWater/GetPagedAmountWatersToMiniAsync';
    var userInfo=wx.getStorageSync('userInfo');
    var params={
      userId:userInfo.id
    };
    network.requestLoading(url,params,"加载中...",function(res){
      that.setData({
        liushuis:res.result.items
      })
    });
    
  },
  detail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wallet/liushui-detail/liushui-detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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