// pages/reservation/reservation.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
const config = require('./config');
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    showPopup: false,//控制弹出层显示隐藏
    payMode:0,//支付方式0：定金 1：全额
    carId: 0,
    totalAmount:0,//总金额
    actualAmount: 0,//实际费用，根据各费用计算得出
    payAmount:0,//支付金额
    discountFee:0,//优惠费用
    detail:null,
    pickUpObj:null,//取车
    returnObj:null,//还车
    day:0,
  },
  loadData(id){
    var that=this;
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarAllInfoByIdToMiniAsync";
    var params = {
      id: id,
      startDate: app.globalData.pickUpCar.Date.FullDate,
      endDate: app.globalData.returnCar.Date.FullDate,
      storeId:app.globalData.pickUpCar.StoreId
    };
    network.requestLoading(url,params,"加载中...",function(res){
      that.setData({
        detail:res.result,
        payMode:res.result.earnestMoney>0?0:1,
        payAmount:res.result.earnestMoney>0?res.result.earnestMoney:res.result.totalAmount
      });
      that.getMoney();
    });
  },
  //弹出费用明细
  togglePopup(){
    this.setData({
      showPopup: !this.data.showPopup
    })
  },
  //支付方式
  changePayMode(){
    var payMode=this.data.payMode==0?1:0;
    this.setData({
      payMode:payMode,
    });
    this.getMoney();
  },
  //计算金额
  getMoney(){
    var that=this;
    var totalAmount=0;
    var actualAmount=0;
    var day=that.data.day;
    var car=that.data.detail;
    var discountFee=that.data.discountFee;
    actualAmount+=car.totalAmount;//租车费
    actualAmount+=car.insuranceFee*day;//保险费
    actualAmount+=car.basicServiceFee*day;//基础服务费
    actualAmount+=car.otherFee*day;//其它费用
    totalAmount=actualAmount;//总费用
    actualAmount-=discountFee;//折扣费用
    //支付金额
    var payAmount=this.data.detail.earnestMoney;
    if(that.data.payMode==1){
      payAmount=actualAmount;
    }
    that.setData({
      actualAmount:actualAmount,
      payAmount:payAmount,
      totalAmount:totalAmount
    });
    console.log("totalAmount:",totalAmount);
    console.log("actualAmount:",actualAmount);
    console.log("payAmount:",payAmount);
  },
  tobuy(event){
    var that = this;
    console.log('[zan:field:submit]', event.detail.value);
    var fullName = event.detail.value.name;
    var mobile = event.detail.value.tel;
    //验证
    if (fullName == "") {
      wx.showToast({
        title: '请填写姓名！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    if (mobile == "") {
      wx.showToast({
        title: '请填写手机号码！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号必须11位！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    var user=wx.getStorageSync('userInfo');
    var url = app.globalData.siteRoot + "/api/services/app/reservation/CreateReservationToMiniAsync";
    console.log("取车对象=>", app.globalData.pickUpCar);
    console.log("还车对象=>", app.globalData.returnCar);
    var ops = {
      "pickUpDate": app.globalData.pickUpCar.Date.FullDate,
      "pickUpTime": app.globalData.pickUpCar.Time,
      "pickUpStoreId": app.globalData.pickUpCar.StoreId,
      "day": app.globalData.day,
      "returnDate": app.globalData.returnCar.Date.FullDate,
      "returnTime": app.globalData.returnCar.Time,
      "returnStoreId": app.globalData.returnCar.StoreId,
      "fullName": fullName,
      "mobilePhone": mobile,
      "rentalFees": that.data.detail.totalAmount,//租车费
      "totalAmount": that.data.totalAmount,//总费用，不包括优惠费用
      "actualAmount":that.data.actualAmount,//实际费用
      "discountFee":that.data.discountFee,//优惠费用
      "carId": that.data.carId,
      "weixinUserId": user.id,
      "formId": event.detail.formId,
      "paymentTypes":that.data.payMode==0?1:0
    };
    network.requestLoading(url, ops, "正在提交...", function (res) {
      var id=res.result.id;
      wx.showToast({
        title: '订单已提交',
        icon: 'success',
        duration: 2000,
        success: function () {
          //跳转到订单详情页
          wx.redirectTo({
            url: '../order/order-detail/order-detail?id=' + id,
          })
        }
      })
    });
  },
  //打开地图查看位置  取车门店
  openLocation:function(e){
    var latitude=parseFloat(e.currentTarget.dataset.latitude);
    var longitude=parseFloat(e.currentTarget.dataset.longitude);
    var name=e.currentTarget.dataset.name;
    var address=e.currentTarget.dataset.address;
    console.log("纬度:"+latitude);
    console.log("经度:"+longitude);
    wx.openLocation({
      latitude:latitude,
      longitude:longitude,
      name:name,
      address:address,
      scale: 28
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var id=options.carId;
    that.loadData(id);
    that.setData({
      carId: id,
      pickUpObj:app.globalData.pickUpCar,
      returnObj:app.globalData.returnCar,
      day:app.globalData.day
    });
    console.log("还车对象：",app.globalData.returnCar);
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
    this.loadData(this.data.carId);
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
 
 
  _handleZanFieldChange(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:change]', componentId, detail);
  },
  _handleZanFieldFocus(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:focus]', componentId, detail);
  },
  _handleZanFieldBlur(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:blur]', componentId, detail);
  },
})