// pages/order/order-detail/order-detail.js
const app = getApp()
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
    app.aldstat.sendEvent('订单详情',{
      "订单号":this.data.orderDetail.orderNo
    });
  },
  loadData:function(){
    var that = this;
    var id = that.data.id;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    //获取订单详情
    wx.request({
      url: app.globalData.siteRoot + "/api/services/app/reservation/GetReservationByIdToMiniAsync",
      method: "POST",
      data: {
        "id": id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if(res.statusCode!=200){
          console.log("请求出错");
          app.aldstat.sendEvent('请求出错',{
            "message":res
          });
          return;
        }
        that.setData({
          orderDetail: res.data.result
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
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
          wx.showLoading({
            title: "正在取消...",
            mask: true
          })
          wx.request({
            url: app.globalData.siteRoot + "/api/services/app/reservation/CancelReservationToMini",
            method: "POST",
            data: {
              "id": id,
              "formId":e.detail.formId
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if(res.statusCode!=200){
                console.log("请求出错");
                app.aldstat.sendEvent('请求出错',{
                  "message":res
                });
                return;
              }
              if(res.data.success){
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
              
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      }
    })
    
  }
})