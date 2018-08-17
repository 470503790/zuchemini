// pages/order/order-detail/order-detail.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp()
var network = require("../../../utils/network.js");
var payHelper=require("../../../utils/payHelper.js");
var Zan = require('../../../dist/index');
Page(Object.assign({}, Zan.NoticeBar,Zan.Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    orderDetail:{},
    movable: {
      text: '支付剩余时间：00分00秒，逾期订单将自动取消'
    },
    totalSecond:0,
    interval:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id: options.id
    });
    this.loadData();
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
  loadData:function(success){
    var that = this;
    var id = that.data.id;
    //获取订单详情
    var url = app.globalData.siteRoot + "/api/services/app/reservation/GetReservationByIdToMiniAsync";
    network.requestLoading(url,{
      "id": id
    },"加载中...",function(res){
      that.setData({
        orderDetail: res.result,
        totalSecond:res.result.totalSecond
      });
      //启动倒计时
      if(res.result.totalSecond>0){
        that.countdown();
      }
      if(success!=undefined){
        success();
      }
      console.log("分钟：",that.data.totalSecond);
    });
  },
  //倒计时
  countdown(){
    var that=this;
    var interval = setInterval(function () {
      that.setData({
        interval:interval
      })
      // 秒数
      var second = that.data.totalSecond;
      var totalSecond=that.data.totalSecond;
      var day = Math.floor(second / 3600 / 24);
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      // 分钟位
      var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
 
      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min*60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      var totalMin=day*24*60+hr*60+min;
      this.setData({
        movable:{
          text:'支付剩余时间：'+totalMin+'分'+secStr+'秒'+'，逾期订单将自动取消'
        }
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.redirectTo({
          url: '/pages/order/order-detail/order-detail?id='+that.data.id,
          success: function(res){
            // success
          }
        })
      }
      that.setData({
        totalSecond:totalSecond
      });
      console.log("分钟：",totalSecond);
    }.bind(this), 1000);
  },
  //点击支付触发
  toggleVerticalDialog(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.orderno;
    var formId = e.detail.formId;
    that.showZanDialog({
      title: '订单支付',
      content: '请选择一种支付方式',
      buttonsShowVertical: true,
      buttons: [{
        text: '余额支付',
        color: 'red',
        type: 'balance'
      }, {
        text: '微信支付',
        color: '#3CC51F',
        type: 'wechat'
      }, {
        text: '取消',
        type: 'cancel'
      }]
    }).then(({ type }) => {
      console.log('=== dialog with vertical buttons ===', `type: ${type}`);
      if (type == "balance") {
        //余额支付
        console.log("余额支付", e);
        that.balancePay(e);
      } else if (type == "wechat") {
        //微信支付
        console.log("微信支付", e);
        that.payment(e);
      }
    });
  },
  //微信支付
  payment(e) {
    console.log("支付", e);
    var id = e.currentTarget.dataset.id;
    var actualAmount = e.currentTarget.dataset.actualamount;
    //var actualAmount =0.01;
    var orderNo = e.currentTarget.dataset.orderno;
    var formId = e.detail.formId;
    payHelper.wxPayment(orderNo,actualAmount,function(res){
      var url = app.globalData.siteRoot + "/api/services/app/reservation/ChangeStatusPayToMiniAsync";
      var params = {
        orderNo: orderNo
      }
      network.requestLoading(url, params, "请稍候...", function (res) {
        //跳转到订单详情
        wx.redirectTo({
          url: "/pages/order/order-detail/order-detail?id=" + id
        });
      })
    },function(res){

    });
  },
  //余额支付
  balancePay(e){
    var id = e.currentTarget.dataset.id;
    var actualAmount = e.currentTarget.dataset.actualamount;
    var orderNo = e.currentTarget.dataset.orderno;
    var userInfo = wx.getStorageSync('userInfo');
    var formId = e.detail.formId;
    var url = app.globalData.siteRoot + "/api/services/app/wallet/GetWalletByUserIdToMiniAsync";
    var params = {
      userId: userInfo.id
    }
    network.requestLoading(url, params, "加载中...", function (res) {
      if (actualAmount > res.result.money) {
        wx.showModal({
          title: "余额不足",
          content: "请选择其它方式支付",
          showCancel: false
        })
      } else {
        console.log("触发余额支付")
        url = app.globalData.siteRoot + "/api/services/app/wallet/PayToMiniAsync";
        params = {
          userId: userInfo.id,
          orderNo: orderNo,
          formId: formId
        };
        network.requestLoading(url, params, "支付中...", function (res) {
          //跳转到订单详情
          wx.redirectTo({
            url: "/pages/order/order-detail/order-detail?id=" + id
          });
        },function(res){
          console.log("支付失败",res);
          wx.showToast({ title: '余额支付失败' });
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("隐藏");
    clearInterval(this.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("卸载");
    clearInterval(this.data.interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(this.data.interval);
    this.loadData(function(){
      wx.stopPullDownRefresh();
    });
    
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
  goIndex:function(){
    wx.switchTab({
      url: "../../../pages/index/index"
    })
  },
  cancelOrder:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title:"预约",
      content:"确认取消预约吗？",
      success:function(res){
        if(res.confirm){
          var url = app.globalData.siteRoot + "/api/services/app/reservation/CancelReservationToMini";
          var params={
            "id": id,
            "formId":e.detail.formId
          };
          network.requestLoading(url,params,"正在取消...",function(res){
            if(res.success){
              wx.showToast({
                title: "已经取消",
                icon: 'success',
                duration: 2000,
                success: function () {
                  that.loadData();
                }
              })
            }else{
              wx.showToast({
                title: "操作出错",
                icon: 'error',
                duration: 2000,
              })
            }
          });
        }
      }
    })
    
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
  //打电话
  call:function(e){
    var phone=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber:phone
    })
  }
}))