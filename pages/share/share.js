import Card from '/card';
var app = getApp();
var network = require("../../utils/network.js")
// pages/share/share.js
Page({
  imagePath: '',
  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    template: {},
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    console.log(e);
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
    });
  },
  loadData(id,startDate,endDate) {
    var that = this;
    var url = app.globalData.siteRoot + "/api/services/app/car/GetCarToMiniAsync";
    var params = {
      id: id,
      startDate: startDate,
      endDate: endDate
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      that.setData({
        detail: res.result
      });

      //获取二维码
      var url = app.globalData.siteRoot + "/mpa/weixinopen/GetQrCode";
      var params = {
        path: "pages/car-detail/car-detail?id=" + id
      }
      network.requestLoading(url, params, "准备生成...", function (res) {
        var qrcodePath = res.result.pictureUrl;
        app.getSetting(function (res) {
          var setting = res;
          that.jsonSetting(setting.name, that.data.detail.picture, qrcodePath);
        });

      });

    });
  },
  jsonSetting(name, picture, qrcodePath) {
    var that=this;
    var user = wx.getStorageSync('userInfo');
    console.log(user);
    var views = [
      {
        type: 'text',
        text: name,
        css: [{
          top: "20rpx",
          fontSize: "30rpx",
          left: "315rpx",
          align: 'center',
          color: "#FABE00"
        }]
      },
      {
        type: "rect",
        css: [{
          top: "70rpx",
          width: "570rpx",
          height: "750rpx",
          color: "#FFFFFF",
          borderRadius: "30rpx",
          left: "30rpx"
        }]
      },
      {
        type: 'image',
        url: picture,
        css: [{
          width: "560rpx",
          height: "373rpx",
          top: "100rpx",
          left: "35rpx"
        }]
      },
      {
        type: 'text',
        text: that.data.detail.name,
        css: [{
          top: "500rpx",
          fontWeight: 'bold',
          fontSize: "35rpx",
          left: "50rpx"
        }],
      },
      {
        type: 'text',
        text: that.data.detail.bodyStructure + "|" + that.data.detail.displacement + " " + that.data.detail.stalls + "|乘坐" + that.data.detail.numberOfPeople + "人",
        css: [{
          top: "550rpx",
          fontSize: "20rpx",
          left: "50rpx"
        }],
      },
      {
        type: 'text',
        text: "日租价格",
        css: [{
          top: "590rpx",
          fontSize: "30rpx",
          left: "50rpx"
        }],
      },
      {
        type: 'text',
        text: "￥" + that.data.detail.averageAmount + "/日均",
        css: [{
          top: "570rpx",
          fontSize: "50rpx",
          left: "180rpx",
          color: "#F4B900"
        }],
      },
      {
        type:'text',
        text:'长按扫描二维码',
        css:[{
          top:"700rpx",
          fontSize:"20rpx",
          left:"150rpx",
          color:"#888888"
        }]
      },
      {
        type:'text',
        text:'领取现金大礼包',
        css:[{
          top:"730rpx",
          fontSize:"20rpx",
          left:"150rpx",
          color:"#888888"
        }]
      },
      {
        type: "image",
        url: qrcodePath,
        css: [{
          top: "620rpx",
          width: "200rpx",
          height: "200rpx",
          right: "50rpx"
        }]
      },
      {
        type: 'image',
        url: user.avatarUrl,
        css: [{
          top: "830rpx",
          width: "150rpx",
          height: "150rpx",
          borderRadius: "100rpx",
          left: "60rpx"
        }]
      },
      {
        type: 'text',
        text: '"送你一个租车大礼包',
        css: [{
          top: "850rpx",
          fontSize: "35rpx",
          left: "230rpx",
        }]
      },
      {
        type: 'text',
        text: '最高100元现金',
        css: [{
          top: "900rpx",
          fontSize: "45rpx",
          color: "#FF6B4D",
          left: "240rpx",
        }]
      },
      {
        type: 'text',
        text: '"',
        css: [{
          top: "900rpx",
          fontSize: "45rpx",
          left: "550rpx",
        }]
      },
    ];
    that.setData({
      template: new Card().palette(views),
    });
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success(res) {
        wx.showModal({
          title: "已保存到相册",
          content: "请自行分享到朋友圈，好友租车有优惠，你赚赏金",
          showCancel: false,

        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    var startDate=options.startDate;
    var endDate=options.endDate;
    this.loadData(id,startDate,endDate);
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

})