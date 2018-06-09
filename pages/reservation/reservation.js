// pages/reservation/reservation.js
const app = getApp()
const config = require('./config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    carId: 0,
    totalAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      carId: options.carId,
      totalAmount: options.totalAmount
    });
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
  formSubmit(event) {
    app.aldstat.sendEvent('提交预约单');
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
    wx.showLoading({
      title: "正在提交...",
      mask: true
    });
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
      "rentalFees": 0,
      "basicServiceFee": 0,
      "otherFee": 0,
      "totalAmount": that.data.totalAmount,
      "carId": that.data.carId,
      "weixinUserId": app.globalData.userInfo.id,
      "formId": event.detail.formId
    };
    wx.request({
      url: url,
      method: "POST",
      data: ops,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.statusCode != 200) {
          console.log("请求出错");
          app.aldstat.sendEvent('请求出错', {
            "url": url,
            "message": res
          });
          return;
        }
        app.aldstat.sendEvent('预约成功', {
          "url": url,
          "options": ops
        });
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            //跳转到订单详情页
            wx.redirectTo({
              url: '../order/order-detail/order-detail?id=' + res.data.result.id,
            })
          }
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })

  },
  formReset(event) {
    console.log('[zan:field:reset]', event);
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