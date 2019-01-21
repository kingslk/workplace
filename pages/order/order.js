Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputs: "",
    // 没有收货地址时返回null
    partMessage: [],
    addressMessage: {},
    goodsMessage: [],
    totalSum: 0,
    totalPrice: 0,
    extra: 10,
    actualprice: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: 'http://120.79.165.3:8080/address/default?userId=1',
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          addressMessage: res.data
        })
      }
    })
    var that = this
    let price = 0
    let totalSum = that.data.totalSum
    let totalPrice = that.data.totalPrice
    let actualprice = that.data.actualprice
    // let goodsMessage = that.data.goodsMessage
    //读取缓存
    let partMessage = that.get('partMessage')
    let shoppingCars=that.get('shoppingCars')
    console.log(partMessage,shoppingCars)
    that.setData({
      partMessage: partMessage,
      goodsMessage: partMessage
    })
    for (let i = 0; i < partMessage.length; i++) {
      totalSum = totalSum + partMessage[i].num
      // totalPrice = parseFloat(price)
      totalPrice = totalPrice + (parseFloat(partMessage[i].num)) * (parseFloat(partMessage[i].price))
    }
    actualprice = parseFloat(totalPrice) + that.data.extra
    actualprice=actualprice.toFixed(2)
    that.setData({
      totalSum: totalSum,
      totalPrice: totalPrice,
      actualprice: actualprice
    })
  },
  //storage保存页面数据的缓存
  get: function(a) {
    return wx.getStorageSync(a)
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
  //选择您的默认地址
  sendToChooseAddress: function() {
    wx.navigateTo({
      url: '../chooseaddress/chooseaddress',
    })
  },
  //获取用户评价
  inputs: function(e) {
    var that = this
    var value = e.detail.value
    that.setData({
      inputs: value
    })
    console.log(that.data.inputs)
  },
  // //提交订单，判断是否购买
  submitorder: function() {
    var that = this
    const userId = 1
    let addressId = that.data.addressMessage.id
    let message = that.data.inputs
    let sumPrice = that.data.actualprice
    let goods = []
    let shoppingCars=[]
    for (let i = 0; i < that.data.partMessage.length; i++) {
      goods.push({
        goodId: that.data.partMessage[i].id,
        num: that.data.partMessage[i].num
      })
      
    }
    shoppingCars = that.get('shoppingCars')
    console.log(goods,shoppingCars)
    wx.showModal({
      title: '去付款',
      content: '确认付款',
      showCancel: true,
      success: function(res) {
        if (res.cancel) {
          console.log("用户取消支付")
          wx.request({
            url: 'http://120.79.165.3:8080/order/commit',
            method: 'POST',
            // header: {
            //   "content-type": "application/x-www-form-urlencoded"
            // },
            data: {
              "userId": userId,
              "addressId": addressId,
              "message": that.data.inputs,
              "sumPrice": sumPrice,
              "goods": goods,
              "shoppingCars":shoppingCars
            },
            success: function(res) {
              wx.clearStorage()
              wx.switchTab({
                url: '../mine/mine',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            }

          })
        } else {
          wx.showToast({
            title: '付款成功',
            duration: 2000,
            success: function(res) {
              setTimeout(function() {
                wx.switchTab({
                  url: '../mine/mine',
                })
              }, 2000)
            }
          })
        }
      }
    })
  },

})