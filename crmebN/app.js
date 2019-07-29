//app.js
var app = getApp();
// var wxh = require('../../utils/wxh.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
  /*  var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)*/
   // that.getRoutineStyle();
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        try {
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        } catch (err) {
          this.globalData.CustomBar = 64;
        }
      }
    });
  },
  globalData: {
    routineStyle:'#ffffff',
    uid: null,
    openid:'',
    openPages:'',
    spid:0,
    urlImages: '',
    url: 'https://obs.largehill.net'
  },
  getRoutineStyle:function(){
    var that = this;
    wx.request({
      url: that.globalData.url + '/routine/login/get_routine_style',
      method: 'post',
      dataType  : 'json',
      success: function (res) {
        that.globalData.routineStyle = res.data.data.routine_style;
        that.setBarColor();

      }
    })
  },
  setBarColor:function(){
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: that.globalData.routineStyle,
    })
  },
  setUserInfo : function(){
    var that = this;
    if (that.globalData.uid == null) {//是否存在用户信息，如果不存在跳转到首页
       wx.showToast({
         title: '需要先登录',
         icon: 'none',
         duration: 1500,
       })
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/user/user',
        })
      }, 1500)
    }
  },
})