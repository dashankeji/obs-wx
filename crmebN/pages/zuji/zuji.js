var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    footprintList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(){
      app.setUserInfo();
      this.getfootprintList();
    },
    deletefootprint: function(e){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '是否要删除该足迹',
        success: function (res) {
          if (res.confirm) {
            var header = {
              'content-type': 'application/x-www-form-urlencoded',
            };
           
            wx.request({
              url: app.globalData.url + '/routine/auth_api/deleteProductFootprint?uid=' + app.globalData.uid,
              data: { product_id: e.currentTarget.dataset.id},
              method: 'GET',
              header: header,
              success: function(){
                that.getfootprintList();
              }
            });
          } else {
            console.log('用户点击取消');
          }

        }
      })
    },
    getfootprintList: function () {

      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/getProductFootprint?uid=' + app.globalData.uid,
        method: 'GET',
        header: header,
        success: function (res) {

          that.setData({
              footprintList: res.data.data
            })
        }
      })
    }

  }
})
