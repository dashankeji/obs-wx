//index.js
//获取应用实例
const app = getApp();
var wxh = require('../../utils/wxh.js');

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    currentSwiper: 0,   //轮播
    imgUrls: [],   //轮播图片
    gardenStuffListDateIndex: -1,            // 果蔬点击时下标
    hidden: true,
    gardenStuffTitle: ['正在请求'],   //果蔬标题
    title: '正在请求',  //点击果蔬右边显示标题
    gardenStuffListDate: {},                  //果蔬点击对应数据
    shoppingMessage:{                       //商品标识信息
      id: 0,                                //商品标识id
      name: '',                             //商品名字
      img: '',                              //商品图片
      price: 0,                             //商品金额
      num: 0,                               //商品数量
    },
    status: 0,                             //请求添加到购物车时为2
    ClassificationList:[]
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
          if (res.data.data[i].cate_name == '应季果蔬') {
            var child = res.data.data[i].child;
                that.setData({
                  gardenStuffTitle: res.data.data[i].child,
                  gardenStuffListDateIndex: res.data.data[i].child[0].id,
                  title: res.data.data[i].child[0].cate_name
                });
                that.gardenStuffClick(null, that.data.gardenStuffListDateIndex,that.data.title);
                break;
          }
        }

      }
    });
  },
  parameterShow: function (e) {     //Add购物车
    var that = this;
        if (e.currentTarget.dataset.name == that.data.shoppingMessage['name']){
          if (e.currentTarget.dataset.stock && that.data.shoppingMessage['num'] >= parseFloat(e.currentTarget.dataset.stock)){   //库存
                wx.showToast({
                  title: '超过最大库存量了',
                  icon: 'none',
                  duration: 2000
                });
                return;
          }
          that.data.shoppingMessage.num++;

        }else{
    
          that.data.shoppingMessage.num = 1;
        };
        that.data.shoppingMessage.price = (parseFloat(e.currentTarget.dataset.price) * that.data.shoppingMessage.num).toFixed(2);
        //console.log(e.currentTarget.dataset.name , that.data.shoppingMessage['name']);
        that.data.shoppingMessage['id'] = e.currentTarget.dataset.id;
        that.data.shoppingMessage['img'] = e.currentTarget.dataset.img;
        that.data.shoppingMessage['name'] = e.currentTarget.dataset.name;
          
        that.setData({
              shoppingMessage: that.data.shoppingMessage,
              status: 2,
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
  subBuy: function (e) {

    var that = this;
    if (false) {
      wx.showToast({
        title: '库存不足' + that.data.num,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        num: that.data.productSelect.stock,
      })
    } else if (false) {
      wx.showToast({
        title: '请选择属性',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (that.data.status == 1) {
        var attrValueData = [];
        for (var i in that.data.productValue) {
          if (that.data.productValue[i].unique == that.data.productSelect.unique) {
            for (var j in that.data.productAttr) {
              for (var k in that.data.productAttr[j].attr_values) {
                var sukArr = that.data.productValue[i].suk.split(',');
                if (that.in_array(that.data.productAttr[j].attr_values[k], sukArr)) {
                  attrValueData.push(that.data.productAttr[j].attr_name + ':' + that.data.productAttr[j].attr_values[k]);

                }
              }
            }

          }
        }
        that.setData({
          attr: '已选',
          attrValue: attrValueData.join(','),
          prostatus: false
        })
      } else if (that.data.status == 2) {
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/auth_api/set_cart?uid=' + app.globalData.uid,
          method: 'GET',
          data: {
            productId: that.data.shoppingMessage.id,
            cartNum: that.data.shoppingMessage.num,
            uniqueId: ''
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
            productId: that.data.id,
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
      }else{
              wx.showToast({
                title: '请点击商品',
                icon: 'success',
                duration: 2000
              });
           }
    }
  },
  onLoad: function() {
        app.setUserInfo();
        this.ClassificationListReq();
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        var that = this;
        wx.request({
          url: app.globalData.url + '/routine/auth_api/index?uid=' + app.globalData.uid,
          method: 'POST',
          header: header,
          success: function (res) {
           
            that.setData({
              imgUrls: res.data.data.banner,
            })
          }
        });
        
  },
  onShow: function(){
    app.setUserInfo();
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  gardenStuffClick: function (e,id,title) {    //果蔬数据切换按钮
   
    var cateId = e ? e.currentTarget.dataset.id : id;
    var cate_name = e ? e.currentTarget.dataset.title : title;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
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
  upper(e) {
    console.log(e)
  },
  lower(e) {
    console.log(e)
  },
  scroll(e) {
    console.log(e)
  }
})
