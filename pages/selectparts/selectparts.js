var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    bagName: "",
    bagImg: '',
    allPrice: 0,
    bagPrice: 0,
    partsList: [],
    partsSend: [],
    num: 1,
    minusStatus: 'disabled'
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    var that = this
    let partsList = that.data.partsList; // 获取部件列表
    let bagPrice = that.data.bagPrice
    let allPrice = bagPrice
    for (let i = 0; i < partsList.length; i++) {
      for (let j = 0; j < partsList[i].parts.length; j++) {
        // 循环列表得到每个数据
        if (partsList[i].parts[j].checked) { // 判断选中才会计算价格
          allPrice = allPrice + parseFloat(partsList[i].parts[j].partPrice); // 所有价格加起来
        }

      }
      console.log(allPrice)
    }
    // 分割数字
    // allPrice = "" + allPrice
    // const xxx = allPrice.split('.')
    // let allPrice1 = xxx[0];
    // let allPrice2 = "." + xxx[1] + "0";
    this.setData({ // 最后赋值到data中渲染到页面
      partsList: partsList,
      // allPrice1: allPrice1,
      // allPrice2: allPrice2,
      allPrice: allPrice
    });
  },
  clicks: function(e) {
    console.log(e.currentTarget.id);
    const x = e.currentTarget.dataset.x
    let arrs = this.data.partsList;
    for (const y in arrs[x].parts) {
      if (arrs[x].parts[y].id == e.currentTarget.id) {
        arrs[x].parts[y].checked = true;
      } else {
        arrs[x].parts[y].checked = false;
      }
    }
    this.setData({
      partsList: arrs
    })
    // jisuan money
    this.getTotalPrice()
    // }
  },


  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    console.log(num)
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: 'http://120.79.165.3:8080/part/select',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          id: res.data.bag.id,
          bagName: res.data.bag.name,
          bagImg: res.data.bag.media,
          // bagPrice: res.data.bag.price,
          allPrice: that.data.bagPrice,
          partsList: res.data.partsList,
        })

      }
    })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  addYourStyle: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
      }
    })
  },
  //加入购物车
  addToShoppingCar: function() {
    var xxx = ""
    const arrs = this.data.partsList
    const partsSend = []
    for (const x in arrs) {
      for (const j in arrs[x].parts) {
        if (arrs[x].parts[j].checked == true) {
          partsSend.push(
            arrs[x].parts[j].id,
          )
        }
      }
    }
    //数组对象合并
    // partsSend.forEach((value,index)=>{
    //   xxx=xxx+value
    // }),
    // console.log(xxx)
    const num = this.data.num
    const allPrice = this.data.allPrice
    if (partsSend.length != arrs.length) {
      wx.showToast({
        title: '选择未完成',
        icon: 'loading',
        mask: true,
        duration: 1000

      })
    } else {
      wx.request({
        url: 'http://120.79.165.3:8080/shoppingCar/insert?partsId=' + partsSend[0] + '&partsId=' + partsSend[1] + '&partsId=' + partsSend[2] + '&num=' + num + '&userId=' + 1,
        method: 'GET',
        // header: {
        //   'content-type': 'multipart/form-data'
        // },
        // data: {
        //   parstId1: partsSend[0],
        //   parstId2: partsSend[1],
        //   parstId3: partsSend[2],
        //   num: num,
        //   userId: 1
        // }
      })
      console.log(partsSend)
      console.log(num)
      console.log(allPrice)
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    }


  },
  //查看购物车
  checkShoppingCar: function() {
    wx.switchTab({
      url: '../shoppingcar/shoppingcar',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  //直接购买
  buyRightNow: function() {
    const arrs = this.data.partsList
    const price = this.data.allPrice
    const partsSend = []
    const name = this.data.bagName
    const partsName = []
    const partMessage = []
    const media = this.data.bagImg
    for (const x in arrs) {
      for (const j in arrs[x].parts) {
        if (arrs[x].parts[j].checked == true) {
          partsSend.push({
            partId: arrs[x].parts[j].id
          })
          partsName.push({
            partId: arrs[x].parts[j].id,
            partName: arrs[x].parts[j].partName
          })
        }
      }
    }
    const id = parseInt(this.data.id)
    const num = parseInt(this.data.num)
    const shoppingCars=[]
    console.log(partsSend)
    console.log(num)
    //设置缓存
    partMessage.push({
      partsName,
    })
    wx.setStorageSync('partMessage', [{
      id,
      media,
      name,
      price,
      num,
      partMessage,
    }])
    wx.setStorageSync('shoppingCars', shoppingCars)
    wx.navigateTo({
      url: '../order/order'
    })
    wx.request({
      url: 'http://120.79.165.3:8080/order/show?partsId=' + partsSend[0].partId + '&partsId=' + partsSend[1].partId + '&partsId=' + partsSend[2].partId + '&num=' + num + '&userId=' + 1,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
  }
})