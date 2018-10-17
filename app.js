const App = require('./utils/ald-stat.js').App;
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
var startTime = Date.now();//启动时间
//app.js
App({
  onLaunch: function () {
    var that = this;
    that.getUserInfo(function () {
      console.log("用户信息:", that.globalData.userInfo);

    });

  },
  onShow: function () {
    this.aldstat.sendEvent('小程序的启动时长', {
      time: Date.now() - startTime
    })
  },
  onError: function (err) {
    fundebug.notifyError(err);
  },
  /**
 * 获取用户信息
 * @param success 成功回调函数
 * @param login 登录回调函数
 */
  getUserInfo(success, login) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo == "") {
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
                    that.getUserInfoById(result.userId);
                  } else {
                    if (login != undefined) {
                      login();
                    }

                  }

                }
              }

            )

          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    } else {
      //有缓存，但数据库可能已经把用户删除了，这里需要再次从数据库获取用户信息，确认真的有用户存在
      //这个概率非常小，所以这里不作验证，避免给服务器造成压力
      success();
    }

  },
  getUserInfoById(userId, success) {
    var that = this;
    var url = that.globalData.siteRoot + "/api/services/app/weixinUser/GetWeixinUserByIdToMiniAsync";
    var params = {
      id: userId
    };
    network.request(url, params, function (json) {
      that.globalData.userInfo = json.result;
      wx.setStorageSync('userInfo', json.result);
      if (success != undefined) {
        success();
      }

    })
  },
  getSetting(success) {
    var that = this;
    var url = that.globalData.siteRoot + "/api/services/app/SystemSettings/GetSettingToMiniAsync";
    network.requestLoading(url, {}, "加载中...", function (res) {
      if (success != undefined) {
        success(res.result);
      }
    })
  },
  //提交formId
  commitFormId(formId){
    var that=this;
    var url=that.globalData.siteRoot + "/api/services/app/FormIdContainer/CommitFormIdToMiniAsync";
    var userInfo=wx.getStorageSync('userInfo');
    if(userInfo=="")return;
    var params={
      formId:formId,
      weixinUserId:userInfo.id
    }
    network.request(url,params,function(res){
      console.log("commitFormId",res);
    });
  },
  globalData: {
    userInfo: null,
    siteRoot: "https://das.mynatapp.cc",
    //siteRoot: "https://zuche.shensigzs.com",
    diyID: "582425050df045409a546712c6517fd4",//专属ID，请到后台--小程序管理--小程序源码管理 页面获取
    setting: null,//系统配置
    day: null,
    phoneNumber: null,
    pickUpCar: null,//以后都使用这个
    returnCar: null//以后都使用这个
  }
})