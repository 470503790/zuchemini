var app = getApp();
var network = require("../utils/network.js")
 /**
 * 微信支付
 * @param orderNo 订单号
 * @param money 金额
 * @param success 成功的回调函数
 * @param fail 失败的回调
 */
function wxPayment(orderNo,money,success,fail) {

    //跳转支付
    //获取预支付信息
    var url = app.globalData.siteRoot + "/api/services/app/WeixinPay/Payment";
    var userInfo = wx.getStorageSync('userInfo');
    var params = {
      userId: userInfo.id,
      orderNo: orderNo,
      money: money * 100
    }
    network.requestLoading(url, params, "支付中...", function (res) {
      //支付
      var pay = res.result;
      wx.requestPayment({
        'timeStamp': pay.timeStamp,
        'nonceStr': pay.nonceStr,
        'package': pay.package,
        'signType': 'MD5',
        'paySign': pay.paySign,
        'success': function (res) {
          console.log("支付成功", res);
          wx.showToast({ title: '支付成功' })
          if(success!=undefined){
            success(res);
          }
          

        },
        'fail': function (res) {
          console.log("支付失败", res);
          wx.showToast({ title: '支付失败' })
          if(fail!=undefined){
            fail(res);
          }
          
        }
      })
    });
  }

function balancePayment(){

}

  module.exports = {
    wxPayment: wxPayment
  }