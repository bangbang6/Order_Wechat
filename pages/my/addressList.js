//获取应用实例
var app = getApp();
Page({
    data: {
        addressList: []
    },
    selectTap: function (e) {
        //从商品详情下单选择地址之后返回
        var addressList = app.getCache("addressList")
        var newAdd = []
        for (let i = 0; i < addressList.length; i++) {
            if (addressList[i].id != e.currentTarget.dataset.id) {
                addressList[i].isDefault = 0;

            } else {
                addressList[i].isDefault = 1;
            }
            newAdd.push(addressList[i])
        }
        app.setStorage("addressList", newAdd)
        wx.navigateBack({});
    },
    addessSet: function (e) {
        console.log(e)
        wx.navigateTo({
            url: "/pages/my/addressSet?id=" + e.currentTarget.dataset.id
        })
    },
    onShow: function () {
        var that = this;
        /*  that.setData({
             addressList: [
                 {
                     id: 1,
                     name: "编程浪子",
                     mobile: "12345678901",
                     detail: "上海市浦东新区XX",
                     isDefault: 1
                 },
                 {
                     id: 2,
                     name: "编程浪子888",
                     mobile: "12345678901",
                     detail: "上海市浦东新区XX"
                 }
             ]
         }); */
        //获取列表
        var addressList = app.getCache("addressList")
        that.setData({
            addressList
        })
    }
});
