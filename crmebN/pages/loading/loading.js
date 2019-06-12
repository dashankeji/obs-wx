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
    flag: true
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

  setSetting: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']){
          wx.navigateTo({
            url: '/pages/load/load',
          })
        }else{
          that.getUserInfo();
        }
      }
    })
  },
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo
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
          },
        })
      },
      fail: function () {
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