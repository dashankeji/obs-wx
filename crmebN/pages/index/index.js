//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    currentSwiper: 0,   //轮播焦点
    url: app.globalData.urlImages,
    imgUrls:[],
    menus:[],
    indicatorDots: true,//是否显示面板指示点;
    autoplay: true,//是否自动播放;
    interval: 3000,//动画间隔的时间;
    duration: 500,//动画播放的时长;
    indicatorColor: "rgba(51, 51, 51, .3)",
    indicatorActivecolor: "#ffffff",
    hotList: [],
    hotListTwo: [],
    MoreGoods: [],
    offset: 1,
    title: "玩命加载中...",
    hidden: false,
    haoQiZhuHaoFanBgImg: '',
    haoShuiZhuChuLaiBgImg: '',
    pid: -1
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  goUrl:function(e){
    if (e.currentTarget.dataset.url != '#'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  torday:function(e){
    wx.switchTab({
      url: '/pages/productSort/productSort'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    var that = this;
    if (options.spid){
      app.globalData.spid = options.spid
    }
    app.setUserInfo();
    
    that.ClassificationListReq();
  },
  getIndexInfo:function(cateIdOne,cateIdTwo,cateIdThree){
    var cateIdOne = cateIdOne ||  -1;
    var cateIdTwo = cateIdTwo || -1;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/index?uid=' + app.globalData.uid + '&cateId_one=' + cateIdOne + '&cateId_two=' + cateIdTwo + '&cateId_Three=' + cateIdThree,
      method: 'POST',
      header: header,
      success: function (res) {
        var data = res.data.data.leisureRecreation;
        var len = data.length;
        for(var i =0;i<len;i++){
          data[i].keyword = data[i].keyword.split(',');
        };
        var dataTwo = res.data.data.seasonalGoods;
        var len = dataTwo.length;
        for (var j = 0; j < len; j++) {
          dataTwo[j].keyword = dataTwo[j].keyword.split(',');
        };

        that.setData({
          imgUrls: res.data.data.banner,
          menus: res.data.data.menus,//导航
          hotList: data,//热卖单品
          hotListTwo: dataTwo
        })
      }
    })
  },
  ClassificationListReq: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_product_category?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        var seasonalGoodsCateId, leisureRecreationCateId;
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].cate_name == '首页') {
            var child = res.data.data[i].child;
            for(var j = 0; j < child.length; j++){

                  if (j == 0) {
                    leisureRecreationCateId = child[j].id;
                    that.setData({
                      haoQiZhuHaoFanBgImg: child[j].pic
                    });
                  };
                  if ( j== 1 ){
                    seasonalGoodsCateId = child[j].id;
                    that.setData({
                      haoShuiZhuChuLaiBgImg: child[j].pic
                    });
                  };
            }
            break;
          }
        }
        that.getIndexInfo(leisureRecreationCateId, seasonalGoodsCateId,-1);
        //下面为更多商品获取
        that.data.pid = that.ClassificationListReqID(res.data.data, ['首页']);
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/auth_api/pidStoreCategoryGetSonAllStore?uid=' + app.globalData.uid + '&pid=' + that.data.pid,
          data: { limit: 8, offset: 0 },
          method: 'POST',
          header: header,
          success: function (res) {
             that.setData({
               MoreGoods: res.data.data
             });
          }
        });

      }
    });
  },
  onReachBottom: function (p) {
    var that = this;
    var limit = 8;
    var offset = limit * that.data.offset++;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/pidStoreCategoryGetSonAllStore?uid=' + app.globalData.uid + '&pid=' + that.data.pid,
      data: { limit: limit, offset: offset },
      method: 'POST',
      header: header,
      success: function (res) {
        var len = res.data.data.length;

        if (len < 1) {
          --that.data.offset;
          wx.showToast({
            title: '数据已经加载到尽头了',
            icon: 'none',
            duration: 2000
          });
          return false;
        };
        that.data.MoreGoods = that.data.MoreGoods.concat(res.data.data);
        that.setData({
          MoreGoods: that.data.MoreGoods
        });

      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    });
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
  ClassificationListReqID: function (arr, arrName) {    //获取分类id
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].cate_name == arrName[0] && arrName.length == 1) {
        return arr[i].id;
      }
      if (arr[i].cate_name == arrName[0] && arr[i].child) {
        arrName.splice(0, 1);
        return this.ClassificationListReqID(arr[i].child, arrName);
      }
    }
    return -1;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '小程序',
      path: '/pages/index/index?spid=' + app.globalData.uid,
      // imageUrl: that.data.url + that.data.product.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})