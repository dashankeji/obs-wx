var app = getApp();
var wxh = require('../../utils/wxh.js');
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  CustomBar: app.globalData.CustomBar,
  url: app.globalData.urlImages,
  userinfo:[],
  orderStatusNum:[],
  bannerImgData:[],
  coupon:'',
  collect:'',
  ListTitleData: {               //付款状态下面的列表数据
      0: [{ title: '我的积分' }, { title: '我的拼团' }, { title: '我的秒杀' }],
      1: [
        {
          titleList: [{ title: '收货地址', link: '../shouhuodizhi/shouhuodizhi' }, { title: '全部订单', link: '../dingdanliebiao/dingdanliebiao' }]
        },
        {
          titleList: [{ title: '我的收藏', link: '../wodeshoucang/wodeshoucang' }, { title: '在线客服' }]
        }
      ]
    }
  },

  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        that.setData({
          userinfo: res.data.data,
          orderStatusNum: res.data.data.orderStatusNum
        })
      }
    });

    wx.request({
      url: app.globalData.url + '/routine/auth_api/gerenzhongxinbgget?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
  
        that.setData({
          bannerImgData: res.data[0]
        });
      }
    });
  },
  goNotification:function(){
      wx.navigateTo({
        url: '/pages/news-list/news-list',
      })
  },
  onShow: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        that.setData({
          userinfo: res.data.data,
          orderStatusNum: res.data.data.orderStatusNum
        })
      }
    });
  },
  /**
   * 生命周期函数--我的财富 
   */
  caiFuClick: function(){
    wx.navigateTo({
      url: '/pages/wodecaifu/wodecaifu'
    })
  },
  /**
   * 生命周期函数--我的购物车
   */
  gowucheClick: function () {
    wx.switchTab({
      url: '/pages/buycar/buycar'
    })
  },
   /**
   * 生命周期函数--我的足迹
   */
  footprint:function(){
    wx.navigateTo({
      url: '/pages/zuji/zuji'
    })
  },
   /**
   * 生命周期函数--我的余额
   */
  money:function(){
    wx.navigateTo({
      url: '/pages/main/main?now=' + this.data.userinfo.now_money + '&uid='+app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的积分
   */
  integral: function () {
    wx.navigateTo({
      url: '/pages/integral-con/integral-con?inte=' + this.data.userinfo.integral + '&uid=' + app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
 * 生命周期函数--拼团
 */
  pintuanClick: function () {
    
    wx.navigateTo({
      url: '/pages/pintuan/pintuan'
    })
  },
   /**
   * 生命周期函数--秒杀
   */
  miaoshaClick: function(){
    wx.navigateTo({
      url: '/pages/miaosha/miaosha'
    })
  },
   /**
   * 生命周期函数--我的优惠卷
   */
  coupons: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的收藏
   */
  collects: function () {
    wx.navigateTo({
      url: '/pages/wodeshoucang/wodeshoucang',
    })
  },
  /**
 * 生命周期函数--全部订单
 */
  quanbudingdanClick: function () {
    wx.navigateTo({
      url: '/pages/orders-list/orders-list',
    })
  },
  /**
   * 生命周期函数--收货地址
   */
  shouhuodizhiClick: function(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
   /**
   * 生命周期函数--我的推广人
   */
  extension:function(){
    wx.navigateTo({
      url: '/pages/feree/feree',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的推广
   */
  myextension: function () {
    wx.navigateTo({
      url: '/pages/extension/extension',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的砍价
   */
  // cut_down_the_price:function(){
  //   wx.navigateTo({
  //     url: '../../pages/feree/feree',
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // }
})