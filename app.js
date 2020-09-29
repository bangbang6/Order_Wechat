//app.js
App({
    onLaunch: function () {
    },
    globalData: {
        userInfo: null,
        version: "1.0",
        shopName: "RK点餐",
        domain: "http://localhost:8080/sell"
    },
    tip: function (params) {
        var that = this;
        var title = params.hasOwnProperty('title') ? params['title'] : '提示信息';
        var content = params.hasOwnProperty('content') ? params['content'] : '';
        wx.showModal({
            title: title,
            content: content,
            success: function (res) {

                if (res.confirm) {//点击确定
                    if (params.hasOwnProperty('cb_confirm') && typeof (params.cb_confirm) == "function") {
                        params.cb_confirm();
                    }
                } else {//点击否
                    if (params.hasOwnProperty('cb_cancel') && typeof (params.cb_cancel) == "function") {
                        params.cb_cancel();
                    }
                }
            }
        })
    },
    alert: function (params) {
        var title = params.hasOwnProperty('title') ? params['title'] : '提示信息';
        var content = params.hasOwnProperty('content') ? params['content'] : '';
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {//用户点击确定
                    if (params.hasOwnProperty('cb_confirm') && typeof (params.cb_confirm) == "function") {
                        params.cb_confirm();
                    }
                } else {
                    if (params.hasOwnProperty('cb_cancel') && typeof (params.cb_cancel) == "function") {
                        params.cb_cancel();
                    }
                }
            }
        })
    },
    console: function (msg) {
        console.log(msg);
    },
    getRequestHeader: function () {
        return {
            'content-type': 'application/x-www-form-urlencoded'
        }
    },
    getCache: function (key) {
        var value = wx.getStorageSync(key);
        return value;
    },
    setStorage: function (key, value) {
        wx.setStorage({
            key: key,
            data: value,

        })
    }
});