//index.js
//获取应用实例
const app = getApp();
var wxh = require('../../utils/wxh.js');

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    gardenStuffListDateIndex: -1,            // 果蔬点击时下标
    hidden: true,
    gardenStuffTitle: ['正在请求'],   //果蔬标题
    title: '正在请求',  //点击果蔬右边显示标题
    gardenStuffListDate: {},                  //果蔬点击对应数据
    shoppingMessage: {                       //商品标识信息
      id: 0,                                //商品标识id
      name: '',                             //商品名字
      img: '',                              //商品图片
      price: 0,                             //商品金额
      num: 0,                               //商品数量
    },
    status: 0,                             //请求添加到购物车时为2
    ClassificationList: [],
    offset: 1,
    GbCateId: -1,
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
    second_height: 0,
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
          if (res.data.data[i].cate_name == '分类') {
            var child = res.data.data[i].child;
            that.setData({
              gardenStuffTitle: res.data.data[i].child,
              gardenStuffListDateIndex: res.data.data[i].child[0].id,
              title: res.data.data[i].child[0].cate_name
            });
            that.gardenStuffClick(null, that.data.gardenStuffListDateIndex, that.data.title);
            break;
          }
        }

      }
    });
  },
  addFun: function () {
    var args = arguments,//获取所有的参数
      lens = args.length,//获取参数的长度
      d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
      sum = 0;//定义sum来接收所有数据的和

    for (var key in args) {//遍历所有的参数
      //把数字转为字符串
      var str = "" + args[key];
      if (str.indexOf(".") != -1) {//判断数字是否为小数
        //获取小数位的长度
        var temp = str.split(".")[1].length;
        //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
        d = d < temp ? temp : d;
      }
    };
    //计算需要乘的数值
    var m = Math.pow(10, d);
    //遍历所有参数并相加
    for (var key in args) {
      sum += args[key] * m;
    }
    //返回结果
    return sum / m;
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
  onLoad: function () {
    app.setUserInfo();
    // 获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        /*console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);*/
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - res.windowWidth / 750 * that.data.CustomBar - res.windowWidth / 750 * 92 -30
        })
      }
    });

    that.ClassificationListReq();

  },
  onShow: function () {
    app.setUserInfo();
  },
  modelbg: function (e) {       //隐藏弹窗
    this.setData({
      prostatus: false
    })
  },
  getAttrInfo: function (e) {    //显示弹窗
    var that = this;
    wxh.footan(that);
    
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
  gardenStuffClick: function (e, id, title) {    //果蔬数据切换按钮

    var that = this;
    var cateId = e ? e.currentTarget.dataset.id : id;
    var cate_name = e ? e.currentTarget.dataset.title : title;
    if (that.data.GbCateId == cateId) {
      return;
    } else {
      that.data.offset = 1;
      that.data.gardenStuffListDate = {};
    }

    that.data.GbCateId = cateId;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + cateId,
      method: 'POST',
      header: header,
      success: function (res) {
        that.data.gardenStuffListDate[cateId] = res.data.data.all;
        that.setData({
          gardenStuffListDate: that.data.gardenStuffListDate,
          hidden: false
        })
      }
    });
    that.setData({
      hidden: true,
      gardenStuffListDateIndex: cateId,
      title: cate_name
    });

  },
  /*onReachBottom: function () {
    

  },*/
  /* upper(e) {
     console.log(e)
   },*/
   lower(e) {
     var that = this;
     var limit = 0;

     if (that.data.hidden) return;
     ++that.data.offset;
     limit = that.data.offset * 8;

     that.setData({
       hidden: true,
     });

     var header = {
       'content-type': 'application/x-www-form-urlencoded',
     };
     wx.request({
       url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + that.data.GbCateId + '&offset=' + (limit - 8) + '&limit=' + limit,
       method: 'GET',
       header: header,
       success: function (res) {
         if (res.data.data.all.length < 1) {
           --that.data.offset;
           wx.showToast({
             title: '没有更多的商品了',
             icon: 'none',
             duration: 2000
           })
         } else {
           that.data.gardenStuffListDate[that.data.GbCateId] = that.data.gardenStuffListDate[that.data.GbCateId].concat(res.data.data.all);
         };
         that.setData({
           hidden: false,
           gardenStuffListDate: that.data.gardenStuffListDate
         })
       }
     });
   },
   /*scroll(e) {
     console.log(e)
   },*/
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
  cartGWClick: function(){
    this.setData({
      status: 2
    });
    this.subBuy();
  },
  confirmClick: function(){
    this.setData({
      status:3
    });
    this.subBuy();
  }
})
