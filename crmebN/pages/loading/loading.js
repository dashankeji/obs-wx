// pages/load/load.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    name: '',
    url: app.globalData.url,
    flag: true,
    onClickFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.flag = false;
    app.setBarColor();
    if (options.scene) app.globalData.spid = options.scene;  
    that.setSetting();
  },
  onClickGoHelpPage: function(){
      wx.navigateTo({
        url: '/pages/helpPage/index',
      });
  },
  onClicksetSetting: function(){
    this.setData({
       onClickFlag: false
    });
    this.setSetting();
  },
  setSetting: function () {
    var that = this;
    setTimeout(function () {
        that.setData({
          onClickFlag: true
        });
    },7000);

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']){
          wx.navigateTo({
            url: '/pages/load/load',
          })
        }else{
          that.getUserInfo();
        }
      },
      fail: function () {
        wx.showToast({
          title: "获取授权设置失败",
          icon: 'none',
          duration: 2000
        });
        wx.navigateTo({
          url: '/pages/helpPage/index',
        });
      },
    })
  },
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo;
        
        if (!userInfo) {
          wx.showToast({
            title: "获取用户授权信息失败",
            icon: 'none',
            duration: 2000
          });
          return;
        };

        wx.login({
          success: function (res) {
            if (res.code) {
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method: 'post',
                dataType  : 'json',
                data: {
                  info: userInfo
                },
                success: function (res) {
                  that.data.flag = true;
                  app.globalData.uid = res.data.data.uid;
                  if (app.globalData.openPages != undefined && app.globalData.openPages.indexOf("/pages/product-con/index") != -1) {//跳转到指定页面
                    wx.navigateTo({
                      url: app.globalData.openPages
                    })
                  } else {//跳转到首页
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                },
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          },
          fail: function () {
            wx.showToast({
              title: "获取code失败",
              icon: 'none',
              duration: 2000
            });
          },
        })
      },
      fail: function () {
        wx.showToast({
          title: "授权获取失败",
          icon: 'none',
          duration: 2000
        });
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   if(this.data.flag){
    this.setSetting();
   };
  },
})