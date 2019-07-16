const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    bgImgUrl: '',
    bgTwoImgUrl: '',
    storeImgUrl: '',
    qrCodeImgUrl: '',
    code: '',
    options: [],
    openImageSettingFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getQrCode: function (imgUrl) {
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_storeXiangQing_code?uid=' + app.globalData.uid + '&store_id=' + that.data.options.id,
        method: 'get',
        header: header,
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              code: res.data.msg
            });
            that.storeImgDownloadFile(imgUrl, "商品图片");
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 0
            });
            that.setData({
              code: ''
            });
            that.storeImgDownloadFile(imgUrl, "商品图片");
          }
        }
      });
    },
    savaImageClick: function () {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
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
          })
        }
      });
    },
    onLoad: function (options) {
      this.data.options = options;
      var imgUrl = options.imgUrl;
      if (imgUrl == undefined) {
        wx.showToast({
          title: '没有商品图片资源',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      imgUrl = imgUrl.replace('http://', 'https://');
      wx.showLoading({
        title: '下载图片资源中...',
      });
      this.getQrCode(imgUrl);
    },
    bgImgDownloadFile: function (imgUrl, text) {
      var that = this;
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {

          if (res.statusCode === 200) {
            that.data.bgImgUrl = res.tempFilePath;
            that.bgTwoImgDownloadFile(app.globalData.url + "/public/uploads/shangPingCode/03.png", "背景2图片");
          } else {
            wx.showToast({
              title: text + '下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                that.bgTwoImgDownloadFile(app.globalData.url + "/public/uploads/shangPingCode/03.png", "背景2图片");
              }
            })
          }
        }
      });
    },
    bgTwoImgDownloadFile: function (imgUrl, text) {
      var that = this;
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {

          if (res.statusCode === 200) {
            that.data.bgTwoImgUrl = res.tempFilePath;
            that.getQrCodeDownloadFile(that.data.code, "二维码图片");
          } else {
            wx.showToast({
              title: text + '下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                that.getQrCodeDownloadFile(that.data.code, "二维码图片");
              }
            })
          }
        }
      });
    },
    storeImgDownloadFile: function (imgUrl, text) {
      var that = this;
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {

          if (res.statusCode === 200) {
            that.data.storeImgUrl = res.tempFilePath;
            that.bgImgDownloadFile(app.globalData.url + "/public/uploads/shangPingCode/123456.png", "背景图片");
          } else {
            wx.showToast({
              title: text + '下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                that.bgImgDownloadFile(app.globalData.url + "/public/uploads/shangPingCode/123456.png", "背景图片");
              }
            })
          }
        }
      });
    },
    getQrCodeDownloadFile: function (imgUrl, text) {
      var that = this;
      wx.downloadFile({
        url: imgUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode === 200) {
            that.data.qrCodeImgUrl = res.tempFilePath;
            that.drawCanvas(that.data.options);
          } else {
            wx.showToast({
              title: text + '下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                that.drawCanvas();
              }
            })
          };
          wx.showToast({
            title: '正在绘制图片',
            icon: 'none',
            duration: 1000,
          });
        }
      });
    },
    drawCanvas: function (options) {
      var that = this;
      var storeImgUrl = that.data.storeImgUrl;

      var query = wx.createSelectorQuery();
      query.select('#canvas-container').boundingClientRect(function (rect) {

        var height = rect.height;
        var right = rect.right;
        var left = rect.left + 5;
        var width = rect.width * 0.8;
        var Y = 0;
        var X = (rect.width - width) / 2;

        const ctx = wx.createCanvasContext('myCanvas');


        ctx.drawImage(that.data.bgImgUrl, 0, 0, rect.width, height);

        ctx.setFillStyle('#fff');
        ctx.fillRect(X, 20, width, width);
        ctx.drawImage(storeImgUrl, (rect.width - width) / 2, 20, width, width);

        Y = width + 20;
        ctx.setFillStyle('#fff');
        ctx.fillRect(X, Y, width, width / 4);

        ctx.font = 'normal bold 16rpx sans-serif';
        ctx.setFillStyle('black');
        ctx.setTextAlign('left');

        var storeNameArray = options.store_name.split("");
        var temp = '';

        for (var l = 0; l < storeNameArray.length; l++) {
          if (ctx.measureText(temp).width + 8 * l + 8 < width) {
            temp += storeNameArray[l];
          } else {
            temp += '...';
            break;
          };
        };

        ctx.fillText(temp, X + 8, Y + 20);

        Y = Y + width / 4 - 10;
        ctx.font = 'normal bold 22rpx sans-serif';
        ctx.setFillStyle('red');
        ctx.setTextAlign('left');
        ctx.fillText('￥' + options.price, X + 8, Y);

        ctx.setFontSize(14);
        ctx.setFillStyle('#ccc');
        ctx.setTextAlign('right');
        ctx.fillText('原价: ￥' + options.ot_price, width + X - 8, Y);


        var newWidth = width + X + 15;
        ctx.drawImage(that.data.bgTwoImgUrl, (rect.width - newWidth) / 2, height - width / 1.5 - X / 2, newWidth, width / 1.5);


        ctx.save();

        ctx.beginPath(); //开始绘制
        //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
        ctx.arc(width / 2.5 / 2 + (rect.width - newWidth) / 2 + X / 1.5, width / 2.5 / 2 + (height - width / 1.5), width / 2.5 / 2, 0, Math.PI * 2, false);
        ctx.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
        ctx.drawImage(that.data.qrCodeImgUrl, (rect.width - newWidth) / 2 + X / 1.5, height - width / 1.5, width / 2.5, width / 2.5);
        ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制

        ctx.draw();
      }).exec();
    },
  }
})
