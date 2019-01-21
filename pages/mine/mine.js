Page({
  data: {
    userid:'1',
    thumb: '',
    nickname: '',
    hasAddress: true,
    address: {
      name: "张三",
      telephone: 1354678646,
      detail: "这是详细地址"
    }
  },
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res) {
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })
    wx.request({
      url: 'http://120.79.165.3:8080/address/default?userId=1',
      method:'GET',
      success:function(res){
        console.log(res.data)
        self.setData({
          address:res.data,
        })
      }
    })
  },
  onShow() {
    
  },
  //管理地址
  addressmanage:function(){
    wx.navigateTo({
      url: '../chooseaddress/chooseaddress?userId='+this.data.userid,
    })
  },
  //管理订单
  ordermanage:function(){
    wx.navigateTo({
      url: '../orderlist/orderlist?userId=' + this.data.userid,
    })
  }

})