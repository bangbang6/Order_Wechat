//获取应用实例
var commonCityData = require('../../utils/city.js');
var app = getApp();
Page({
    data: {
        provinces: [],
        citys: [],
        districts: [],
        selProvince: '请选择',
        selCity: '请选择',
        selDistrict: '请选择',
        selProvinceIndex: 0,
        selCityIndex: 0,
        selDistrictIndex: 0,

    },
    onLoad: function (e) {
        var that = this;

        that.setData({
            id: e.id
        });
        this.initCityData(1);
    },
    onShow() {
        console.log('onshow')
        var newId = this.data.newId + 1
        this.setData({
            newId: newId
        })
        this.getInfo()
    },
    //初始化城市数据
    initCityData: function (level, obj) {
        if (level == 1) {
            var pinkArray = [];
            for (var i = 0; i < commonCityData.cityData.length; i++) {
                pinkArray.push(commonCityData.cityData[i].name);
            }
            this.setData({
                provinces: pinkArray
            });
        } else if (level == 2) {
            var pinkArray = [];
            var dataArray = obj.cityList
            for (var i = 0; i < dataArray.length; i++) {
                pinkArray.push(dataArray[i].name);
            }
            this.setData({
                citys: pinkArray
            });
        } else if (level == 3) {
            var pinkArray = [];
            var dataArray = obj.districtList
            for (var i = 0; i < dataArray.length; i++) {
                pinkArray.push(dataArray[i].name);
            }
            this.setData({
                districts: pinkArray
            });
        }
    },
    bindPickerProvinceChange: function (event) {
        var selIterm = commonCityData.cityData[event.detail.value];
        this.setData({
            selProvince: selIterm.name,
            selProvinceIndex: event.detail.value,
            selCity: '请选择',
            selCityIndex: 0,
            selDistrict: '请选择',
            selDistrictIndex: 0
        });
        this.initCityData(2, selIterm);
    },
    bindPickerCityChange: function (event) {
        var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
        this.setData({
            selCity: selIterm.name,
            selCityIndex: event.detail.value,
            selDistrict: '请选择',
            selDistrictIndex: 0
        });
        this.initCityData(3, selIterm);
    },
    bindPickerChange: function (event) {
        var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
        if (selIterm && selIterm.name && event.detail.value) {
            this.setData({
                selDistrict: selIterm.name,
                selDistrictIndex: event.detail.value
            })
        }
    },
    bindCancel: function () {
        wx.navigateBack({});
    },
    bindSave: function (e) {
        var that = this;
        var nickname = e.detail.value.nickname;
        var address = e.detail.value.address;
        var mobile = e.detail.value.mobile;

        if (nickname == "") {
            app.tip({ content: '请填写联系人姓名~~' });
            return
        }
        if (mobile == "") {
            app.tip({ content: '请填写手机号码~~' });
            return
        }
        if (this.data.selProvince == "请选择") {
            app.tip({ content: '请选择地区~~' });
            return
        }
        if (this.data.selCity == "请选择") {
            app.tip({ content: '请选择地区~~' });
            return
        }
        var city_id = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
        var district_id;
        if (this.data.selDistrict == "请选择" || !this.data.selDistrict) {
            district_id = '';
        } else {
            district_id = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
        }
        if (address == "") {
            app.tip({ content: '请填写详细地址~~' });
            return
        }
        var addressList = app.getCache("addressList") || []
        if (that.data.id == "-1") {
            addressList.push({
                id: Date.now(),
                province_id: commonCityData.cityData[this.data.selProvinceIndex].id,
                province_str: that.data.selProvince,
                city_id: city_id,
                city_str: that.data.selCity,
                district_id: district_id,
                district_str: that.data.selDistrict,
                nickname: nickname,
                address: address,
                mobile: mobile,
                isDefault: 0
            })
            app.setStorage("addressList", addressList)
            wx.navigateBack({});
        } else {
            var newAdd = []
            addressList.forEach(add => {
                if (add.id == that.data.id) {
                    newAdd.push({
                        id: that.data.id,
                        province_id: commonCityData.cityData[this.data.selProvinceIndex].id,
                        province_str: that.data.selProvince,
                        city_id: city_id,
                        city_str: that.data.selCity,
                        district_id: district_id,
                        district_str: that.data.selDistrict,
                        nickname: nickname,
                        address: address,
                        mobile: mobile,
                        isDefault: 0
                    })
                } else {
                    newAdd.push(add)
                }
            })
            app.setStorage("addressList", newAdd)
            wx.navigateBack({});
        }


    },
    deleteAddress: function (e) {
        // console.log("delete",newList)
        var addressList = app.getCache("addressList")
        var newList = []
        addressList.forEach(ele => {
            if (ele.id != this.data.id) {
                newList.push(ele)
            }
        });
        app.setStorage("addressList", newList)
        wx.navigateBack({});
    },
    getInfo() {

        var addressList = app.getCache("addressList")
        if (addressList.length == 0) return
        addressList.forEach(info => {
            if (info.id == this.data.id) {
                this.setData({
                    info: info,
                    selProvince: info.province_str ? info.province_str : "请选择",
                    selCity: info.city_str ? info.city_str : "请选择",
                    selDistrict: info.district_str ? info.district_str : "请选择"
                })
                return
            }
        });

    }
});
