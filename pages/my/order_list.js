var app = getApp();
Page({
    data: {
        statusType: ["待付款", "待接收", "已完成", "已取消",],
        status: ["0", "1", "2", "3"],
        currentType: 0,
        tabClass: ["", "", "", "", "", ""]
    },
    statusTap: function (e) {
        var curType = e.currentTarget.dataset.index;
        this.data.currentType = curType;
        this.setData({
            currentType: curType
        });
        this.onShow();
        //this.getOrderPay()

    },
    orderDetail: function (e) {
        console.log("e", e)
        wx.navigateTo({
            url: "/pages/my/order_info?orderId=" + e.currentTarget.dataset.id
        })
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完
    },
    onShow: function () {
        var that = this;
        /*  that.setData({
             order_list: [
                 {
                     status: -8,
                     status_desc: "待支付",
                     date: "2018-07-01 22:30:23",
                     order_number: "20180701223023001",
                     note: "记得周六发货",
                     total_price: "85.00",
                     goods_list: [
                         {
                             pic_url: "/images/food.jpg"
                         },
                         {
                             pic_url: "/images/food.jpg"
                         }
                     ]
                 }
             ]
         }); */

        that.getOrderPay()
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    },
    getOrderPay() {
        var that = this
        var openid = app.getCache("openid")
        var page = 0;
        var size = 50;
        wx.request({
            url: "http://localhost:8080/sell/buyer/order/list?openid=" + openid + "&page=" + page + "&size=" + size,
            method: "get",
            success(res) {

                var orders = res.data.data
                var openid = app.getCache("openid")
                var lists = []

                orders.forEach(e => {
                    console.log(e)
                    var status;
                    var statusType;
                    if (e.orderStatus == 2) {
                        status = 3;
                        statusType = "已取消"
                    } else if (e.orderStatus == 1) {
                        status = 2
                        statusType = "已完成"
                    } else if (e.orderStatus == 0) {
                        if (e.payStatus == 0) {
                            status = 0;
                            statusType = "未支付"
                        } else if (e.payStatus == 1) {
                            status = 1;
                            statusType = "待接收"
                        }
                    }
                    /*  else if (e.payStatus == 0) {
                         status = 0;
                         statusType = "未支付"
                     } else {
                         if (e.orderStatus == 0) {
                             status = 1;
                             statusType = "待接收"
                         } else if (e.orderStatus == 1) {
                             status = 2
                             statusType = "已完成"
                         }
 
                     } */
                    wx.request({
                        url: "http://localhost:8080/sell/buyer/order/detail?openid=" + openid + "&orderId=" + e.orderId,
                        method: "get",
                        success(result) {

                            var orderDetailList = result.data.data.orderDetailList
                            var foods = []
                            orderDetailList.forEach(e => {
                                foods.push({
                                    pic_url: e.productIcon
                                })
                            })
                            var unpay = []
                            var unget = []
                            var finish = []
                            var cancel = []
                            var yun  = app.getCache("trans")
                            lists.push({
                                status: status,
                                status_desc: statusType,
                                date: e.updateTime,
                                order_number: e.orderId,
                                note: "记得周六发货",
                                total_price: parseFloat(e.orderAmount) + yun,
                                goods_list: foods,
                                order_sn: result.data.data.orderId
                            })
                            for (let i = 0; i < lists.length; i++) {
                                if (lists[i].status == 0) unpay.push(lists[i])
                                if (lists[i].status == 1) unget.push(lists[i])
                                if (lists[i].status == 2) finish.push(lists[i])
                                if (lists[i].status == 3) cancel.push(lists[i])
                            }
                            console.log("unpay", unpay)
                            var order_list
                            if (that.data.currentType == 0) {
                                order_list = unpay
                            } else if (that.data.currentType == 1) {
                                order_list = unget
                            } else if (that.data.currentType == 2) {
                                order_list = finish
                            } else if (that.data.currentType == 3) {
                                order_list = cancel
                            }
                            that.setData({
                                order_list: order_list
                            })
                        }
                    })





                })

            }
        })
    },
    toPay(e) {
        var that = this
        var openid = app.getCache("openid")
        console.log("orderId", e.currentTarget)
        wx.request({
            url: 'http://localhost:8080/sell/buyer/order/pay',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                openid: openid,
                orderId: e.currentTarget.dataset.id
            },
            method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var res = res.data
                app.alert({
                    content: "支付成功"
                })
                that.getOrderPay()
            }

        })

    },
    toCancel(e) {
        var that = this
        wx.request({
            url: 'http://localhost:8080/sell/buyer/order/cancel',
            data: {
                openid: app.getCache("openid"),
                orderId: e.currentTarget.dataset.id
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var res = res.data
                app.alert({
                    content: "取消成功"
                })
                that.getOrderPay()
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },
    tofinish(e) {
        var that = this
        wx.request({
            url: 'http://localhost:8080/sell/buyer/order/finish',
            data: {
                openid: app.getCache("openid"),
                orderId: e.currentTarget.dataset.id
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var res = res.data
                app.alert({
                    content: "收货成功"
                })
                that.getOrderPay()
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    }
})
