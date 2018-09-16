// libs/citySelector/pick-car-address/pick-car-address.js
var app = getApp();
var network = require("../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [{
      hubName: "机场",
      pictureUrl: '/images/team/carpooling.png'
      , addresses: [{
        id: 1,
        name: '机场站1'
      }, {
        id: 2,
        name: '机场站2'
      }]
    }, {
      hubName: '火车站',
      pictureUrl: '/images/team/carpooling.png'
      , addresses: [
        {
          id: 3,
          name: '火车站1'
        }, {
          id: 4,
          name: '火车站2'
        }, {
          id: 5,
          name: '火车站3'
        }, {
          id: 6,
          name: '火车站4'
        }
      ]
    }, {
      hubName: '汽车站',
      pictureUrl: '/images/team/2.jpg'
      , addresses: [
        {
          id: 7,
          name: "汽车站1"
        }, {
          id: 8,
          name: "汽车站2"
        }
      ]
    }]
    , currentAddress: '',
    historys: ''
  },
  loadData() {
    var that = this;
    var cityCode = wx.getStorageSync('currentCityCode');
    var historys = wx.getStorageSync('historys');
    that.setData({
      historys: historys
    })
    console.log("历史", historys);
    //获取城市的取车地点
    /* var url="";
    var params={
      cityCode:cityCode
    };
    network.requestLoading(url,params,"加载中...",function(res){
      that.setData({
        details:res.result
      })
    }); */
  },
  select(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var address = e.currentTarget.dataset.address;
    var addressObj = {
      id: id,
      address: address
    }
    //缓存
    wx.setStorageSync('currentAddress', addressObj);
    var historys = wx.getStorageSync('historys');
    if (historys == '') {
      historys = [{
        id: id,
        name: address
      }];
    } else {
      var index = that.getIndex(historys, id);
      if (index==-1) {
        if (historys.length == 3) {
          historys.pop();
        }
        historys.unshift({
          id: id,
          name: address
        });

      }

    }

    wx.setStorageSync('historys', historys);
    that.setData({
      currentAddress: address
    });
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  //历史数据中是否已经存在
  getIndex(historys, id) {
    for (var i = 0; i < historys.length; i++) {
      if (historys[i].id == id) {
        return i;
      }
    }
    return -1;
  },
  //删除历史数据选中项
  delete(e){
    var id=e.currentTarget.dataset.id;
    var historys = wx.getStorageSync('historys');
    var index=this.getIndex(historys,id);
    historys.splice(index,1);
    wx.setStorageSync('historys', historys);
    this.setData({
      historys:historys
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  }
})