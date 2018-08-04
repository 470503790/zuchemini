
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp()
const Zan = require('../../../dist/index');
var network = require("../../../utils/network.js")
Page(Object.assign({}, Zan, Zan.Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    tab1: {
      list: [{
        id: '0',
        title: '全部'
      }, {
        id: '1',
        title: '待确认'
      }, {
        id: '3',
        title: '已确认'
      }, {
        id: '4',
        title: '已取车'
      }, {
        id: '5',
        title: '已完成'
      }],
      selectedId: '1'
    },
    orders: null,//订单列表
    //底部弹出框
    baseActionsheet: {
      show: false,
      cancelText: '关闭',
      closeOnClickOverlay: true,
      componentId: 'baseActionsheet',
      actions: [{
        name: '取消订单',
        subname: '',
        className: 'action-class',
        loading: false
      }, {
        name: '确认订单',
        subname: '',
        className: 'action-class',
        loading: false
      }, {
        name: '客户已取车',
        subname: '',
        className: 'action-class',
        loading: false
      }, {
        name: '订单已完成',
        subname: '',
        className: 'action-class',
        loading: false
      }]
    },
    orderId: 0,//订单id
    isClickOrderStatus: false,//是否点击订单状态
    filterText: ""//搜索字
  },
  loadData: function (skipCount, status, filterText) {
    var that = this;
    var url = app.globalData.siteRoot + "/api/services/app/reservation/GetPagedReservationsToMiniAsync";
    var params={
      filterText: filterText,
      status: status,
      maxResultCount: 100,
      skipCount: skipCount
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      that.setData({
        orders: res.result.items
      })
    });
  },
  //点击tab
  _handleZanTabChange: function (e) {
    console.log("点击tab", e);
    var componentId = e.currentTarget.dataset.componentId;
    var selectedId = e.currentTarget.dataset.itemId;
    var skipCount = 0;//当前第一页
    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      filterText: ""
    });
    this.loadData(skipCount, selectedId, "");
  },
  formSubmit(event) {
    var that = this;
    console.log('[zan:field:submit]', event.detail.value);
    var selectedId = that.data.tab1.selectedId;
    var filterText = event.detail.value.filterText;
    that.setData({
      filterText: filterText
    });
    this.loadData(0, selectedId, filterText);
  },
  orderDetail: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var orderStatus = e.currentTarget.dataset.status;
    var buttons = [{
      text: '查看订单详情',
      color: 'red',
      type: 'detail'
    }, {
      text: '修改订单状态',
      color: '#3CC51F',
      type: 'status'
    }, {
      text: '取消',
      type: 'cancel'
    }];
    console.log("点击订单", orderId);
    that.setData({
      orderId: orderId
    });
    //判断订单状态
    if (orderStatus == "已完成") {
      buttons = [{
        text: '查看订单详情',
        color: 'red',
        type: 'detail'
      }, {
        text: '取消',
        type: 'cancel'
      }];
    }
    that.showZanDialog({
      title: '订单操作',
      content: '请按提示选择操作',
      buttonsShowVertical: true,
      buttons: buttons
    }).then(({ type }) => {
      console.log('=== dialog with vertical buttons ===', `type: ${type}`);
      if (type == "detail") {
        console.log("跳转到订单详情");
        wx.navigateTo({
          url: '/pages/order/order-detail/order-detail?id=' + orderId,
        })
      } else if (type == "status") {
        console.log("修改订单状态");
        this.setData({
          'baseActionsheet.show': true
        });
      }
    });
  },
  //点击灰色处关闭
  _handleZanActionsheetMaskClick: function (componentId) {
    this.setData({
      [`baseActionsheet.show`]: false
    });
  },
  //点击关闭
  _handleZanActionsheetCancelBtnClick: function (componentId) {
    this.setData({
      [`baseActionsheet.show`]: false
    });
  },
  //点击订单状态
  _handleZanActionsheetBtnClick: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    //已经点击过订单状态，就不能再点击
    if (that.data.isClickOrderStatus) return;
    //根据下标判断点击哪个按钮
    var index = e.currentTarget.dataset.index;
    var ba = "baseActionsheet.actions[" + index + "].loading";
    var status = 0;
    if (index == 0) {
      status = 2;
    } else if (index == 1) {
      status = 3;
    } else if (index == 2) {
      status = 4;
    } else if (index == 3) {
      status = 5;
    }
    that.setData({
      [ba]: true,
      isClickOrderStatus: true
    });
    var url = app.globalData.siteRoot + "/api/services/app/reservation/ChangeStatusReservationToMiniAsync";
    var params={
      id: that.data.orderId,
      status: status,
    };
    network.requestLoading(url, params, "加载中...", function (res) {
      wx.redirectTo({
        url: "/pages/order/order-manager/order-manager?selectedId=" + that.data.tab1.selectedId + "&filterText=" + that.data.filterText
      });
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("参数：", options);
    var selectedId = this.data.tab1.selectedId;
    var filterText = "";
    //如果有参数
    if (JSON.stringify(options) != "{}") {
      selectedId = options.selectedId;
      filterText = options.filterText;
      this.setData({
        [`tab1.selectedId`]: selectedId,
        filterText: filterText
      })
    }

    var skipCount = 0;
    this.loadData(skipCount, selectedId, filterText);
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
}));