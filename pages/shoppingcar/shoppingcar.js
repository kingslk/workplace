Page({
  data: {
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    sum: 0,

  },
  //切换tabbar时传值
  onTabItemTap(item) {
    console.log(item.index)
    this.onLoad()
  },
  onLoad() {
    var that = this
    wx.request({
      url: 'http://120.79.165.3:8080/shoppingCar/shoppingCars?userId=' + 1,
      method: 'GET',
      success: function(res) {
        console.log(res.data)
        if (res.data.length != 0) {
          that.change(res)
        }
        console.log(that.data)
        that.getTotalPrice()
      },

    })
  },

  change: function(res) {
    console.log("i do")
    this.setData({
      hasList: true,
      carts: res.data
    })
  },
  // 判断购物车是否为空
  onShow() {
    // this.onLoad()
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.id;
    // console.log(e.currentTarget.id)
    let carts = this.data.carts;
    let selected = carts[index].checked;
    if(selected==true){
      carts[index].checked=false
    }else{
      carts[index].checked=true
    }
    let checked=!selected
    // carts[index].checked = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();

    // console.log(id, checked)
    wx.request({
      url: 'http://120.79.165.3:8080/shoppingCar/switch?shoppingCarId=' + id + '&checked=' + checked,
      method: 'POST',
      // header:{
      //   'content-type': 'multipart/form-data'
      // }
    })
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that=this
    const id = e.currentTarget.id;
    let carts = this.data.carts;

    console.log(id)

    // 如果购物车为空
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    wx.request({
      url: 'http://120.79.165.3:8080/shoppingCar/remove?shoppingCarId='+id,
      method:'POST',
      success:function(res){
        that.onLoad()
      },
      
    })
    // onLoad()
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].checked = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const id=e.currentTarget.id
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.getTotalPrice();
    wx.request({
      url: 'http://120.79.165.3:8080/shoppingCar/inandout?shoppingCarId=' + id + '&num=' + num,
      method: 'POST',
    })
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const id = e.currentTarget.id
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.getTotalPrice();
    wx.request({
      url: 'http://120.79.165.3:8080/shoppingCar/inandout?shoppingCarId='+id+'&num='+num,
      method:'POST',
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].checked) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  //购买界面
  addToOrders: function() {
    const carts = this.data.carts
    const shoppingList = [];
    let shoppingCars=[]
    const totalPrice = this.data.totalPrice;
    for (const x in carts) {
      // console.log(carts[x].selected)
      if (carts[x].checked == true) {
        // console.log(carts[x].num)
        shoppingList.push({
          id: carts[x].goodsId,
          media: carts[x].media,
          name: carts[x].name,
          price: carts[x].price,
          num: carts[x].num,
          // partsMessage: carts[x].partsMessage
        });
        shoppingCars.push(carts[x].id)
      }
    }
    if (totalPrice == 0) {
      wx.showToast({
        title: "请选择商品",
        duration: 1000,
        mask: true,
        icon: 'loading'
      })
    } else {
      //设置缓存
      wx.setStorageSync('partMessage', shoppingList)
      wx.setStorageSync('shoppingCars', shoppingCars)
      wx.navigateTo({
        url: '../order/order',
      })
      // console.log(shoppingList)
      
    }

  }

})