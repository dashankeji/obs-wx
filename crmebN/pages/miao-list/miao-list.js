//index.js
//获取应用实例
const app = getApp()
var wxh = require('../../utils/wxh.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Title: '老金钱龟农庄',
    currentSwiper: 0,   //轮播
    imgUrls: [],        //轮播图片
    hidden: true,
    tabSelectCssFlag: { 0: true, 1: false },   //0为菜单 1为店家
    menuSwitcnDateIndex: 0,          //菜单按钮的下标
    menuSwitcnTitle: [{cate_name: '正在请求'}, {cate_name: '正在请求'}],
    menuSwitcnDate: {},                     //菜单切换的数据
    prostatus: false,
    productSelect: [
      { image: "" },
      { store_name: "" },
      { price: 0 },
      { unique: "" },
      { stock: 0 },
    ],
    attrName: '',
    num: 1,
    shoppingMessage: {id:-1}
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
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].cate_name == '热销产品') {
            var child = res.data.data[i].child;
            that.setData({
              menuSwitcnTitle: res.data.data[i].child,
              menuSwitcnDateIndex: res.data.data[i].child[0].id
            });
            that.menuSwitchClick(null, that.data.menuSwitcnDateIndex);
            break;
          }
        }

      }
    });
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  tabClickMenu: function (e) {       //菜单和店家切换（这里是菜单按钮）
    this.setData({
      tabSelectCssFlag: { 0: true, 1: false }
    });
    this.menuSwitchClick(e);
  },
  tabClickShopOwner: function (e) {    //菜单和店家切换（这里是店家按钮）
    this.setData({
      tabSelectCssFlag: { 0: false, 1: true }
    });
    this.menuSwitchClick(e);
  },
  menuSwitchClick: function (e,id) {          //菜单切换按钮

    var cateId = e ? e.currentTarget.dataset.id : id;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + cateId,
      method: 'POST',
      header: header,
      success: function (res) {
        that.data.menuSwitcnDate[cateId] = res.data.data.all;
        that.setData({
          menuSwitcnDate: that.data.menuSwitcnDate,
          hidden: false
        })
      }
    });
    that.setData({
      hidden: true,
      menuSwitcnDateIndex: cateId,
    });

  },
  upper(e) {
    console.log(e)
  },
  lower(e) {
    console.log(e)
  },
  scroll(e) {
    console.log(e)
  },
  onLoad: function () {
    app.setUserInfo();
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/getrexiaochangpin?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
       //console.log(res);
        that.setData({
          imgUrls: res.data,
        })
      }
    });
    that.ClassificationListReq();

  },
  onShow: function () {
    app.setUserInfo();
  },
  tapsize: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.key;
    var attrValues = [];
    var attrName = that.data.attrName;
    var attrNameArr = attrName.split(",");
    var array = that.data.productAttr;
    for (var i in that.data.productAttr) {
      for (var j in that.data.productAttr[i]['attr_values']) {
        if (that.data.productAttr[i]['attr_values'][j] == key) {
          attrValues = that.data.productAttr[i]['attr_values'];
        }
      }
    }
    for (var ii in attrNameArr) {
      if (that.in_array(attrNameArr[ii], attrValues)) {
        attrNameArr.splice(ii, 1);
      }
    }
    attrName = attrNameArr.join(',');
    if (attrName) var eName = e.currentTarget.dataset.key + ',' + attrName;
    else var eName = e.currentTarget.dataset.key;
    attrNameArr = eName.split(",");
    var isBool = false;
    var isattrNameArrLength = 0;
    for (var an in attrNameArr) {
      if (attrNameArr[an]) isattrNameArrLength = isattrNameArrLength + 1;
    }
    for (var b in that.data.productValue) {
      var sukValue = that.data.productValue[b].suk.split(",");
      if (sukValue.length == isattrNameArrLength) {
        if (that.in_array_two(attrNameArr, sukValue)) {
          isBool = true;
        }
      } else {
        isBool = true;
      }
    }
    if (!isBool) {
      wx.showToast({
        title: '属性不存在，请重新选择',
        icon: 'none',
        duration: 1500,
      })
    } else {
      that.setData({
        attrName: e.currentTarget.dataset.key + ',' + attrName
      })
      attrNameArr = that.data.attrName.split(",");
      var attrNameArrSort = '';
      for (var jj in that.data.productAttr) {
        for (var jjj in that.data.productAttr[jj]['attr_values']) {
          if (that.in_array(that.data.productAttr[jj]['attr_values'][jjj], attrNameArr)) {
            attrNameArrSort += that.data.productAttr[jj]['attr_values'][jjj] + ',';
          }
        }
      }
      for (var jj in array) {
        for (var jjj in array[jj]['attr_values']) {
          if (that.in_array(array[jj]['attr_values'][jjj], attrNameArr)) {
            array[jj]['attr_value'][jjj].check = true;
          } else {
            array[jj]['attr_value'][jjj].check = false;
          }
        }
      }
      that.setData({
        productAttr: array
      })
      var attrNameArrSortArr = attrNameArrSort.split(",");
      attrNameArrSortArr.pop();
      that.setData({
        attrName: attrNameArrSortArr.join(',')
      })
      var arrAttrName = that.data.attrName.split(",");
      for (var index in that.data.productValue) {
        var strValue = that.data.productValue[index]['suk'];
        var arrValue = strValue.split(",");
        if (that.in_array_two(arrValue, arrAttrName)) {
          var image = "productSelect.image";
          var store_name = "productSelect.store_name";
          var price = "productSelect.price";
          var unique = "productSelect.unique";
          var stock = "productSelect.stock";
          that.setData({
            [image]: that.data.productValue[index]['image'],
            [price]: that.data.productValue[index]['price'],
            [unique]: that.data.productValue[index]['unique'],
            [stock]: that.data.productValue[index]['stock'],
          })
        }
      }
    }
  },
  in_array_two: function (arr1, arr2) {
    if (arr1.sort().toString() == arr2.sort().toString()) {
      return true;
    }
    else {
      return false;
    }

  },
  in_array: function (str, arr) {
    for (var f1 in arr) {
      if (arr[f1] == str) {
        return true;
      }
    }
  },
  bindMinus: function () {
    var that = this;
    wxh.carmin(that)
  },
  bindPlus: function () {
    var that = this;
    wxh.carjia(that);
  },
  setNumber: function (e) {
    var that = this;
    var num = parseInt(e.detail.value);
    that.setData({
      num: num ? num : 1
    })
  },
  cartGWClick: function () {
    this.setData({
      status: 2
    });
    this.subBuy();
  },
  confirmClick: function () {
    this.setData({
      status: 3
    });
    this.subBuy();
  },
  modelbg: function (e) {       //隐藏弹窗
    this.setData({
      prostatus: false
    })
  },
  getAttrInfo: function (e) {    //显示弹窗
    var that = this;
    wxh.footan(that);
    console.log(e);
    that.data.shoppingMessage.id = e.currentTarget.dataset.id;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/details?uid=' + app.globalData.uid,
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: header,
      success: function (res) {
        if (res.data.code == 200) {
          var image = "productSelect.image";
          var store_name = "productSelect.store_name";
          var price = "productSelect.price";
          var unique = "productSelect.unique";
          var stock = "productSelect.stock";
          that.setData({
            productAttr: res.data.data.productAttr,
            productValue: res.data.data.productValue,
            [image]: res.data.data.storeInfo.image,
            [stock]: res.data.data.storeInfo.stock,
            [store_name]: res.data.data.storeInfo.store_name,
            [price]: res.data.data.storeInfo.price,
            [unique]: ''
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })

  },
  subBuy: function () {
    var that = this;
    if (that.data.num > that.data.productSelect.stock) {
      wx.showToast({
        title: '库存不足' + that.data.num,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        num: that.data.productSelect.stock,
      })
    } else if (that.data.productAttr.length > 0 && that.data.productSelect.unique == '') {
      wx.showToast({
        title: '请选择属性',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (that.data.status == 2) {
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/auth_api/set_cart?uid=' + app.globalData.uid,
          method: 'GET',
          data: {
            productId: that.data.shoppingMessage.id,
            cartNum: that.data.num,
            uniqueId: that.data.productSelect.unique
          },
          header: header,
          success: function (res) {
            if (res.data.code == 200) {
              wx.showToast({
                title: '添加购物车成功',
                icon: 'success',
                duration: 2000
              })
              wx.switchTab({
                url: '../buycar/buycar'
              });
              /*that.setData({
                  prostatus: false
              })*/
              // that.getCartCount();
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      } else if (that.data.status == 3) {
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/auth_api/now_buy?uid=' + app.globalData.uid,
          method: 'GET',
          data: {
            productId: that.data.shoppingMessage.id,
            cartNum: that.data.num,
            uniqueId: that.data.productSelect.unique
          },
          header: header,
          success: function (res) {
            if (res.data.code == 200) {
              wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                url: '/pages/order-confirm/order-confirm?id=' + res.data.data.cartId
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '请点击商品',
          icon: 'success',
          duration: 2000
        });
      }
    }
  },
})
