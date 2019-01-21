var index = 0;
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreValue: 0,
    // addreRange: ['　　　　　　　　　　', '长沙市芙蓉区', '长沙市天心区', '长沙市雨花区', '长沙市开福区', '长沙市岳麓区', '长沙市长沙县'],
    door: "请填写详细地址",

  },

  // addrePickerBindchange: function(e) {
  //   this.setData({
  //     addreValue: e.detail.value
  //   })
  // },
  formSubmit: function(e) {
    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.door == "") {
      warn = "请输入您的具体地址";
    } else {
      flag = true;
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      console.log({
        status: false
      })
      wx.navigateTo({
        url: '../chooseaddress/chooseaddress'
      });
      wx.request({
        url: 'http://120.79.165.3:8080/address/insert',
        method:'POST',
        header: {
          'content-type': 'application/json'
        },
        data:{
          userId:1,
          addressName:e.detail.value.door,
          status:false,
          receiver:e.detail.value.name,
          telephone:e.detail.value.tel
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