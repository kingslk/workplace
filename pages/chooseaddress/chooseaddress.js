//var li=[];
var index = 0;
var li = [{
    "id": "0",
    "userId": "1",
    "name": "张三",
    "telephone": "13733332222",
    "addressDetail": "长沙市天心区解放路一单元110号",
    "status": true,
  },
  {
    "id": "1",
    "userId": "1",
    "name": "李四",
    "telephone": "15172225222",
    "addressDetail": "长沙市岳麓区中南大学校本部五舍11号",
    "status": false,
  },

];


Page({
  data: {
    list: li,
  },
  addAddre: function(e) {
    wx.navigateTo({
      url: '../addaddress/addaddress'
    })
  },
  toModifyAddre: function(e) {

    wx.navigateTo({
      url: '../changeaddress/changeaddress?id=' + e.currentTarget.dataset.addressid + '&userId=' + e.currentTarget.dataset.userid + '&addressName=' + e.currentTarget.dataset.addressdetail + '&status=' + e.currentTarget.status + '&receiver=' + e.currentTarget.dataset.name + '&telephone=' + e.currentTarget.dataset.telephone
    })
    console.log(e.currentTarget.dataset.addressid)
  },
  toOrder: function(e) {
    var shoppingCars=wx.getStorageInfoSync('shoppingCars')
    if (shoppingCars.length) {
      e.currentTarget.dataset.status = true
      wx.navigateTo({
        url: '../order/order'
      });
      console.log(e.currentTarget.dataset);
      wx.request({
        url: 'http://120.79.165.3:8080/address/update?addressId=' + e.currentTarget.dataset.addressid + '&userId=1',
        method: 'POST',
        // header: {
        //   'content-type': 'multipart/form-data'
        // },
        // data: {
        //   addressId: e.currentTarget.dataset.addressid,
        //   userId: 1
        // }
      })
      }else{
        wx.showToast({
          title: '您还未添加商品',
          icon: 'success',
          duration: 2000, 
          success:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: '../selectparts/selectparts',
              })
            },2000)
          }
        })
      }
    
  },

  onLoad: function(options) {
    var that = this
    wx.request({
      url: 'http://120.79.165.3:8080/address/addresses?userId=1',
      method: 'GET',
      success: function(res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
      }
    })
  }
})