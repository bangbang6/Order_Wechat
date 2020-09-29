//login.js
//获取应用实例
var app = getApp();
Page({
    data: {
        remind: '加载中',
        angle: 0,
        userInfo: {},
        regFlag: false,
    },
    goToIndex: function () {
        wx.switchTab({
            url: '/pages/food/index',
        });
    },
    onLoad: function () {
        app.setStorage("cart", [])
        wx.setNavigationBarTitle({
            title: app.globalData.shopName
        })
        this.checkLogin();

    },
    onShow: function () {

    },
    onReady: function () {
        var that = this;
        setTimeout(function () {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function (res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) { angle = 14; }
            else if (angle < -14) { angle = -14; }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    },
    checkLogin() {
        var that = this;
        if (app.getCache("openid")) this.setData({ regFlag: true })
    },
    login(e) {
        //app.console(e);
        if (!e.detail.userInfo) {
            app.alert({ content: "登入失败" });
            return;
        }
        var data = e.detail.userInfo;
        var that = this;
        wx.login({
            success: function (res) {
                if (!res.code) {
                    app.alert({ content: "登录失败,重试" })
                    return;
                }

                data.code = res.code;
                //app.setStorage("userInfo",re)
                wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx325d1eaa3823e1cc&secret=cc9f21fdfd1fdc13313a0581aa8e44bf&js_code=' + res.code + '&grant_type=authorization_code ',
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function (res) {
                        console.log(res);

                        wx.setStorage({
                            key: 'openid',
                            data: res.data.openid,

                        })

                        that.goToIndex();
                    },

                })
            }
        })
        //传到后端用户接口
        /* wx.request({
             url: "http://xxx",
             header: app.getRequsetHeader(),
             method: "post",
             data:data,
             success: function (e) {
                 console.log(e);
             }
         })*/
    }
});