
function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, success, fail) {
  console.log("参数：",params);
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  //参数处理
  params.diyId=getApp().globalData.diyID;
  console.log("diyId:",params.diyId);
  if(params.diyId==""){
    wx.hideLoading();
    wx.showModal({
      title:"错误",
      content:"请配置 diyId,位置：app.js",
      showCancel:false,
    });
    return;
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json'
      //'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function (res) {
      console.log("返回数据",res.data);
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        console.log("请求出错");
        
        
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if(fail!=undefined){
        fail()
      }
    },
    complete: function (res) {

    },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading
}