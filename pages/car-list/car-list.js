var app = getApp();
// pages/cat-list/cat-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // options: {
    //   startDate: null,
    //   endDate: null,
    //   day: 0,
    //   pickUpStoreId:0,
    //   returnStoreId:0
    // },

    cars: [],
    car: {},
    showPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // console.log(options);
    // that.setData({
    //   options: options
    // });
  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarsToMiniAsync";
    var options = {
      startDate: app.globalData.pickUpCar.Date.FullDate,
      endDate: app.globalData.returnCar.Date.FullDate,
      day: app.globalData.day,
      pickUpStoreId: app.globalData.pickUpCar.StoreId,
      returnStoreId: app.globalData.returnCar.StoreId
    };
    wx.request({
      url: url,
      method: "POST",
      data: options,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.aldstat.sendEvent('刷新车列表', {
          url: url,
          options: options,
          result: res
        });
        console.log(res.data);
        if (res.statusCode != 200) {
          console.log("请求出错");
          app.aldstat.sendEvent('请求出错', {
            "url": url,
            "message": res
          });
          return;
        }
        that.setData({
          cars: res.data.result
        })
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
    var that = this;
    this.loadData();
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
    var that = this;
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
  showCarInfo: function (e) {
    var that = this;
    console.info("显示车信息");
    var id = e.currentTarget.dataset.id;
    console.log("id=>" + id);
    wx.showLoading({
      title: "加载中..."
    })
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarToMiniAsync";
    var options = {
      id: id,
      startDate: app.globalData.pickUpCar.Date.FullDate,
      endDate: app.globalData.returnCar.Date.FullDate,
    };
    wx.request({
      url: url,
      method: "POST",
      data: options,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode != 200) {
          console.log("请求出错");
          app.aldstat.sendEvent('请求出错', {
            "url": url,
            "message": res
          });
          return;
        }
        that.setData({
          car: res.data.result,
          showPopup: !that.data.showPopup
        });
        app.aldstat.sendEvent('查看汽车信息', {
          "名称": res.data.result.name,
          "options": options,
          "result": res
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  hideCarInfo: function () {
    var that = this;
    that.setData({
      showPopup: !that.data.showPopup
    })
  },
  //预约跳转
  click_go: function (e) {
    var that = this;
    console.log(e);
    //判断是否登陆
    if (app.globalData.userInfo == null) {
      //var url = "/pages/car-list/car-list----startDate---"+that.data.options.startDate+">endDate---"+that.data.options.endDate+">day---"+that.data.options.day;
      var url = "/pages/car-list/car-list";
      var jumpType = "redirectTo";
      console.log("url", url);
      wx.navigateTo({
        url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
      });
    } else {

      //点击预约前，检查是否能下单
      var url = app.globalData.siteRoot + '/api/services/app/Reservation/IsCanOrder';
      wx.request({
        url: url,
        method: "POST",
        data: {
          userId: app.globalData.userInfo.id
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode != 200) {
            console.log("请求出错");
            app.aldstat.sendEvent('请求出错', {
              "url": url,
              "message": res
            });
            return;
          }
          //弹出提示框
          if (res.data.result == false) {
            wx.showModal({
              title: "提示",
              content: "您有一个订单在进行中,无法再次下单！",
              showCancel: false
            })
          } else {
            app.aldstat.sendEvent('点击预约', {
              "名称": that.data.car.name,
              "userId": app.globalData.userInfo.id
            });
            var carId = e.currentTarget.dataset.id;
            var totalAmount = e.currentTarget.dataset.totalamount;
            console.log("carId=>" + carId);
            wx.navigateTo({
              url: '../reservation/reservation?carId=' + carId + '&totalAmount=' + totalAmount,
            })
          }
        }
      })

    }


  },
  click_goOpinion: function () {
    wx.navigateTo({
      url: '/pages/help/opinion/opinion',
    })
  }
})