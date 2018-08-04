// pages/order/order-detail/order-detail.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp()
var network = require("../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    orderDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id: options.id
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
    this.loadData();
    // app.aldstat.sendEvent('订单详情',{
    //   "订单号":this.data.orderDetail.orderNo
    // });
  },
  loadData:function(){
    var that = this;
    var id = that.data.id;
    // wx.showLoading({
    //   title: "加载中...",
    //   mask: true
    // })
    //获取订单详情
    var url = app.globalData.siteRoot + "/api/services/app/reservation/GetReservationByIdToMiniAsync";
    network.requestLoading(url,{
      "id": id
    },"加载中...",function(res){
      that.setData({
        orderDetail: res.result
      })
    });
    // wx.request({
    //   url: url,
    //   method: "POST",
    //   data: {
    //     "id": id
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //     if(res.statusCode!=200){
    //       console.log("请求出错");
    //       app.aldstat.sendEvent('请求出错',{
    //         "url":url,
    //         "message":res
    //       });
    //       return;
    //     }
    //     that.setData({
    //       orderDetail: res.data.result
    //     })
    //   },
    //   complete: function () {
    //     wx.hideLoading();
    //     wx.stopPullDownRefresh();
    //   }
    // })
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
          // wx.showLoading({
          //   title: "正在取消...",
          //   mask: true
          // });
          // app.aldstat.sendEvent('用户取消预约', {
          //   "订单号": id
          // });
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
})