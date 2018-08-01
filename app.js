//var aldstat = require("./utils/ald-stat.js");
var fundebug = require('./utils/fundebug.0.6.1.min.js')
fundebug.init(
  {
    apikey: "4b8c4668c63e5a97704debea971a8b9d5698520a15432683cde00a95fc4b233f",
    silentInject: true,
    setSystemInfo: true,
    monitorHttpData: true,
    silent: true
  })
var network = require("./utils/network.js")
//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var url = that.globalData.siteRoot + "/Mpa/Weixinopen/OnLogin";
          //发起网络请求
          network.request(url, {
            code: res.code
          },
            function (json) {
              var result = json.result;
              if (result.success) {
                wx.setStorageSync('sessionId', result.sessionId);
                console.log('sessionId=>', wx.getStorageSync('sessionId'));
                console.log('userId=>', result.userId);
                //有userId，就可以获取用户信息
                if (result.userId) {
                  url = that.globalData.siteRoot + "/api/services/app/weixinUser/GetWeixinUserByIdToMiniAsync";
                  network.request(url, {
                    id: result.userId
                  },
                    function (json) {
                      that.globalData.userInfo = json.result;
                    })
                }

              }
            }
            
          )

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onError: function (err) {
    fundebug.notifyError(err);
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == 'function' && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    siteRoot: "https://das.mynatapp.cc",
    //siteRoot: "https://zuche.shensigzs.com",
    diyID:"39cb2fff34814ef485c95aae2f4f1d85",//专属ID，请到后台--小程序管理--小程序源码管理 页面获取
    day: null,
    phoneNumber: null,
    pickUpCar: null,//以后都使用这个
    returnCar: null//以后都使用这个
  }
})