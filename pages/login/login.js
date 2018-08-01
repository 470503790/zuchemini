// pages/login/login.js
const app = getApp()
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: null,
    jumpType: 'navigateTo'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url,
      jumpType: options.jumpType
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
  getUserInfo: function (o) {
    var that = this;
    
    wx.login({
      success: function (res) {
        console.log(res);
        var url = app.globalData.siteRoot + "/Mpa/Weixinopen/OnLogin";
        network.requestLoading(url, {
          code: res.code
        }, "正在登录...", function (res) {
          var json=res;
          var result = res.result;
          if (result.success) {
            wx.setStorageSync('sessionId', result.sessionId);
            console.log('sessionId=>', wx.getStorageSync('sessionId'));
            //获取用户信息
            wx.getUserInfo({
              success: function (userInfoRes) {
                console.log('get userinfo', userInfoRes);
                app.globalData.userInfo = userInfoRes.userInfo
                typeof cb == "function" && cb(app.globalData.userInfo)
                //校验
                url = app.globalData.siteRoot + '/Mpa/Weixinopen/CheckWxOpenSignature';
                network.request(url, {
                  sessionId: wx.getStorageSync('sessionId'),
                  rawData: userInfoRes.rawData,
                  signature: userInfoRes.signature
                }, function (res) {
                  var checkSuccess = res.success;
                  console.log(res.data);
                  url = app.globalData.siteRoot + '/Mpa/Weixinopen/DecodeEncryptedData';
                  network.request(url, {
                    'type': "userInfo",
                    sessionId: wx.getStorageSync('sessionId'),
                    encryptedData: userInfoRes.encryptedData,
                    iv: userInfoRes.iv
                  }, function (res) {
                    app.globalData.userInfo = res.result.weixinUser;
                    //跳转
                    if (that.data.url != null) {
                      console.log("原来url:" + that.data.url);
                      var url = that.data.url.replace("----", "?").replace(new RegExp(/(---)/gm), "=").replace(new RegExp(/(>)/gm), "&");
                      console.log("处理后url", url);
                      if (that.data.jumpType == "switchTab") {
                        wx.switchTab({
                          url: url
                        });
                      } else if (that.data.jumpType == "navigateTo") {
                        wx.navigateTo({
                          url: url
                        })
                      } else {
                        wx.redirectTo({
                          url: url
                        })
                      }

                    } else {
                      wx.switchTab({
                        url: "/pages/index/index"
                      });
                    }
                  });

                });

              }
            })
          } else {
            console.log('储存session失败！', json);
          }
        });


      }
    })

  }
})