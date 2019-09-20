//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    currentSwiper: 0,   //轮播焦点
    url: app.globalData.urlImages,
    imgUrls: [],
    menus: [],
    indicatorDots: true,//是否显示面板指示点;
    autoplay: true,//是否自动播放;
    interval: 3000,//动画间隔的时间;
    duration: 500,//动画播放的时长;
    indicatorColor: "rgba(51, 51, 51, .3)",
    indicatorActivecolor: "#ffffff",
    MoreGoods: [],
    offset: 1,
    title: "玩命加载中...",
    hidden: false,
    haoQiZhuHaoFanBgImg: [],
    pid: -1,
    top: '-10%',
    /**
     * 走马灯
     */
    text: '应召小程序内用户帐号登录规范调整和优化建议,需要把用户登录改为引导方式，望见谅下',
    marqueePace: .5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left', //滚动方向
    intervalTwo: 20, // 时间间隔
  },
  run: function () {
    let vm = this;
    let interval = setInterval(function () {

      if (vm.data.marqueeDistance > -vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run();
      }
    }, vm.data.intervalTwo);
  },
  setTouchMove: function () {

    var that = this;

    const query = wx.createSelectorQuery()
    query.select('#the-id').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {

      var queryTwo = wx.createSelectorQuery()
      queryTwo.select('#tell').boundingClientRect()
      queryTwo.exec((ress) => {

        that.setData({
          top: res[0].top - ress[0].height - 1 + 'px'
        });
      });

    });


  },
  tell: function () {
    wx.makePhoneCall({
      phoneNumber: '13822580920',
    })

  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  goUrl: function (e) {
    if (e.currentTarget.dataset.url != '#') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  torday: function (e) {
    wx.switchTab({
      url: '/pages/productSort/productSort'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //app.setBarColor();
    var that = this;
    if (options.spid) {
      app.globalData.spid = options.spid
    }
    if (options.scene) app.globalData.spid = options.scene; 
    //app.setUserInfo();

    that.ClassificationListReq();
  },
  getIndexInfo: function (cateIdAll) {

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/new_api/index' + '?cateIdAll=' + cateIdAll,
      method: 'POST',
      header: header,
      success: function (res) {

        var len = res.data.data.all.length;
        var data = res.data.data.all;
        for (var i = 0; i < len; i++) {
          for (var j = 0; j < data[i].length; j++) {
            data[i][j].keyword = data[i][j].keyword.split(',');
          }
        };

        that.setData({
          imgUrls: res.data.data.banner,
          menus: res.data.data.menus,//导航
          haoQiZhuHaoFanBgImg: that.data.haoQiZhuHaoFanBgImg,
          allData: data
        });
        that.setTouchMove();
      }
    })
  },
  delfh: function (str) {
    var str2 = '';
    str = str.replace(",,", ",");
    if (str.substring(str.length - 1, str.length) == ",") {
      str2 = str.substring(0, str.length - 1);
      this.delfh(str2);
    } else {
      str2 = str;
    }
    return str2;
  },
  ClassificationListReq: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/new_api/get_product_category',
      method: 'POST',
      header: header,
      success: function (res) {
        var seasonalGoodsCateId, leisureRecreationCateId;
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].cate_name == '首页') {
            var child = res.data.data[i].child;
            var strId = '';

            for (var j = 0; j < child.length; j++) {

              strId += child[j].id + ',';
              that.data.haoQiZhuHaoFanBgImg.push(child[j].pic);

            };

            break;
          }
        }
        that.getIndexInfo(that.delfh(strId));
        //下面为更多商品获取
        that.data.pid = that.ClassificationListReqID(res.data.data, ['首页']);
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/new_api/pidStoreCategoryGetSonAllStore' + '?pid=' + that.data.pid,
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