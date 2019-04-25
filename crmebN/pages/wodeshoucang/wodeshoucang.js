// pages/wodeshoucang/wodeshoucang.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar,
      batchManagementFlag: true,   //批量管理显示和不显示
      allCheckFlag: true,          //全选和不全选判断
      allCheckNum: [],          //所有商品的选择（1）和不选择（0）
      ShoppingAllPid: [],          //商品所有标识id，用来删除的
      allShoppingShouCang:[],       //pid商品所有用户收藏
      ShoppingData: {              
        data: [
        ]
      },
    array: ['低库存', '全部', '失效', '降价中'],
    index: 1,   //全部按钮选中的下标存放，对应array
  },
  searchSubmit: function(e){        //关键字搜索
     //console.log(e.detail.value);
    
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/querycollect_product?uid=' + app.globalData.uid,
      data: { value: e.detail.value },
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
            that.data.ShoppingAllPid = [];
            that.data.allCheckNum = [];
            for (var i = 0; i < res.data.data.length; i++) {
              that.data.allCheckNum[i] = 0;
              res.data.data[i].pid = res.data.data[i].id;
              that.data.ShoppingAllPid[i] = res.data.data[i].id;
            }
            that.data.ShoppingData.data = res.data.data;
            that.setData({
              ShoppingData: that.data.ShoppingData,
              ShoppingAllPid: that.data.ShoppingAllPid,
              allCheckNum: that.data.allCheckNum
            });
            //console.log(that.data.ShoppingAllPid);
            that.shouCangAllShopping();
            return;
         };
         wx.showToast({
          title: '查询失败',
          icon: 'success',
          duration: 1500,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
          duration: 1500,
        })
      },
    });
  },
  get_user_collect_product_lowstock: function(){    //低库存收藏

    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_lowstock?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.data.ShoppingAllPid = [];
          that.data.allCheckNum = [];
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.allCheckNum[i] = 0;
            that.data.ShoppingAllPid[i] = res.data.data[i].pid;
          }
          that.data.ShoppingData.data = res.data.data;
          that.setData({
            ShoppingData: that.data.ShoppingData,
            ShoppingAllPid: that.data.ShoppingAllPid,
            allCheckNum: that.data.allCheckNum
          });
         // console.log(that.data.ShoppingAllPid);
          that.shouCangAllShopping();
          return;
        };
        wx.showToast({
          title: '获取低库存失败',
          icon: 'success',
          duration: 1500,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取低库存失败',
          icon: 'none',
          duration: 1500,
        })
      },
    });
  },
  get_user_collect_product_Invalid: function(){    //失效收藏
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_Invalid?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.data.ShoppingAllPid = [];
          that.data.allCheckNum = [];
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.allCheckNum[i] = 0;
            that.data.ShoppingAllPid[i] = res.data.data[i].pid;
          }
          that.data.ShoppingData.data = res.data.data;
          that.setData({
            ShoppingData: that.data.ShoppingData,
            ShoppingAllPid: that.data.ShoppingAllPid,
            allCheckNum: that.data.allCheckNum
          });
          //console.log(that.data.ShoppingAllPid);
          that.shouCangAllShopping();
          return;
        };
        wx.showToast({
          title: '获取失效失败',
          icon: 'success',
          duration: 1500,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取失效失败',
          icon: 'none',
          duration: 1500,
        })
      },
    });
  },
  get_user_collect_product_cutPrice: function(){
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_cutPrice?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.data.ShoppingAllPid = [];
          that.data.allCheckNum = [];
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.allCheckNum[i] = 0;
            that.data.ShoppingAllPid[i] = res.data.data[i].pid;
          }
          that.data.ShoppingData.data = res.data.data;
          that.setData({
            ShoppingData: that.data.ShoppingData,
            ShoppingAllPid: that.data.ShoppingAllPid,
            allCheckNum: that.data.allCheckNum
          });
          //console.log(that.data.ShoppingAllPid);
          that.shouCangAllShopping();
          return;
        };
        wx.showToast({
          title: '获取降价失败',
          icon: 'success',
          duration: 1500,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取降价失败',
          icon: 'none',
          duration: 1500,
        })
      },
    });
  },
  bindPickerChange: function (e) {     //全部按钮
    //console.log('picker发送选择改变，携带值为', this.data.array[e.detail.value])
    switch (this.data.array[e.detail.value]) {
      case '低库存':
        this.get_user_collect_product_lowstock();
        break;
      case '失效':
        this.get_user_collect_product_Invalid();
        break;
      case '降价中':
        this.get_user_collect_product_cutPrice();
        break;
      default:
        this.getcollect();
    };

    this.setData({
      index: e.detail.value
    })
  },
  batchManagementClick:function(){           //批量管理点击
    this.setData({ batchManagementFlag: !this.data.batchManagementFlag });
  },
  completeClick:function(){                  //完成按钮
    this.setData({ batchManagementFlag: !this.data.batchManagementFlag });
  },
  deleteShoppingClick: function (e) {              //单个删除商品按钮（取消收藏）
   /* var allCheckNum = this.data.allCheckNum;
    var data = this.data.ShoppingData;
    allCheckNum.splice(e.target.dataset.index, 1);
    data.data.splice(e.target.dataset.index, 1);*/

    var that = this;
    var id = e.target.dataset.id;
   // console.log(id);
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_del?uid=' + app.globalData.uid,
      data: { pid: id },
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.getcollect();
        }
      }
    });
  },
  singleCheckClick: function (e) {                   //单个商品选择按钮
    var checkNum = this.data.allCheckNum;
    var index = e.target.dataset.index;
    if (checkNum[index] === 0) {
      checkNum[index] = 1;
    } else {
      checkNum[index] = 0;
    }
    this.setData({
      allCheckNum: checkNum
    });

  },
  allCheckClcik: function () {                     //全选按钮
    var allCheckNum = this.data.allCheckNum;
    var allCheckFlag = this.data.allCheckFlag;
    if (allCheckFlag) {
      for (var i = 0; i < allCheckNum.length; i++) {
        allCheckNum[i] = 1;
      };
    } else {
      for (var i = 0; i < allCheckNum.length; i++) {
        allCheckNum[i] = 0;
      };
    }
    this.setData({
      allCheckFlag: !this.data.allCheckFlag,
      allCheckNum: allCheckNum
    });
  },
  allDeleteShoppingClick: function (e) {         //全选时删除商品按钮
    var that = this;
    var allCheckNum = that.data.allCheckNum;
    var ShoppingAllPid = that.data.ShoppingAllPid;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };

    for (var i = 0; i < allCheckNum.length;) {
        if (allCheckNum[i] === 1) {

          wx.request({
            url: app.globalData.url + '/routine/auth_api/get_user_collect_product_del?uid=' + app.globalData.uid,
            data: { pid: ShoppingAllPid[i] },
            method: 'GET',
            header: header,
            success: function (res) {
            }
          });
          allCheckNum.splice(i, 1);
          ShoppingAllPid.splice(i, 1);
        }else{
          i++;
        };

        wx.showToast({
          title: '正在删除',
          icon: 'success',
          duration: 1200

        });
        setTimeout(()=>{that.getcollect()},1000);
    }
  },
  allDeleteShoppingPid: function(id){    //配合全选删除，请求删除接口
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_del?uid=' + app.globalData.uid,
      data: { pid: id },
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.getcollect();
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUserInfo();
    this.getcollect();
  },
  getcollect: function () {    //我的收藏数据请求
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    }
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          that.data.ShoppingData.data = res.data.data;
          for (var i = 0; i < res.data.data.length; i++){
              that.data.allCheckNum[i] = 0;
              that.data.ShoppingAllPid[i] = res.data.data[i].pid;
          }
          that.shouCangAllShopping();
          that.setData({
            ShoppingData: that.data.ShoppingData,
            allCheckNum: that.data.allCheckNum  
          });
        
        } else {
          // console.log(res);
          that.setData({
            sum: 0
          })
        }
      }
    })
  },
  shouCangAllShopping:function (){    //所有用户收藏pid商品的总数
    var allPid = this.data.ShoppingAllPid.join(',');

    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    }
    wx.request({
      url: app.globalData.url + '/routine/auth_api/ShouCangAllShopping?uid=' + app.globalData.uid +'&product_id=' + allPid,
      method: 'GET',
      header: header,
      success: function (res) {
          
          that.setData({
             allShoppingShouCangres: res.data.split(',')
          })
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