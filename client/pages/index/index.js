// pages/main/index/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    //摄像头为前置还是后置
    device: 'back',
    //设置摄像头是否打开 
    cameraOn: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setData({
      cameraOn: true
    })
    console.log("show cameraOn: " + this.data.cameraOn)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      cameraOn: false
    })
    console.log("hide cameraOn: " + this.data.cameraOn)
  },

  //拍照接口
  takePhoto: function () {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
        });
        wx.navigateTo({
          url: '../chat/chat?imgUrl=' + res.tempImagePath,
        })
      }
    });

  },

  //用户不允许使用摄像头时触发
  error(e) {
  },

  // 上传图片接口
  doUpload: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        //跳转到聊天室页面
        wx.navigateTo({
          url: '../chat/chat?imgUrl=' + filePath,
        })
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  //转到我的页面
  toMine: function () {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },

  //切换摄像头
  checkDevice: function () {
    if (this.data.device == 'back') {
      this.setData({
        device: 'front'
      })
    } else if (this.data.device == 'front') {
      this.setData({
        device: 'back'
      })
    }
  }

})