//获取应用实例
var app = getApp();
Page({
    data: {},
    onLoad() {

    },
    onShow() {
        let that = this;
        that.setData({
            user_info: {
                nickname: "尘哀",
                avatar_url: "/images/more/logo.png"
            },
        })

    }
});