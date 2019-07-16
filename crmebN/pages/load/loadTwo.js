var app = getApp();
Page({
  data: {
    logo: '',
    name: '',
    url: app.globalData.url,
    lgFlag: false,
  },
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
    this.setData({ lgFlag: false });
  },
  getEnterLogo: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/login/get_enter_logo',
      method: 'post',
      dataType  : 'json',
      success: function (res) {
        that.setData({
          logo: res.data.data.site_logo,
          name: res.data.data.site_name
        })
      }
    })
  },
  //获取用户信息并且授权
  /*getUserInfo: function(e){
    var userInfo = e.detail.userInfo;
    
    if (!userInfo){
      wx.showToast({
        title: "获取用户授权信息失败",
        icon: 'none',
        duration: 2000
      });
      return;
    };

    userInfo.spid = app.globalData.spid;

    wx.login({
      success: function (res) {
        if (res.code) {
          userInfo.code = res.code;
          wx.request({
            url: app.globalData.url + '/routine/login/index',
            method: 'post',
            dataType  : 'json',
            data: {
              info: userInfo
            },
            success: function (res) {
            
              app.globalData.uid = res.data.data.uid;
              app.globalData.openid = res.data.data.routine_openid; 
             
              if (app.globalData.openPages != undefined && app.globalData.openPages.indexOf("/pages/product-con/index") != -1) {//跳转到指定页面
                wx.navigateTo({
                  url: app.globalData.openPages
                })
              } else {//跳转到首页
                if(res.data.data.page){
                    wx.navigateTo({
                        url: res.data.data.page
                    })
                }else{
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
              }
            }
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
  },*/
  indexCode: function (e) {

    var userInfos = e.detail.userInfo;

    if (!userInfos) {
      wx.showToast({
        title: "获取用户授权信息失败",
        icon: 'none',
        duration: 2000
      });
      return;
    };

    userInfos.spid = app.globalData.spid;

    wx.login({
      success: function (res) {
        if (res.code) {
          userInfos.code = res.code;
          wx.request({
            url: app.globalData.url + '/routine/login/index',
            method: 'post',
            dataType  : 'json',
            data: {
              info: userInfos
            },
            success: function (res) {

              if (res.data.code == 200) {
                app.globalData.uid = res.data.data.uid;
                app.globalData.openid = res.data.data.routine_openid;

                if (app.globalData.openPages != undefined && app.globalData.openPages.indexOf("/pages/product-con/index") != -1) {//跳转到指定页面
                  wx.navigateTo({
                    url: app.globalData.openPages
                  })
                } else {//跳转到首页
                  if (res.data.data.page) {
                    wx.navigateTo({
                      url: res.data.data.page
                    })
                  } else {
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                };
              } else {
                wx.showToast({
                  title: "rt/lg/index失败",
                  icon: 'none',
                  duration: 2000
                });
              };


            }
          });
        } else {
          wx.showToast({
            title: "获取code失败",
            icon: 'none',
            duration: 2000
          });
        };
      },
      fail: function () {
        wx.showToast({
          title: "获取code失败",
          icon: 'none',
          duration: 2000
        });
      }
    });

  },
  getUserInfo: function (e) {
    var userInfo = {};
    userInfo.spid = app.globalData.spid;
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          userInfo.code = res.code;
          wx.request({
            url: app.globalData.url + '/routine/login/find',
            method: 'post',
            dataType  : 'json',
            data: {
              info: userInfo
            },
            success: function (res) {

              if (res.data.code == 200) {
                app.globalData.uid = res.data.data.uid;
                app.globalData.openid = res.data.data.routine_openid;

                if (app.globalData.openPages != undefined && app.globalData.openPages.indexOf("/pages/product-con/index") != -1) {//跳转到指定页面
                  wx.navigateTo({
                    url: app.globalData.openPages
                  })
                } else {//跳转到首页
                  if (res.data.data.page) {
                    wx.navigateTo({
                      url: res.data.data.page
                    })
                  } else {
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                };
              } else {
                wx.showToast({
                  title: "登录失败,请授权",
                  icon: 'none',
                  duration: 2000
                });
                that.setData({ lgFlag: true });

              };

            }
          });
        } else {
          wx.showToast({
            title: "获取code失败",
            icon: 'none',
            duration: 2000
          });
        }
      }, fail: function () {
        wx.showToast({
          title: "获取code失败",
          icon: 'none',
          duration: 2000
        });
      }
    });

  }
})