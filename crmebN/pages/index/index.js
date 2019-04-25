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
    offset: 0,
    title: "玩命加载中...",
    hidden: false,
    haoQiZhuHaoFanBgImg: '',
    haoShuiZhuChuLaiBgImg: '' 
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
          hotListTwo: dataTwo,
          MoreGoods: res.data.data.MoreGoods
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
        var seasonalGoodsCateId, leisureRecreationCateId, MoreGoodsCateId;
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].cate_name == '首页') {
            var child = res.data.data[i].child;
            for(var j = 0; j < child.length; j++){

                  if (child[j].cate_name == '好器煮好饭') {
                    leisureRecreationCateId = child[j].id;
                    that.setData({
                      haoQiZhuHaoFanBgImg: child[j].pic
                    });
                  };
                  if (child[j].cate_name == '好水煮出来' ){
                    seasonalGoodsCateId = child[j].id;
                    that.setData({
                      haoShuiZhuChuLaiBgImg: child[j].pic
                    });
                  };
                  if (child[j].cate_name == '更多商品') {
                    MoreGoodsCateId = child[j].id;
                  };
            }
            break;
          }
        }
        that.getIndexInfo(leisureRecreationCateId, seasonalGoodsCateId, MoreGoodsCateId);
      }
    });
  },
  onReachBottom: function (p) {
    /*var that = this;
    var limit = 20;
    var offset = that.data.offset;
    if (!offset) offset = 1;
    var startpage = limit * offset;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_hot_product?uid=' + app.globalData.uid,
      data: { limit: limit, offset: startpage },
      method: 'POST',
      header: header,
      success: function (res) {
        var len = res.data.data.length;
        for (var i = 0; i < len; i++) {
          that.data.likeList.push(res.data.data[i])
        }
        that.setData({
          offset: offset + 1,
          likeList: that.data.likeList
        });
        if (len < limit) {
          that.setData({
            title: "数据已经加载完成",
            hidden: true
          });
          return false;
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })*/
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