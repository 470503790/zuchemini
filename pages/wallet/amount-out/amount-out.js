// pages/wallet/amount-out/amount-out.js
const app = getApp()
var network = require("../../../utils/network.js")
const Zan = require('../../../dist/index');
Page(Object.assign({}, Zan.Field, {

  /**
   * 页面的初始数据
   */
  data: {
    entity: null,
    setting:null,
    //提现金额
    amountOutPrice: {
      right: true,
      error: true,
      mode: 'wrapped',
      title: '提现金额',
      inputType: 'number',
      placeholder: '输入提现金额',
      componentId: "money"
    },
    //微信
    weixin: {
      fullname: {
        focus: true,
        title: '姓名',
        placeholder: '请输入正确的姓名',
        inputType: "text",
        componentId: "fullName"
      },
      username: {
        focus: true,
        title: '帐号',
        placeholder: '请输入正确的微信帐号',
        inputType: "text",
        componentId: "weixin"
      }
    },
    //支付宝
    aliPay: {
      fullname: {
        focus: true,
        title: '姓名',
        placeholder: '请输入正确的姓名',
        inputType: "text",
        componentId: "fullName"
      },
      username: {
        focus: true,
        title: '帐号',
        placeholder: '请输入正确的支付宝帐号',
        inputType: "text",
        componentId: "aliPayName"
      }
    },
    //银行卡
    bank: {
      fullname: {
        focus: true,
        title: '姓　　名',
        placeholder: '请输入正确的姓名',
        inputType: "text",
        componentId: "fullName"
      },
      name: {
        focus: true,
        title: '银行名称',
        placeholder: '请输入银行名称',
        inputType: "text",
        componentId: "bankName"
      },
      cardNo: {
        focus: true,
        title: '卡　　号',
        placeholder: '请输入正确的银行卡号',
        inputType: "number",
        componentId: "bankCardNo"
      }
    },
    selected: 0,//默认支付方式
    enableWeixin:0,//是否启用微信提现方式
    enableAliPay:0,//是否启用支付宝提现方式
    enableBank:0//是否启用银行卡提现方式
  },
  loadData() {
    var that=this;
    var url = app.globalData.siteRoot + "/api/services/app/Wallet/GetWalletByUserIdToMiniAsync";
    var userInfo = wx.getStorageSync('userInfo');
    var params = {
      userId: userInfo.id
    };
    network.requestLoading(url, params, "加载中...", function (res) {

      that.setData({
        entity: res.result
      });

    });
  },
  //选择
  select(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
  },
  formSubmit(e) {
    var that=this;
    console.log("表单", e);
    var formdata=e.detail.value;
    //验证
    var money=formdata.money;
    if(money<that.data.setting.minimumAmount){
      wx.showModal({
        title:"提示",
        content:"提现金额最低为"+that.data.setting.minimumAmount+"元",
        showCancel:false
      })
      return;
    }
    if(money>that.data.entity.money){
      wx.showModal({
        title:"提示",
        content:"余额不足",
        showCancel:false
      })
      return;
    }
    console.log("提交申请");
    var userInfo = wx.getStorageSync('userInfo');
    var url=app.globalData.siteRoot + "/api/services/app/AmountOut/ApplyToMiniAsync";
    var params={
      FullName:formdata.fullName,
      Amount:formdata.money,
      WeixinUsername:formdata.weixin,
      AliPayUsername:formdata.aliPayName,
      Bankname:formdata.bankName,
      BankCardNo:formdata.bankCardNo,
      TransferType:that.data.selected,
      UserId:userInfo.id
    };
    network.requestLoading(url,params,"提交中...",function(res){
      wx.showModal({
        title:"提示",
        content:"提现申请已提交，请耐心等待！",
        showCancel:false,
        success:function(res){
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/wallet/wallet'
            })
          }
        }
      })
    });
  },
  handleZanFieldFocus(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:focus]', componentId, detail);
  },
  handleZanFieldBlur(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:blur]', componentId, detail);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
    var setting=app.globalData.setting;
    var enableWeixin=0;
    var enableAliPay=0;
    var enableBank=0;
    if(setting.amountOutMode.indexOf("1")>=0){
      enableWeixin=1;
    }
    if(setting.amountOutMode.indexOf("2")>=0){
      enableAliPay=1;
    }
    if(setting.amountOutMode.indexOf("3")>=0){
      enableBank=1;
    }
    this.setData({
      setting:app.globalData.setting,
      enableWeixin:enableWeixin,
      enableAliPay:enableAliPay,
      enableBank:enableBank
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
}))