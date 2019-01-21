var flag = false;
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    door: "请输入您的地址信息",
    index: "0",
    id:0,
    userId:0,
    addressName:'',
    status:false,
    receiver:"",
    telephone:''

  },
  onLoad: function(options) {
    var that=this
    that.setData({
        id: options.id,
        userId:options.userId,
        addressName: options.addressName,
        status:options.status,
        receiver:options.receiver,
        telephone:options.telephone
    })
    console.log(that.data.id)
   
  },

  //点击删除
  delete: function(options) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址信息吗？',
      success: function(res) {
        if (res.confirm) {
          console.log(that.data.addressId)
          wx.redirectTo({
            url: '../chooseaddress/chooseaddress'
          });
          wx.request({
            url: 'http://120.79.165.3:8080/address/delete',
            method:'GET',
            data:{
              addressId:that.data.id
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //点击取消，返回上个页面
  cancel: function() {
    wx.navigateBack({
      delta: 1
    }), console.log("用户点击返回")
  },
  //点击保存
  formSubmit: function(e) {
    var warn = "";
    var that = this;
    console.log(that.data)
    if (e.detail.value.receiver == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.telephone == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.telephone))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.addressName == "") {
      warn = "请输入您的具体地址";
    } else {
      flag = true;
      // console.log('form发生了submit事件，携带数据为：', e.detail.value)
      console.log({
        status: false
      })
      wx.redirectTo({
        url: '../chooseaddress/chooseaddress'
        //？后面跟的是需要传递到下一个页面的参数
      });
      wx.request({
        url: 'http://120.79.165.3:8080/address/edit',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          id: that.data.id,
          userId: that.data.userId,
          addressName: e.detail.value.addressName,
          status: false,
          receiver: e.detail.value.receiver,
          telephone: e.detail.value.telephone
        }
      })
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },

})