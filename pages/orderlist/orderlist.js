// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 600,
    bags: [],
    length: 0,
    status: {},
    active: 0,
    currentTab: 0,
    orders1: [],
    orders2: [],
    orders3: [],
    orders4: [],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let status = that.data.status
    wx.request({
      url: 'http://120.79.165.3:8080/order/status?userId=1',
      success: function(res) {
        console.log(res.data)
        that.setData({
          status: res.data
        })
      }
    })
    wx.request({
      url: 'http://120.79.165.3:8080/order/all?userId=1',
      success: function(res) {
        console.log(res.data)
        let orders = res.data;
        let orders1 = [],
          orders2 = [],
          orders3 = [],
          orders4 = [];
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].status == 1) {
            orders1.push(orders[i])
          } else if (orders[i].status == 2) {
            orders2.push(orders[i])
          } else if (orders[i].status == 3) {
            orders3.push(orders[i])
          } else if (orders[i].status == 4) {
            orders4.push(orders[i])
          }
        }
        for (let x = 0; x < orders2.length; x++) {
          orders2[x].reminderShipment = true
        }
        that.setData({
          orders1: orders1,
          orders2: orders2,
          orders3: orders3,
          orders4: orders4
        })
      },
    })

  },
  // 取消订单
  deleteOrder: function(e) {
    var that = this
    let orderId = e.currentTarget.id
    wx.showModal({
      title: '取消订单',
      content: '是否取消订单',
      showCancel: true,
      success: function(res) {
        if (res.cancel) {
          console.log("用户取消操作")
        } else {
          wx.request({
            url: 'http://120.79.165.3:8080/order/cancel',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              orderId: orderId
            },
            success: function(res) {
              that.onLoad()
            }
          })
          console.log(e.currentTarget.id)
        }
      }
    })
  },
  //去付款
  goToPay: function(e) {
    console.log(e.currentTarget.id)
    let id = e.currentTarget.id;
    let list = this.data.orders1;
    for (let i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        console.log(list[i])
      }
    }
    // wx.navigateTo({
    //   url: '../order/order',
    // })
  },
  //提醒发货
  reminderShipment: function(e) {
    console.log(e.currentTarget.id)
    let id = e.currentTarget.id
    let list = this.data.orders2
    wx.showToast({
      title: '提醒成功',
      duration: 2000,
      mask: true,
      icon: 'success'
    })
    for (let i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        list[i].reminderShipment = false
      }
    }
    console.log(list)

    this.setData({
      orders2: list
    })
  },
  //确认收货
  confirmReceipt: function(e) {
    var that=this
    console.log(e)
    let orderId = e.currentTarget.id
    wx.request({
      url: 'http://120.79.165.3:8080/order/confirm',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: orderId
      },
      success:function(res){
        that.onLoad()
      }
    })
  },
  //去评价
  toevaluate:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../evaluate/evaluate?orderId='+e.currentTarget.id,
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
    this.setData({
      height: this.data.height * 2
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //滑动切换
  swiperTab: function(e) {

    console.log(e.detail.current)
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    })

  },


})