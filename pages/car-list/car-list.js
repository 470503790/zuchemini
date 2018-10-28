const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
var network = require("../../utils/network.js")
// pages/cat-list/cat-list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: 0,
        cars: [],
        car: {},
        showPopup: false,
        useCarDate: null,//用车日期
        useCarStr: null,//用车需求
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            day: app.globalData.day,
            useCarDate: app.globalData.pickUpCar.Date.FullDate,
            useCarStr: app.globalData.useCar.Time.timeStr + app.globalData.useCar.Km.kmStr
        });
        console.log(app.globalData.useCar.Time + "," + app.globalData.useCar.Km);
    },
    loadData: function () {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        console.log("userinfo:", userInfo);
        var url = app.globalData.siteRoot + "/api/services/app/car/GetCarsByHunToMiniAsync";
        var params = {
            startDate: app.globalData.pickUpCar.Date.FullDate,
            pickUpStoreId: app.globalData.pickUpCar.StoreId,
            km: app.globalData.useCar.Km.km,
            hour: app.globalData.useCar.Time.time
        };
        network.requestLoading(url, params, "加载中...", function (res) {
            that.setData({
                cars: res.result
            })
        });


    },
    share(e) {
        app.aldstat.sendEvent('分享按钮')
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/share/share?id=' + id + "&startDate=" + app.globalData.pickUpCar.Date.FullDate + "&endDate=" + app.globalData.returnCar.Date.FullDate,
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
        var that = this;
        this.loadData();
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
        var that = this;
        this.loadData();


    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    showCarInfo: function (e) {
        var that = this;
        console.info("显示车信息");
        var id = e.currentTarget.dataset.id;
        console.log("id=>" + id);

        var url = app.globalData.siteRoot + "/api/services/app/car/GetCarToMiniAsync";
        var params = {
            id: id,
            startDate: app.globalData.pickUpCar.Date.FullDate,
            endDate: app.globalData.returnCar.Date.FullDate,
            km: app.globalData.useCar.Km.km,
            hour: app.globalData.useCar.Time.time
        };
        network.requestLoading(url, params, "加载中...", function (res) {
            that.setData({
                car: res.result,
                showPopup: !that.showPopup
            });
        });

    },
    hideCarInfo: function () {
        var that = this;
        that.setData({
            showPopup: !that.data.showPopup
        })
    },
    //预约跳转
    click_go: function (e) {
        var that = this;
        var formId = e.detail.formId;
        app.commitFormId(formId);
        console.log(e);
        //判断是否登陆
        var user = wx.getStorageSync('userInfo');
        if (user == "") {
            //var url = "/pages/car-list/car-list----startDate---"+that.data.options.startDate+">endDate---"+that.data.options.endDate+">day---"+that.data.options.day;
            var url = "/pages/car-list/car-list";
            var jumpType = "redirectTo";
            console.log("url", url);
            wx.navigateTo({
                url: '/pages/login/login?url=' + url + '&jumpType=' + jumpType,
            });
        } else {

            //点击预约前，检查是否能下单
            var url = app.globalData.siteRoot + '/api/services/app/Reservation/IsCanOrder';
            var params = {
                userId: user.id
            }
            network.requestLoading(url, params, "加载中...", function (res) {
                //弹出提示框
                if (res.result == false) {
                    wx.showModal({
                        title: "提示",
                        content: "您有一个订单在进行中,无法再次下单！",
                        showCancel: false
                    })
                } else {
                    var carId = e.currentTarget.dataset.id;
                    console.log("carId=>" + carId);
                    wx.navigateTo({
                        url: '../reservation/reservation?carId=' + carId
                    })
                }
            });



        }


    },
    //去反馈
    click_goOpinion: function () {
        wx.navigateTo({
            url: '/pages/help/opinion/opinion',
        })
    },
    calendar: function (e) {
        var carId = e.currentTarget.dataset.id;
        console.log("汽车id", carId);
        var cars = this.data.cars;
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].id == carId) {
                cars[i].isShowCalendar = !cars[i].isShowCalendar;
                break;
            }
        }
        this.setData({
            cars: cars
        })
    }
})