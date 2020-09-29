var app = getApp();
Page({
    data: {},
    onLoad: function (e) {
        var that = this;
        this.setData({
            orderId: e.orderId
        })
    },
    onShow: function () {
        var that = this;

        this.getOrderInfo()
    },
    getOrderInfo() {
        var that = this
        var openid = app.getCache("openid")
        wx.request({
            url: 'http://localhost:8080/sell/buyer/order/detail',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                openid: openid,
                orderId: that.data.orderId
            },
            method: "get", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                console.log("orderDtail", res.data.data)
                var orderDetail = res.data.data
                var status;
                var statusType;
                if (orderDetail.orderStatus == 2) {
                    status = 3;
                    statusType = "已取消"
                } else if (orderDetail.orderStatus == 1) {
                    status = 2
                    statusType = "已完成"
                } else if (orderDetail.orderStatus == 0) {
                    if (orderDetail.payStatus == 0) {
                        status = 0;
                        statusType = "未支付"
                    } else if (orderDetail.payStatus == 1) {
                        status = 1;
                        statusType = "待接收"
                    }
                }
                var goods = []

                orderDetail.orderDetailList.forEach(e => {
                    goods.push({
                        name: e.productName,
                        price: e.productPrice,
                        unit: e.productQuantity,
                        pic_url: e.productIcon
                    })
                })
                var yun = app.getCache("trans")
                var info = {
                    order_sn: orderDetail.orderId,
                    status: status,
                    status_desc: statusType,
                    deadline: "一小时前",
                    pay_price: orderDetail.orderAmount,
                    yun_price: 1.00,
                    total_price: parseFloat(orderDetail.orderAmount) + parseFloat(yun),
                    address: {
                        name: orderDetail.buyerName,
                        mobile: orderDetail.buyerPhone,
                        address: orderDetail.buyerAddress
                    },
                    goods: goods
                }
                that.setData({
                    info: info
                })

            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    }
});