//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
    data: {
        autoplay: true,
        interval: 3000,
        duration: 1000,
        swiperCurrent: 0,
        hideShopPopup: true,
        buyNumber: 1,
        buyNumMin: 1,
        buyNumMax: 1,
        canSubmit: false, //  选中时候是否允许加入购物车
        shopCarInfo: {},
        shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车,
        id: 0,
        shopCarNum: 0,
        commentCount: 0,
        info: {}
    },
    onLoad: function (e) {
        var that = this;
        console.log(e)
        that.setData({
            id: e.id
        })

        that.setData({
            /*   "info": {
                  "id": 1,
                  "name": "小鸡炖蘑菇",
                  "summary": '<p>多色可选的马甲</p><p><img src="http://www.timeface.cn/uploads/times/2015/07/071031_f5Viwp.jpg"/></p><p><br/>相当好吃了</p>',
                  "total_count": 2,
                  "comment_count": 2,
                  "stock": 2,
                  "price": "80.00",
                  "main_image": "/images/food.jpg",
                  "pics": [ '/images/food.jpg','/images/food.jpg' ]
              }, */
            shopCarNum: app.getCache("cart").length,
            buyNumMax: 5,
            /* commentList: [
                {
                    "score": "好评",
                    "date": "2017-10-11 10:20:00",
                    "content": "非常好吃，一直在他们加购买",
                    "user": {
                        "avatar_url": "/images/more/logo.png",
                        "nick": "angellee"
                    }
                },
                {
                    "score": "好评",
                    "date": "2017-10-11 10:20:00",
                    "content": "非常好吃，一直在他们加购买",
                    "user": {
                        "avatar_url": "/images/more/logo.png",
                        "nick": "angellee"
                    }
                }
            ] */
        });




    },
    onShow() {
        this.getInfo()
        this.getComment()

    },
    goShopCar: function () {
        wx.reLaunch({
            url: "/pages/cart/index"
        });
    },
    toAddShopCar: function () {
        this.setData({
            shopType: "addShopCar"
        });
        this.bindGuiGeTap();
    },
    tobuy: function () {
        this.setData({
            shopType: "tobuy"
        });
        this.bindGuiGeTap();
    },
    addShopCar: function () {
        var that = this
        var data = {
            active: true,
            food_id: that.data.info.id,
            number: that.data.buyNumber,
            singlePrice: that.data.info.price,
            name: that.data.info.name,
            pic_url: that.data.info.pics[0]
        }
        if (that.data.buyNumber > that.data.info.stock) {
            app.alert({
                title: "加入失败",
                content: "库存不足"
            })
            return
        }
        var cart = app.getCache("cart")
        var flag = false
        cart.forEach(e => {
            if (e.food_id == that.data.id) {
                e.number += data.number
                flag = true
            }
        })
        if (!flag) cart.push(data)


        app.setStorage("cart", cart)
        that.setData({
            shopCarNum: cart.length
        })
        this.setData({
            hideShopPopup: true
        })
    },

    buyNow: function () {

        var goods = [{
            "id": this.data.info.id,
            "price": this.data.info.price,
            "number": this.data.buyNumber,
            "pic_url": this.data.info.pics[0]
        }]


        this.setData({
            hideShopPopup: true
        })
        app.setStorage("orderGoods", goods)
        wx.navigateTo({
            url: "/pages/order/index"
        });

    },
    /**
     * 规格选择弹出框
     */
    bindGuiGeTap: function () {
        this.setData({
            hideShopPopup: false
        })
    },
    /**
     * 规格选择弹出框隐藏
     */
    closePopupTap: function () {
        this.setData({
            hideShopPopup: true
        })
    },
    numJianTap: function () {
        if (this.data.buyNumber <= this.data.buyNumMin) {
            return;
        }
        var currentNum = this.data.buyNumber;
        currentNum--;
        this.setData({
            buyNumber: currentNum
        });
    },
    numJiaTap: function () {
        if (this.data.buyNumber >= this.data.buyNumMax) {
            return;
        }
        var currentNum = this.data.buyNumber;
        currentNum++;
        this.setData({
            buyNumber: currentNum
        });
    },
    getInfo: function () {
        var that = this
        wx.request({
            url: "http://localhost:8080/sell/buyer/product/detail?" + "productId=" + that.data.id,
            data: {

            },
            type: 'get',
            success: function (res) {
                console.log("res", res.data)
                var info = {
                    "id": that.data.id,
                    "name": res.data.productName,
                    "summary": '<p>' + res.data.productDescription + '</p><p><img src="' + res.data.productIcon + '"/></p><p><br/>相当好吃了</p>',

                    "stock": res.data.productStock,
                    "price": res.data.productPrice,
                    "main_image": res.data.productIcon,
                    "pics": [res.data.productIcon, res.data.productIcon]
                }
                //console.log("info",that.data.info)
                that.setData({
                    info: info
                })
                WxParse.wxParse('article', 'html', that.data.info.summary, that, 5);
                console.log("info", that.data.info)
            }
        })
    },
    getComment: function () {
        var comment = app.getCache("comment") || []
        comment.forEach(el => {
            if (el.id == this.data.id) {
                this.setData({
                    commentList: el.commentList,
                    commentCount: el.commentList.length
                })
            }
        })
    },
    addComment() {
        wx.navigateTo({
            url: "/pages/food/comment?id="+this.data.id
        });
    },
    //事件处理函数
    swiperchange: function (e) {
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    onShareAppMessage: function () {
        var that = this
        return {
            title: that.data.info.name,
            path: '/page/food/info?id=' + that.data.info.id,
            success(res) {

            },
            fail(res) {

            }
        }
    }

});
