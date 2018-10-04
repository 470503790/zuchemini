// libs/citySelector/pick-car-address/pick-car-address.js
var app = getApp();
var network = require("../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: null,
    currentCity:null,
    currentAddress: null,
    historys: '',
    is_load:true,
  },
  loadData() {
    var that = this;
    var currentCity = wx.getStorageSync('currentCity');
    var historys = that.filterCityCode();
    that.setData({
      historys: historys,
      currentCity:currentCity,
      nodata_str:"对不起！"+currentCity.name+" 还没有取车地点"
    })
    console.log("历史", historys);
    //获取城市的取车地点
    var url=app.globalData.siteRoot + "/api/services/app/pickUpLocation/GetPickUpLocationsByCityCodeToMiniAsync";
    var params={
      cityCode:currentCity.code
    };
    network.requestLoading(url,params,"加载中...",function(res){
      that.setData({
        details:res.result,
        is_load:false
      });

    });
  },
  select(e) {
    var that = this;
    var currentCity = wx.getStorageSync('currentCity');
    var id = e.currentTarget.dataset.id;
    var address = e.currentTarget.dataset.address;
    var addressObj = {
      id: id,
      name: address,
      cityCode:currentCity.code
    }
    //缓存
    wx.setStorageSync('currentAddress', addressObj);
    var historys = wx.getStorageSync('historys');
    if (historys == '') {
      historys = [{
        id: id,
        name: address,
        cityCode:currentCity.code
      }];
    } else {
      var index = that.getIndex(historys, id);
      if (index==-1) {
        if (historys.length == 3) {
          historys.pop();
        }
        //数组头部插入
        historys.unshift({
          id: id,
          name: address,
          cityCode:currentCity.code
        });

      }

    }

    wx.setStorageSync('historys', historys);
    that.setData({
      currentAddress: address
    });
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  //历史数据中是否已经存在
  getIndex(historys, id) {
    for (var i = 0; i < historys.length; i++) {
      if (historys[i].id == id) {
        return i;
      }
    }
    return -1;
  },
  //删除历史数据选中项
  delete(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    var historys = wx.getStorageSync('historys');
    var index=that.getIndex(historys,id);
    historys.splice(index,1);
    wx.setStorageSync('historys', historys);
    var historys = that.filterCityCode();
    that.setData({
      historys:historys
    })
  },
  //根据城市代码，过滤取车地点
  filterCityCode(){
    var currentCity = wx.getStorageSync('currentCity');
    var historys = wx.getStorageSync('historys');
    var citys=[];
    for(var i=0;i<historys.length;i++){
      if(historys[i].cityCode==currentCity.code){
        citys.push(historys[i]);
      }
    }
    return citys;
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