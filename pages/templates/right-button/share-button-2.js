//页面使用分享按钮时，复制以下事件到页面中

/* //显示分享窗口
showShareModal: function () {
    this.setData({
      ['shareSetting.share_modal_active']: "active",
      no_scroll: !0,
      ['shareSetting.canvas_none']:""
    })
  },
  //关闭分享窗口
  shareModalClose: function () {
    this.setData({
      ['shareSetting.share_modal_active']: "",
      no_scroll: !1
    })
  },
  //生成海报图片
  getGoodsQrcode: function () {
    var that = this;
    //获取二维码
    var url = app.globalData.siteRoot + "/mpa/weixinopen/GetQrCode";
    var params = {
      path: "pages/album-detail/album-detail?id=" + that.data.albumDetail.id
    }
    network.requestLoading(url, params,"准备生成...", function (res) {
      var qrcodePath = res.result.pictureUrl;
      qrcode.get(that.data.albumDetail.pictures[0], that.data.albumDetail.title,
        "", qrcodePath, function (res) {

          that.setData({
            ['shareSetting.goods_qrcode']: res.tempFilePath,
            showSharePic: true,
            ['shareSetting.goods_qrcode_active']: "active",
            ['shareSetting.share_modal_active']: "",
            ['shareSetting.canvas_none']: "canvas_none"
          })
        })
    });

  },
  goodsQrcodeClose: function () {
    this.setData({
      ['shareSetting.goods_qrcode_active']: "",
      no_scroll: !1,
      ['shareSetting.canvas_none']: "canvas_none"
    })
  },
  //保存图片到相册 
  saveGoodsQrcode() {
    var that = this;
    wx.showLoading({
      title: '正在保存图片',
      mask: true,
      success: function () {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareSetting.goods_qrcode,
          success: function (res) {
            console.log("保存图片", res);
            wx.hideLoading();
            wx.showModal({
              title: "已保存到相册",
              content: "请自行分享到朋友圈",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.goodsQrcodeClose();
                }
              }
            })
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              title: "图片保存失败",
              content: res.errMsg,
              showCancel: false
            })
          }
        })
      }
    })
  },
  //预览海报
  goodsQrcodeClick(e) {
    var e = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [e]
    })
  }, */