const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortType:1,//默认1
    categoryId:0,//默认0
    navs:null,//分类
    details:null,//列表
    
  },
  //选择分类
  select_nav(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    console.log("分类id:",id);
    that.setData({
      categoryId:id
    });
    that.loadDetails();
  },
  loadData(){
    var currentCity=wx.getStorageSync('currentCity');
    var currentAddress=wx.getStorageSync('currentAddress');
    var userInfo=wx.getStorageSync('userInfo');
  },
  //加载列表
  loadDetails(){
    var that=this;
    var currentAddress=wx.getStorageSync('currentAddress');
    var currentCity=wx.getStorageSync('currentCity');
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarByCategoryIdToMiniAsync";
    var params = {
      categoryId:that.data.categoryId,
      sortType:that.data.sortType,
      startDate:app.globalData.pickUpCar.Date.FullDate,
      endDate:app.globalData.returnCar.Date.FullDate,
      day:app.globalData.day,
      pickUpLocationId:currentAddress.id,
      cityCode:currentCity.code
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      that.setData({
        navs:res.result.categories,
        details: res.result.cars
      });
      //缓存联盟id
      wx.setStorageSync('allianceId', res.result.allianceId);
    });
  },
  sort(e){
    var that=this;
    var type=e.currentTarget.dataset.type;
    that.setData({
      sortType:type
    });
    //加载列表数据
    that.loadDetails();
  },
  gobuy(e){
    var that=this;
    //判断是否登陆
    var user=wx.getStorageSync('userInfo');
    if (user=="") {
      //var url = "/pages/car-list/car-list----startDate---"+that.data.options.startDate+">endDate---"+that.data.options.endDate+">day---"+that.data.options.day;
      var url = "/pages/car-list-model2/car-list-model2";
      var jumpType = "redirectTo";
      console.log("url", url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
      });
    } else {

      //点击预约前，检查是否能下单
      var url = app.globalData.siteRoot + '/api/services/app/Reservation/IsCanOrder';
      var params = {
        userId: user.id
      }
      network.requestLoading(url, params, "加载中...", function (res) {
        //弹出提示框
        if (res.result == false) {
          wx.showModal({
            title: "提示",
            content: "您有一个订单在进行中,无法再次下单！",
            showCancel: false
          })
        } else {
          var carId = e.currentTarget.dataset.carid;
          var storeid = e.currentTarget.dataset.storeid;

          app.globalData.pickUpCar.StoreId=storeid;
          app.globalData.returnCar.StoreId=storeid;
          console.log("carId=>" + carId);
          wx.navigateTo({
              url:'../reservation/reservation?carId=' + carId
          })
        }
      });



    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDetails();
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