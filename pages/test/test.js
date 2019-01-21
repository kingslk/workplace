var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 查看是否授权
    wx.login({
      success: function(res) {
        var code = res.code
        console.log(code)
        //插入登录的用户的相关信息到数据库
        wx.request({
          url: 'http://111.230.96.198:8080/getOpenId2',
          // url: getApp().globalData.reUrl + '/user/add',                                            
          data: {
            code: code,
          },
          method: 'get',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            console.log(res.data)
            var openId = res.data
            wx.request({
              url: 'http://111.230.96.198:8080/getUserById',
              data: {
                "openId": openId,
              },
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                console.log(res.data)
                var res = res.data
                if (res) {
                  app.globalData.userId = openId;
                  wx.switchTab({
                    url: './../mine/mine'
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      wx.login({
        success: function(res) {
          var code = res.code

          console.log(code)
          //插入登录的用户的相关信息到数据库
          wx.request({
            url: 'http://111.230.96.198:8080/getOpenId2',
            // url: getApp().globalData.reUrl + '/user/add',                                            
            data: {
              code: code,
            },
            method: 'get',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(res.data)
              var openId = res.data
              app.globalData.userId = res.data;
              wx.getUserInfo({
                success(res) {
                  const userInfo = res.userInfo
                  const username = userInfo.nickName
                  wx.request({
                    url: 'http://111.230.96.198:8080/registerUser',
                    data: {
                      "openId": openId,
                      "username": username
                    },
                    method: 'POST',
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {
                      console.log(res.data)
                    }
                  })
                }
              })

            }
          });
          //授权成功后，跳转进入小程序首页
          wx.switchTab({
            url: '../mine/mine'
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
            // that.bindGetUserInfo()
          }

        }
      })
    }

  },
  //获取用户信息接口
  queryUsreInfo: function() {
    // wx.request({
    //   url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
    //   data: {
    //     openid: getApp().globalData.openid
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //     getApp().globalData.userInfo = res.data;
    //   }
    // });


  },

})