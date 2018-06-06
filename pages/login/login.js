// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:null,
    jumpType:'navigateTo'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:options.url,
      jumpType:options.jumpType
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
    var that=this;
    wx.showLoading({
      title: "正在登录",
      mask: !0
    })
    wx.login({
      success: function (res) {
        console.log(res);
        var url = app.globalData.siteRoot + "/Mpa/Weixinopen/OnLogin";
        wx.request({
          url: url,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (json) {
            console.log(json);
            if(json.statusCode!=200){
              console.log("请求出错");
              app.aldstat.sendEvent('请求出错',{
                "url":url,
                "message":json
              });
              return;
            }
            var result = json.data.result;
            if (result.success) {
              wx.setStorageSync('sessionId', result.sessionId);
              console.log('sessionId=>', wx.getStorageSync('sessionId'));
              //获取用户信息
              wx.getUserInfo({
                success: function (userInfoRes) {
                  console.log('get userinfo', userInfoRes);
                  app.globalData.userInfo=userInfoRes.userInfo
                  typeof cb == "function" && cb(app.globalData.userInfo)
                  //校验
                  url = app.globalData.siteRoot + '/Mpa/Weixinopen/CheckWxOpenSignature';
                  wx.request({
                    url: url,
                    method:'POST',
                    data:{
                      sessionId:wx.getStorageSync('sessionId'),
                      rawData:userInfoRes.rawData,
                      signature:userInfoRes.signature
                    },
                    success:function(json){
                      if(json.statusCode!=200){
                        console.log("请求出错");
                        app.aldstat.sendEvent('请求出错',{
                          "url":url,
                          "message":json
                        });
                        return;
                      }
                      var checkSuccess=json.data.success;
                      console.log(json.data);
                      url = app.globalData.siteRoot + '/Mpa/Weixinopen/DecodeEncryptedData';
                      wx.request({
                        url: url,
                        method:'POST',
                        data:{
                          'type':"userInfo",
                          sessionId:wx.getStorageSync('sessionId'),
                          encryptedData:userInfoRes.encryptedData,
                          iv:userInfoRes.iv
                        },
                        success:function(json){
                          console.log(json.data);
                          wx.hideLoading();
                          if(json.statusCode!=200){
                            console.log("请求出错");
                            app.aldstat.sendEvent('请求出错',{
                              "url":url,
                              "message":json
                            });
                            return;
                          }
                          app.globalData.userInfo = json.data.result.weixinUser;
                          //跳转
                          if(that.data.url!=null){
                            console.log("原来url:"+that.data.url);
                            var url=that.data.url.replace("----","?").replace(new RegExp(/(---)/gm),"=").replace(new RegExp(/(>)/gm),"&");
                            console.log("处理后url",url);
                            if(that.data.jumpType=="switchTab"){
                              wx.switchTab({
                                url: url
                              });
                            }else if(that.data.jumpType=="navigateTo"){
                              wx.navigateTo({
                                url: url
                              })
                            }else{
                              wx.redirectTo({
                                url:url
                              })
                            }
                            
                          }else{
                            wx.switchTab({
                              url: "/pages/index/index"
                            });
                          }
                          
                        }
                      })
                    }
                  })
                }
              })
            } else {
              console.log('储存session失败！', json);
            }
          }
        })
      }
    })

  }
})