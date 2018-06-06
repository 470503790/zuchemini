var aldstat=require("./utils/ald-stat.js");
//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.siteRoot + "/Mpa/Weixinopen/OnLogin",
            method:"POST",
            data: {
              code: res.code
            },
            success: function (json) {
              console.log(json);
              if(json.statusCode!=200){
                console.log("请求出错");
                that.aldstat.sendEvent('请求出错',{
                  "message":json
                });
                return;
              }
              var result = json.data.result;
              if (result.success) {
                wx.setStorageSync('sessionId', result.sessionId);
                console.log('sessionId=>', wx.getStorageSync('sessionId'));
                console.log('userId=>',result.userId);
                //有userId，就可以获取用户信息
                if(result.userId){
                  wx.request({
                    url:that.globalData.siteRoot+"/api/services/app/weixinUser/GetWeixinUserByIdToMiniAsync",
                    method:"POST",
                    data:{
                      id:result.userId
                    },
                    success:function(json){
                        console.log("用户信息=>",json);
                        that.globalData.userInfo=json.data.result;
                    }
                  })
                }
                
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
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
    //siteRoot:"https://das.mynatapp.cc",
    siteRoot: "https://zuche.shensigzs.com",
    pickerDateObj: null,//取车信息
    returnDateObj: null,//还车信息
    pickerTimeObj: null,//取车信息
    returnTimeObj: null,//还车信息
    day: null,
    pickUpStore: null,
    returnStore: null
  }
})