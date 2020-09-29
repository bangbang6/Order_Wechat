//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        swiperCurrent: 0,
        categories: [],
        activeCategoryId: 1,
        goods: [],
        scrollTop: "0",
        loadingMoreHidden: true,
        searchInput: '',
        allMessage: [],
    },
    onLoad: function () {
        var that = this;

        wx.setNavigationBarTitle({
            title: app.globalData.shopName
        });
        this.getFoodAndCategory()
        this.getBanner()
        that.setData({

            /* banners: [
                {
                    "id": 1,
                    "pic_url": "/images/food.jpg"
                },
                {
                    "id": 2,
                    "pic_url": "/images/food.jpg"
                },
                {
                    "id": 3,
                    "pic_url": "/images/food.jpg"
                }
            ], */
            /* categories: [
                { id: 0, name: "全部" },
                { id: 1, name: "川菜" },
                { id: 2, name: "东北菜" },
            ], */
            activeCategoryId: 1,
            /*  goods: [
                 {
                     "id": 1,
                     "name": "小鸡炖蘑菇-1",
                     "min_price": "15.00",
                     "price": "15.00",
                     "pic_url": "/images/food.jpg"
                 },
                 {
                     "id": 2,
                     "name": "小鸡炖蘑菇-1",
                     "min_price": "15.00",
                     "price": "15.00",
                     "pic_url": "/images/food.jpg"
                 },
                 {
                     "id": 3,
                     "name": "小鸡炖蘑菇-1",
                     "min_price": "15.00",
                     "price": "15.00",
                     "pic_url": "/images/food.jpg"
                 },
                 {
                     "id": 4,
                     "name": "小鸡炖蘑菇-1",
                     "min_price": "15.00",
                     "price": "15.00",
                     "pic_url": "/images/food.jpg"
                 }
 
             ], */
            /* loadingMoreHidden: false */
        });
    },
    scroll: function (e) {
        var that = this, scrollTop = that.data.scrollTop;
        that.setData({
            scrollTop: e.detail.scrollTop
        });
    },
    //事件处理函数
    swiperchange: function (e) {
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    listenerSearchInput: function (e) {
        this.setData({
            searchInput: e.detail.value
        });
    },
    toSearch: function (e) {
        this.setData({
            p: 1,
            goods: [],
            loadingMoreHidden: true
        });
        this.getFoodList();
    },
    tapBanner: function (e) {
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/pages/food/info?id=" + e.currentTarget.dataset.id
            });
        }
    },
    toDetailsTap: function (e) {
        wx.navigateTo({
            url: "/pages/food/info?id=" + e.currentTarget.dataset.id
        });
    },
    getFoodAndCategory: function (e) {
        var categories = []
        var that = this
        wx.request({
            url: "http://localhost:8080/sell/buyer/product/list",
            type: 'get',
            data: {},
            success: function (res) {
                console.log("all message ", res.data);

                that.setData({
                    allMessage: res.data.data
                })
                //设置菜单

                res.data.data.forEach(e => {
                    var categorie = {
                        name: e.name,
                        id: e.type
                    }
                    categories.push(categorie)
                });
                that.setData({
                    categories: categories
                })

                //设置餐品
                res.data.data.forEach(e => {
                    console.log("e.type ", e.type)
                    console.log(".activeCategoryId ", that.data.activeCategoryId)
                    if (e.type == that.data.activeCategoryId) {
                        that.setData({
                            goods: e.foods
                        })
                    }
                })
                //this.getAllfoods(res.data.data)
            }
        })

    },
    getBanner: function (e) {
        var that = this
        wx.request({
            url: "http://localhost:8080/sell/buyer/product/recommand",
            type: 'get',
            data: {},
            success: function (res) {
                var data = res.data.data
                var banners = []
                data.forEach(e => {
                    e.foods.forEach(el => {
                        var obj = {
                            id: el.id,
                            url: el.icon
                        }
                        banners.push(obj)
                    })
                })

                that.setData({
                    banners
                })
            }
        })
    },
    /*   getAllfoods:function(allMessage){
          var foods=[];
          allMessage.forEach(e=>{
              foods.concat(e.foods)
          })
          app.setStorage("product",foods)
      } */

    catClick: function (e) {
        this.setData({
            activeCategoryId: e.currentTarget.id
        })
        this.getFoodAndCategory()
    }

});
