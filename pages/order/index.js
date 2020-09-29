//获取应用实例
var app = getApp();

Page({
    data: {
        goods_list: [
            /*   {
                  id:22,
                  name: "小鸡炖蘑菇",
                  price: "85.00",
                  pic_url: "/images/food.jpg",
                  number: 1,
              },
              {
                  id:22,
                  name: "小鸡炖蘑菇",
                  price: "85.00",
                  pic_url: "/images/food.jpg",
                  number: 1,
              } */
        ],

        yun_price: "1.00",
        pay_price: "0.00",
        total_price: "0.00",
        params: null
    },
    onShow: function () {
        var that = this;
        this.getOrderInfo()
        this.getDefaultAddress()
    },
    onLoad: function (e) {
        var goods = app.getCache("orderGoods")
        this.setData({
            params: goods
        })
     var input =  app.getCache("trans")
     this.setData({
       yun_price: parseFloat(input)
     })
        // this.getDefaultAddress()
    },
    getDefaultAddress() {
        var addressList = app.getCache("addressList") || []
        addressList.forEach(e => {
            if (e.isDefault == 1) {
                var address = {
                    name: e.nickname,
                    detail: e.address,
                    mobile: e.mobile
                }
                this.setData({
                    default_address: address,
                })
            }
        })
    },
    createOrder: function (e) {
        wx.showLoading();
        var that = this;
        var goods = []

        this.data.params.forEach(e => {
            goods.push({
                productId: e.id,
                productQuantity: e.number
            })
        })
        var openid = app.getCache("openid")
        var data = {
            name: this.data.default_address.name,
            address: this.data.default_address.detail,
            phone: this.data.default_address.mobile,
            openid: openid,
            items: JSON.stringify(goods)
        }
        wx.request({
            url: "http://localhost:8080/sell/buyer/order/create",
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: data,
            success(res) {
                wx.hideLoading();
                console.log("create suc", res.data)
                wx.navigateTo({
                    url: "/pages/my/order_list"
                });
            }
        })

    },
    addressSet: function () {
        wx.navigateTo({
            url: "/pages/my/addressSet"
        });

    },
    selectAddress: function () {
        wx.navigateTo({
            url: "/pages/my/addressList"
        });
    },
    getOrderInfo() {

        this.setData({
            goods_list: this.data.params
        })
        var pay = 0.0
        this.data.params.forEach(e => {
            pay += ((e.price).toFixed(2)) * (e.number)
        })
        var total = parseFloat(pay) + parseFloat(this.data.yun_price)
        this.setData({
            total_price: total,
            pay_price: pay
        })
    }

});
