const Page = require('../../utils/ald-stat.js').Page;
//index.js
//获取应用实例
const app = getApp()
//引入扩展文件
const { Tab, extend } = require('../../dist/index');
const Zan = require('../../dist/index');
var ext = require('indexExt.js')
var network = require("../../utils/network.js")

Page(extend({}, Tab, Zan.Field, {
  data: {
    tab: {//选项卡
      list: [],
      selectedId: '1',
      scroll: false,
      height: 45
    },
    pickUpStore: 1,
    returnStore: 1,
    // 取车
    pickerViewConfig1: {
      show: false,
      value: [0, 0],
      year: [],
      time: []
    },
    //还车
    pickerViewConfig2: {
      show: false,
      value: [0, 0],
      year: [],
      time: []
    },
    //天数
    day: 1,
    //预约默认最少多少天
    defaultDay: 2,
    phoneNumber: 13692950061,
    setting: null,
    currentCity: "",//最多4字
    currentAddress: "",//最多10字
  },

  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    })

    that.loadData();

  },
  loadData: function () {
    var that=this;
    that.loadSetting(function(){
      that.loadDateAndWeek();
      if(that.data.setting.storeModel==1){
        that.loadStore();
      }
      
    });
    

  },
  loadDateAndWeek: function () {
    var that = this;
    var myDate = new Date();
    //取车日期，(当前日期+1)+60天

    var dates = ext.getDateAndWeek(myDate);
    var times = ext.getTimes();

    this.setData({
      "pickerViewConfig1.year": dates,
      "pickerViewConfig1.time": times,
      "pickerViewConfig2.year": dates,
      "pickerViewConfig2.time": times,
      'pickerViewConfig2.value': [this.data.defaultDay, 0],
      day: this.data.defaultDay
    });
    //取车时间 缓存
    wx.setStorageSync("getDate", dates[0].FullDate);
  },
  loadStore: function () {
    var that = this;
    var url = app.globalData.siteRoot + "/api/services/app/Store/GetStoreDropDownListToMiniAsync";
    network.requestLoading(url, {}, "加载中", function (res) {
      var tabList = "tab.list";
      var tabSelectId = "tab.selectedId";
      var storeId = res.result[0].id;
      that.setData({
        [tabList]: res.result,
        [tabSelectId]: storeId,
        pickUpStore: storeId,
        returnStore: storeId
      })
    })

  },
  //获取配置项
  loadSetting: function (next) {
    var that = this;
    app.getSetting(function (res) {
      that.setData({
        setting: res,
        phoneNumber: res.phoneNumber,
      });
      wx.setNavigationBarTitle({
        title: that.data.setting.name
      });
      if(res.storeModel==2){
        that.getCurrentCity();
        that.getCurrentAddress();
      }
      if(next!=undefined){
        //继续执行后续动作
        next();
      }
    });
  },
  //获取取车城市
  getCurrentCity() {
    var that = this;
    //缓存获取取车城市
    var currentCity = wx.getStorageSync('currentCity');
    if (currentCity == "") {
      //缓存不存在，从服务器加载配置项获取
      if (that.data.setting.hotCity == null) {
        //如果服务器未配置取车城市，抛出错误提示去配置
        wx.showModal({
          title: "提示",
          content: "请到后台配置热门城市！",
          showCancel: false
        });
        return;
      } else {
        //取出服务器配置项
        currentCity = that.data.setting.hotCity;
        //截取字符串
        if (currentCity.name.length > 4) {
          currentCity.name = currentCity.name.substring(0, 4) + "...";
        }
        that.setData({
          currentCity: currentCity,
        })
      }
    } else {
      //截取字符串
      if (currentCity.name.length > 4) {
        currentCity.name = currentCity.name.substring(0, 4) + "...";
      }
      //缓存已存在取车城市
      that.setData({
        currentCity: currentCity,
      })
    }
    //设置缓存
    wx.setStorageSync('currentCity', currentCity);
  },
  //获取取车地点
  getCurrentAddress() {
    var that = this;
    var currentCity = wx.getStorageSync('currentCity');
    //缓存获取取车地点
    var currentAddress = wx.getStorageSync('currentAddress');

    if (currentAddress == "") {
      //缓存不存在取车地点，从服务器配置获取
      if (that.data.setting.pickUpLocation == null) {
        //如果服务器未配置取车城市，抛出错误提示去配置
        /* wx.showModal({
          title: "提示",
          content: "请到后台配置取车地点！",
          showCancel: false
        }); */
        return;
      } else {
        //取出服务器配置项,***取车地点为对象***
        currentAddress = that.data.setting.pickUpLocation;
        currentAddress.cityCode=currentCity.code;
        if (currentAddress.name.length > 10) {
          currentAddress.name = currentAddress.name.substring(0, 10) + "...";
        }
        that.setData({
          currentAddress: currentAddress,
        })
      }
    } else {
      if(currentAddress.cityCode==currentCity.code){
        if (currentAddress.name.length > 10) {
          currentAddress.name = currentAddress.name.substring(0, 10) + "...";
        }
        that.setData({
          currentAddress: currentAddress,
        })
        currentAddress.cityCode=currentCity.code;
      }else{
        that.setData({
          currentAddress:null
        })
      }
      
    }
    
    //设置缓存
    wx.setStorageSync('currentAddress', currentAddress);
  },
  //选择取车地点
  selectAddress() {
    wx.navigateTo({
      url: '/libs/citySelector/pick-car-address/pick-car-address',
    })
  },
  //选择取车城市
  selectCity() {
    wx.navigateTo({
      url: '/libs/citySelector/switchcity/switchcity?back_url=/pages/index/index',
    });
  },
  onShow: function () {
    var that = this;
    //判断是否首次进来
    if(that.data.setting!=null && that.data.setting.storeModel==2){
      that.getCurrentCity();
      that.getCurrentAddress();
    }
    
  },

  //tab事件
  handleZanTabChange(e) {
    console.log(e);
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      "pickUpStore": selectedId,
      "returnStore": selectedId
    });

    // app.aldstat.sendEvent('tab',{
    //   'selectedId': selectedId
    // });
  },
  //左边时间选择
  handleDateFieldClick: function (e) {

    this.setData({
      'pickerViewConfig1.show': true
    });
    //app.aldstat.sendEvent('取车时间点击');
  },
  //把值存到缓存
  handlePopupDateChange(e) {
    console.log(e);
    var date = this.data.pickerViewConfig1.year[e.detail.value[0]].FullDate
    console.log(date);
    //取车时间 缓存
    wx.setStorageSync("getDate", date)
    //还车时间列表重新生成
    var dates = ext.getDateAndWeek(date);
    this.setData({
      'pickerViewConfig1.value': e.detail.value,
      'pickerViewConfig2.year': dates,
      'pickerViewConfig2.value': [this.data.defaultDay - 1, 0],
      day: this.data.defaultDay
    });
  },
  hideDatePopup() {
    this.setData({
      'pickerViewConfig1.show': false
    });
  },
  //取车时间取消
  cancel1: function () {
    this.hideDatePopup();
  },
  //取车时间确定
  ok1: function () {
    this.hideDatePopup();
    this.handleDateFieldClick2();
  },
  //右边时间选择
  handleDateFieldClick2: function (e) {
    this.setData({
      'pickerViewConfig2.show': true
    });
  },
  handlePopupDateChange2(e) {
    console.log(e.detail);
    var date2 = this.data.pickerViewConfig2.year[e.detail.value[0]].FullDate
    console.log(date2);
    //取车时间
    var date1 = wx.getStorageSync("getDate");
    var day = (new Date(date2)).getTime() - (new Date(date1)).getTime();
    day = parseInt(day / (1000 * 60 * 60 * 24));
    console.log("day:" + day);
    this.setData({
      'pickerViewConfig2.value': e.detail.value,
      "day": day
    });
  },
  hideDatePopup2() {
    this.setData({
      'pickerViewConfig2.show': false
    });
  },
  //还车时间取消
  cancel2: function () {
    this.hideDatePopup2();
  },
  //还车时间确定
  ok2: function () {
    this.hideDatePopup2();
  },
  //去选车
  click_go: function (e) {
    var that = this;
    var formId = e.detail.formId;
    app.commitFormId(formId);
    //取车对象
    var pickerDateObj = that.data.pickerViewConfig1.year[that.data.pickerViewConfig1.value[0]];
    var pickerTimeObj = that.data.pickerViewConfig1.time[that.data.pickerViewConfig1.value[1]];

    //还车对象
    var returDateObj = that.data.pickerViewConfig2.year[that.data.pickerViewConfig2.value[0]];
    var returTimeObj = that.data.pickerViewConfig2.time[that.data.pickerViewConfig2.value[1]];

    app.globalData.day = that.data.day;
    //以后用这个存取值
    app.globalData.pickUpCar = {
      Date: pickerDateObj,
      Time: pickerTimeObj,
      StoreId: that.data.pickUpStore
    };
    app.globalData.returnCar = {
      Date: returDateObj,
      Time: returTimeObj,
      StoreId: that.data.returnStore
    }



    console.log("取车对象=>", app.globalData.pickUpCar);
    console.log("天数=>", app.globalData.day);
    console.log("还车对象=>", app.globalData.returnCar);

    app.aldstat.sendEvent('去选车按钮')
    var page="../car-list/car-list";
    if(that.data.setting.storeModel==2){
      page="../car-list-model2/car-list-model2";
    }
    wx.navigateTo({
      url: page
    })
  },
  //打电话
  call: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.setting.phoneNumber
    })
  },
  copyRight: function () {
    wx.makePhoneCall({
      phoneNumber: '13692950061'
    })
  },
  onPullDownRefresh: function () {
    app.aldstat.sendEvent('首页下拉加载')
    wx.showLoading({
      title: "加载中..."
    })
    this.loadData();
    wx.hideLoading();
    wx.stopPullDownRefresh()
  },

  onUnload: function (e) {
    /* onfire.un('selectAddress');
    onfire.un(eventObj); */
  }
}))
