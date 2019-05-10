// pages/promotion-card/promotion-card.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    url: app.globalData.url,
    code: '',
    userinfo: app.globalData,
    GB_fontSize: 12,
    QrCodeHeight: 0,
    canvasTempFilePath: '',
    openImageSettingFlag: false
  },
  getQrCode: function (avaterSrc, code) {
    var codeSrc = '';
    var that = this;

    wx.downloadFile({
      url: code,
      success: function (res) {

        if (res.statusCode === 200) {
          codeSrc = res.tempFilePath;
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000
          });
        }
        wx.showToast({
          title: '正在生成',
          icon: 'none',
          duration: 1000
        });


        var query = wx.createSelectorQuery();
        query.select('#canvas-container').boundingClientRect(function (rect) {

          var height = rect.height;
          var right = rect.right;
          var left = rect.left + 5;
          var width = rect.width * 0.6;
          var Y = 0;

          const ctx = wx.createCanvasContext('myCanvas');

          ctx.setFillStyle('#fff');
          ctx.fillRect(0, 0, rect.width, height);

          Y = 20;

          ctx.drawImage(avaterSrc, (rect.width - width / 2) / 2, Y, width / 2, width / 2);

          ctx.setFontSize(that.data.GB_fontSize + 2);
          ctx.setFillStyle('black');
          ctx.setTextAlign('left');
          Y = width / 2 + 20 + 25;
          ctx.fillText(that.data.userinfo.nickname, (rect.width - ctx.measureText(that.data.userinfo.nickname).width) / 2, Y);

          Y = Y + 25
          ctx.drawImage(codeSrc, (rect.width - width) / 2, Y, width, width);

          ctx.setFontSize(that.data.GB_fontSize - 1);
          ctx.setFillStyle('#999999');
          ctx.setTextAlign('left');
          Y = height - 40;
          // (canvas.width - context.measureText(str).width) / 2
          ctx.fillText("使用微信扫描二维码关注小程序", (rect.width - ctx.measureText("使用微信扫描二维码关注小程序").width) / 2, Y);

          ctx.draw(false, function () {
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: function (res) {
                that.data.canvasTempFilePath = res.tempFilePath;
              },
              fail: function (res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          });
        }).exec();
      }
    });
  },
  previewImageClick: function () {

    if (this.data.code.length < 2) {
      wx.showToast({
        title: '二维码图片获取失败',
        icon: 'none',
        duration: 2000
      });
    };
    if (this.data.userinfo.length < 1) {
      wx.showToast({
        title: '用户信息获取失败',
        icon: 'none',
        duration: 2000
      });
    };
    var that = this;
    wx.downloadFile({
      url: that.data.userinfo.avatar,
      success: function (res) {

        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath;
          that.getQrCode(avaterSrc, that.data.code);
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              that.getQrCode(avaterSrc = "", that.data.code);//回调另一个图片下载
            }
          })
        }
      }
    });
    that.setData({
      QrCodeHeight: 900
    });
  },
  savaImageClick: function () {
    if (this.data.canvasTempFilePath.length < 1) return;
    var that = this;
    var tempFilePath = this.data.canvasTempFilePath;
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        console.log(111, res);
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) { }
          },
          fail: function (res) {
          }
        });
        that.setData({
          openImageSettingFlag: false
        });
      },
      fail: function (res) {
        wx.showToast({
          title: "请检查相册存储是否授权了或您取消了本次操作或图片有误",
          icon: 'none',
          duration: 2000
        });
        that.setData({
          openImageSettingFlag: true
        });
      }
    });
  },
  canvasPreviewClick: function () {
    if (this.data.canvasTempFilePath.length < 1) return;
    wx.previewImage({
      current: this.data.canvasTempFilePath, // 当前显示图片的http链接
      urls: [this.data.canvasTempFilePath] // 需要预览的图片http链接列表
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();

    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };

    wx.request({
      url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {

          that.setData({
            userinfo: res.data.data
          });
        } else {
          that.setData({
            userinfo: []
          })
        }
      }
    });
    that.getCode();
  },
  getCode: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_code?uid=' + app.globalData.uid,
      method: 'get',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            code: res.data.msg
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 0
          })
          that.setData({
            code: ''
          })
        }
      }
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
})