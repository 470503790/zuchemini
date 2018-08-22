// pages/wallet/wallet.js
const app = getApp()
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entity:null,
  },
  loadData(){
    var that=this;
    var url=app.globalData.siteRoot + "/api/services/app/wallet/GetWalletByUserIdToMiniAsync";
    var userInfo=wx.getStorageSync('userInfo');
    var params={
      userId:userInfo.id
    };
    network.requestLoading(url,params,"加载中...",function(res){
      
      that.setData({
        entity:res.result
      });
      
    });
  },
  //提现
  takeOut(){
    wx.showToast({
      title: '此功能待完善',
      icon: 'success',
      duration: 1000
    })
    // wx.navigateTo({
    //   url: '/pages/wallet/amount-out/amount-out',
    // })
  },
  //充值
  recharge(){

  },
  //查看流水
  showWater(){
    wx.navigateTo({
      url: '/pages/wallet/liushui/liushui',
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