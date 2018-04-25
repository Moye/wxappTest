//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

var app = getApp();
var that;
//要发送的对话列表
var chatListData = [];
//
var speakerInterval;
var imgTmp;

Page({
  data: {
    defaultCorpus: '你都会什么',
    //用户的输入
    askWord: '',
    //是否发送信息,true 为不发送
    sendButtDisable: true,
    userInfo: {},
    //
    chatList: [],
    //scroll-into-view属性：值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
    scrolltop: '',
    userLogoUrl: '../image/user_default.png',
    keyboard: true,

    //是否正在语音输入
    isSpeaking: false,
    speakerUrl: '../image/speaker0.png',
    //语音输入时的麦克风帧动画图片前缀
    speakerUrlPrefix: '../image/speaker',
    //语音输入时的麦克风帧动画图片后缀
    speakerUrlSuffix: '.png',
    //录音文件地址
    filePath: null,
    contactFlag: true,
    imgUrl: null,

    // 印刷体识别
    ocrImgUrl: '',
    ocrResult: [],
    showOcrResult: false,

    voice: ''
  },

  onLoad: function (options) {
    that = this;
    imgTmp = options.imgUrl;
    app.getUserInfo(function (userInfo) {
      var aUrl = userInfo.avatarUrl;
      if (aUrl != null) {
        that.setData({
          userLogoUrl: aUrl,
          imgUrl: options.imgUrl,
        });
      }
    });
    that.addChat('', 'p');
  },

  //打开相机,实际是回到主页面
  openCamera: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  // 选择图片
  checkPic: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0]
        that.setData({
          imgTmp: filePath
        });
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  //文字转语音;并未实现
  textToSpeech: function () {
    wx.request({
      url: config.service.ciUrl,
      data: {
        text: "this.data.ocrResult"
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('textToSpeech: ' + JSON.stringify(res));
      }
    })
  },


  //图片标签识别
  doWordIndentify: function () {
    let that = this

    that.setData({
      showOcrResult: false
    })

    // 选择图片和上传图片
    this._chooseImgAndUpload(
      // 上传图片之前
      function (filePath) {
        that.setData({
          ocrImgUrl: filePath
        })
      },
      config.service.ciUrl + '?action=idContent',
      // 调用成功
      function (res) {
        console.log(res)
        util.showSuccess('识别成功')
        var data = JSON.parse(res.data)

        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }
        var info = data.data
        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }
        that.setData({
          showOcrResult: true,
          ocrResult: info.tags
        })
        that.addChat('<<<', 'l');
      },
      // 调用失败
      function (e) {
        console.log(e)
        util.showModel('识别失败' + e.message)
      }
    );
  },

  /**
   * 统一封装选择图片和上传图片的 API
   * @param {Function} beforUpload 开始上传图片之前执行的函数
   * @param {Function} success     调用成功时执行的函数
   * @param {Function} fail        调用失败时执行的函数
   */
  _chooseImgAndUpload(beforUpload, url, success, fail) {
    var filePath = imgTmp;
    console.log('img: ' + filePath);
    beforUpload(filePath)
    // 上传图片
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      success: success,
      fail: fail
    })
    console.log('url: ' + url);
    console.log('file: ' + filePath);
  },

  onReady: function () {
  },

  // 切换语音输入和文字输入
  switchInputType: function () {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },

  // 监控输入框输入
  Typing: function (e) {
    var inputVal = e.detail.value;
    var buttDis = true;
    if (inputVal.length != 0) {
      var buttDis = false;
    }
    that.setData({
      sendButtDisable: buttDis,
    })
  },

  // 按钮按下
  touchdown: function () {
    var _this = this;
    this.setData({
      isSpeaking: true,
    })
    that.speaking.call();
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath;
        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径
            //本地文件存储的大小限制为 100M
            var savedFilePath = res.savedFilePath;
            that.setData({
              voice: savedFilePath
            })
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })
      }
    });
  },

  // 按钮松开
  touchup: function () {
    wx.stopRecord();
    this.setData({
      isSpeaking: false,
      speakerUrl: '../image/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    wx.stopRecord();
    that.addChat('', 'v');
  },

  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  // 发送语料到语义平台
  sendChat: function (e) {
    let word = e.detail.value.ask_word ? e.detail.value.ask_word : e.detail.value;
    that.addChat(word, 'r');
    that.setData({
      askWord: '',
      sendButtDisable: true,
    });
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation) {
    that.addChatWithFlag(word, orientation, true);
  },

  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (word, orientation, scrolltopFlag) {
    let ch = { 'text': word, 'time': new Date().getTime(), 'orientation': orientation };
    chatListData.push(ch);
    var charlenght = chatListData.length;
    if (scrolltopFlag) {
      that.setData({
        chatList: chatListData,
        scrolltop: "roll" + charlenght,
      });
    } else {
      that.setData({
        chatList: chatListData,
      });
    }
  },

  // 麦克风帧动画 
  speaking: function () {
    //话筒帧动画 
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      i = i % 7;
      that.setData({
        speakerUrl: that.data.speakerUrlPrefix + i + that.data.speakerUrlSuffix,
      });
    }, 300);
  }
})