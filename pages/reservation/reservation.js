// pages/reservation/reservation.js
var Zan = require('../../dist/index');
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
const config = require('./config');
var network = require("../../utils/network.js")
var ext = require('../../utils/data-generate.js')
var useCarExt = require('../../utils/use-car-generate.js')
Page(Object.assign({}, Zan.NoticeBar, {

    /**
     * 页面的初始数据
     */
    data: {
        config,
        showPopup: false,//控制弹出层显示隐藏
        payMode: 0,//支付方式0：定金 1：全额
        carId: 0,
        totalAmount: 0,//总金额
        actualAmount: 0,//实际费用，根据各费用计算得出
        payAmount: 0,//支付金额
        discountFee: 0,//优惠费用
        detail: null,
        pickUpObj: null,//取车
        returnObj: null,//还车
        day: 0,
        //通告栏文本
        movable: {
            text: ''
        },
        // 取车
        pickUpConfig: {
            show: false,
            value: [0, 15],
            year: [],
            time: []
        },
        //用车需求
        useCarConfig: {
            show: false,
            value: [0, 0],
            time: [],
            km: []
        },
        time: '08:00',
        addresses: [{
            time: '',
            address: "",
            title: "扎花集合地址",
            desc: "【点击设置】扎花集合地址",
            location: null
        },
        {
            time: '',
            address: "",
            title: "新娘所在地址",
            desc: "【点击设置】新娘所在地址",
            location: null
        },
        {
            time: '',
            address: "",
            title: "新房所在地址",
            desc: "【点击设置】新房所在地址",
            location: null
        },
        {
            time: '',
            address: "",
            title: "外景拍摄地址",
            desc: "【点击设置】外景拍摄地址",
            location: null
        },
        {
            time: '',
            address: "",
            title: "婚宴酒店地址",
            desc: "【点击设置】婚宴酒店地址",
            location: null
        }]
    },
    loadData(id) {
        var that = this;
        var url = app.globalData.siteRoot + "/api/services/app/car/GetCarAllInfoByIdIsHunToMiniAsync";
        var userInfo = wx.getStorageSync('userInfo');
        var params = {
            id: id,
            startDate: app.globalData.pickUpCar.Date.FullDate,
            endDate: app.globalData.returnCar.Date.FullDate,
            storeId: app.globalData.pickUpCar.StoreId,
            userId: userInfo.id
        };
        network.requestLoading(url, params, "加载中...", function (res) {
            if (res.result == null || res.result.id == 0) {
                wx.showModal({
                    title: "提示",
                    content: "此车辆不存在或已下架，去看看其它车辆吧！",
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: '/pages/index/index',
                                success: function (res) {
                                    // success
                                }
                            })
                        }
                    }
                })
                return;
            }
            that.setData({
                detail: res.result,
                payMode: res.result.earnestMoney > 0 ? 0 : 1,
                payAmount: res.result.earnestMoney > 0 ? res.result.earnestMoney : res.result.totalAmount
            });
            that.setData({
                movable: {
                    text: ""
                }
            });
            that.initZanNoticeBarScroll('movable');
            that.getMoney();
        });
    },
    //弹出费用明细
    togglePopup() {
        this.setData({
            showPopup: !this.data.showPopup
        })
    },
    //支付方式
    changePayMode() {
        var payMode = this.data.payMode == 0 ? 1 : 0;
        this.setData({
            payMode: payMode,
        });
        this.getMoney();
    },
    //计算金额
    getMoney() {
        var that = this;
        var totalAmount = 0;
        var actualAmount = 0;
        var day = that.data.day;
        var car = that.data.detail;
        var discountFee = that.data.discountFee;
        var totalBeyond10KmFee = 0;
        var totalBeyondHourFee = 0;
        actualAmount += car.totalAmount;//租车费
        totalBeyond10KmFee = car.beyond10KmFee * that.data.beyondKm / 10;//每超出10公里费用
        actualAmount += totalBeyond10KmFee;
        totalBeyondHourFee = car.beyondHourFee * that.data.beyondHour;//每超出1小时费用
        actualAmount += totalBeyondHourFee;
        actualAmount += car.otherFee;//其它费用
        totalAmount = actualAmount;//总费用
        actualAmount -= discountFee;//折扣费用
        //支付金额
        var payAmount = this.data.detail.earnestMoney;
        if (that.data.payMode == 1) {
            payAmount = actualAmount;
        }
        that.setData({
            actualAmount: actualAmount,
            payAmount: payAmount,
            totalAmount: totalAmount,
            totalBeyond10KmFee: totalBeyond10KmFee,
            totalBeyondHourFee: totalBeyondHourFee
        });
        console.log("totalAmount:", totalAmount);
        console.log("actualAmount:", actualAmount);
        console.log("payAmount:", payAmount);
    },
    tobuy(event) {
        var that = this;
        console.log('[zan:field:submit]', event.detail.value);
        var fullName = event.detail.value.name;
        var mobile = event.detail.value.tel;
        var formId = event.detail.formId;
        app.commitFormId(formId);
        //验证
        if (fullName == "") {
            wx.showToast({
                title: '请填写姓名！',
                icon: 'success',
                duration: 1500
            })
            return;
        }
        if (mobile == "") {
            wx.showToast({
                title: '请填写手机号码！',
                icon: 'success',
                duration: 1500
            })
            return;
        }
        if (mobile.length != 11) {
            wx.showToast({
                title: '手机号必须11位！',
                icon: 'success',
                duration: 1500
            })
            return;
        }
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            wx.showToast({
                title: '手机号有误！',
                icon: 'success',
                duration: 1500
            })
            return;
        }
        //验证地址
        var addresses = that.data.addresses;
        for (var i = 0; i < addresses.length; i++) {
            if (addresses[i].address == "") {
                wx.showToast({
                    title: '还有地址未完善',
                    icon: 'success',
                    duration: 1500
                })
                return;
            }
        }
        //显示出公告，再次提醒
        if (that.data.movable.text != '') {
            wx.showModal({
                title: '公告',
                content: that.data.movable.text,
                success: function (res) {
                    if (res.confirm) {
                        that.submitOrder(fullName, mobile);
                    } else if (res.cancel) {
                        return;
                    }
                }
            });
        } else {
            that.submitOrder(fullName, mobile);
        }


    },
    //提交订单
    submitOrder(fullName, mobile) {
        var that = this;
        var user = wx.getStorageSync('userInfo');
        var allianceId = wx.getStorageSync("allianceId");
        var url = app.globalData.siteRoot + "/api/services/app/reservation/CreateReservationToMiniAsync";
        console.log("取车对象=>", app.globalData.pickUpCar);
        console.log("还车对象=>", app.globalData.returnCar);
        var ops = {
            "pickUpDate": app.globalData.pickUpCar.Date.FullDate,
            "pickUpTime": app.globalData.pickUpCar.Time,
            "pickUpStoreId": app.globalData.pickUpCar.StoreId,
            "day": app.globalData.day,
            "returnDate": app.globalData.returnCar.Date.FullDate,
            "returnTime": app.globalData.returnCar.Time,
            "returnStoreId": app.globalData.returnCar.StoreId,
            "fullName": fullName,
            "mobilePhone": mobile,
            "rentalFees": that.data.detail.totalAmount,//租车费
            "totalAmount": that.data.totalAmount,//总费用，不包括优惠费用
            "actualAmount": that.data.actualAmount,//实际费用
            "discountFee": that.data.discountFee,//优惠费用
            "carId": that.data.carId,
            "weixinUserId": user.id,
            "paymentTypes": that.data.payMode == 0 ? 1 : 0,
            "allianceId": allianceId,
            "address": JSON.stringify(that.data.addresses),
            "kmNum": app.globalData.useCar.Km.km,
            "hourNum": app.globalData.useCar.Time.time
        };
        network.requestLoading(url, ops, "正在提交...", function (res) {
            var id = res.result.id;
            wx.showToast({
                title: '订单已提交',
                icon: 'success',
                duration: 2000,
                success: function () {
                    //跳转到订单详情页
                    wx.redirectTo({
                        url: '../order/order-detail/order-detail?id=' + id,
                    })
                }
            })
        });
    },
    //打开地图查看位置  取车门店
    openLocation: function (e) {
        var latitude = parseFloat(e.currentTarget.dataset.latitude);
        var longitude = parseFloat(e.currentTarget.dataset.longitude);
        var name = e.currentTarget.dataset.name;
        var address = e.currentTarget.dataset.address;
        console.log("纬度:" + latitude);
        console.log("经度:" + longitude);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: name,
            address: address,
            scale: 28
        })
    },
    loadDateAndWeek: function () {
        var that = this;
        var myDate = new Date();
        //取车日期，(当前日期+1)+60天

        var dates = ext.getDateAndWeek(myDate);
        var times = ext.getTimes();
        var uts = useCarExt.getTimes();
        var kms = useCarExt.getKms();

        this.setData({
            "pickUpConfig.year": dates,
            "pickUpConfig.time": times,
            "useCarConfig.time": uts,
            "useCarConfig.km": kms,
            'useCarConfig.value': [7, 1]
        });
        //取车时间 缓存
        wx.setStorageSync("getDate", dates[0].FullDate);
    },
    //左边时间选择
    pickUpClick: function (e) {

        this.setData({
            'pickUpConfig.show': true
        });
        //app.aldstat.sendEvent('取车时间点击');
    },
    //把值存到缓存
    pickUpChange(e) {
        console.log(e);
        var date = this.data.pickUpConfig.year[e.detail.value[0]].FullDate
        console.log(date);
        //取车时间 缓存
        wx.setStorageSync("getDate", date)
        //还车时间列表重新生成
        var dates = ext.getDateAndWeek(date);
        this.setData({
            'pickUpConfig.value': e.detail.value,
        });
    },
    //隐藏取车日期选择框
    pickUpHideDate() {
        this.setData({
            'pickUpConfig.show': false
        });
    },
    //取车时间取消
    pickUpCancel: function () {
        this.pickUpHideDate();
    },
    //取车时间确定
    pickUpOk: function () {
        this.pickUpHideDate();
    },
    //右边时间选择
    useCarClick: function (e) {
        this.setData({
            'useCarConfig.show': true
        });
    },
    useCarChange(e) {
        console.log(e.detail);
        var date2 = this.data.useCarConfig.time
        console.log(date2);

        this.setData({
            'useCarConfig.value': e.detail.value,
        });
    },
    ////隐藏还车日期选择框
    useCarHideDate() {
        this.setData({
            'useCarConfig.show': false
        });
    },
    //还车时间取消
    useCarCancel: function () {
        this.useCarHideDate();
    },
    //还车时间确定
    useCarOk: function () {
        this.useCarHideDate();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(options);
        var id = options.carId;
        //判断是否超公里超小时
        var beyondKm = 0;
        var beyondHour = 0;
        var km = app.globalData.useCar.Km.km - 60;
        if (km <= 0) {
            beyondKm = 0;
        } else {
            beyondKm = km;
        }
        var hour = app.globalData.useCar.Time.time - 8;
        if (hour <= 0) {
            beyondHour = 0;
        } else {
            beyondHour = hour;
        }
        that.loadData(id);
        that.loadDateAndWeek();
        that.setData({
            carId: id,
            pickUpObj: app.globalData.pickUpCar,
            returnObj: app.globalData.returnCar,
            day: app.globalData.day,
            useCarDate: app.globalData.pickUpCar.Date.FullDate + " " + app.globalData.pickUpCar.Date.Week + " " + app.globalData.pickUpCar.Time,
            useCarStr: app.globalData.useCar.Time.timeStr + app.globalData.useCar.Km.kmStr,
            beyondKm: beyondKm,
            beyondHour: beyondHour
        });
        console.log("还车对象：", app.globalData.returnCar);
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
        this.loadData(this.data.carId);
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


    _handleZanFieldChange(e) {
        const { componentId, detail } = e;

        console.log('[zan:field:change]', componentId, detail);
    },
    _handleZanFieldFocus(e) {
        const { componentId, detail } = e;

        console.log('[zan:field:focus]', componentId, detail);
    },
    _handleZanFieldBlur(e) {
        const { componentId, detail } = e;

        console.log('[zan:field:blur]', componentId, detail);
    },
    //显示弹出框 设置地址
    setAddress: function (e) {
        var showName = e.detail.modal;
        var title = e.detail.title;
        this.setData({
            modalName: showName,
            modalTitle: title,
            location: null
        })
    },
    //关闭弹出框 设置地址
    closeModal: function (e) {
        this.setData({
            modalName: null
        })
    },
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },
    //保存弹出框的值
    saveModal: function (e) {
        var that = this;
        var time = e.currentTarget.dataset.time;
        var address = e.currentTarget.dataset.address;
        var title = e.currentTarget.dataset.title;
        console.log(time, address);
        if (time == null) {
            wx.showToast({
                title: '请选择时间',
                icon: 'success',
                duration: 2000
            })
            return;
        }
        if (address == undefined || address == "") {
            wx.showToast({
                title: '请填写地址',
                icon: 'success',
                duration: 2000
            })
            return;
        }
        var addresses = that.data.addresses;
        for (var i = 0; i < addresses.length; i++) {
            if (addresses[i].title == title) {
                addresses[i].time = time;
                addresses[i].address = address;
                addresses[i].location = that.data.location
                break;
            }
        }
        console.log("addressJson", JSON.stringify(addresses));
        that.setData({
            addresses: addresses,
            time: time,
            address: ""
        });
        that.closeModal();
    },
    //打开地图选择地址
    selectAddress: function (e) {
        var that = this;
        wx.chooseLocation({
            success: function (data) {
                var name = data.name;
                var address = data.address;
                that.setData({
                    address: "【" + name + "】" + address,
                    location: data
                })
            }
        });
    }
}))