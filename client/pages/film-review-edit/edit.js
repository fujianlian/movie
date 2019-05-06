// pages/film-review/edit.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const recorderManager = wx.getRecorderManager()
var tempFilePath

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: "",
    title: "",
    id: 0,
    type: "",
    content: "",
    text: "长按录音",
    // 记录长按录音开始点信息,用于后面计算滑动距离。
    startPoint: {},
    // 发送锁，当为true时上锁，false时解锁发送
    sendLock: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title
    let image = options.image
    let id = options.id
    let type = options.type
    this.setData({
      image: image,
      title: title,
      id: id,
      type: type
    })
  },

  onInput(event) {
    this.setData({
      content: event.detail.value.trim()
    })
  },

  // 发布影评
  addReview() {
    let type = this.data.type
    let id = this.data.id
    let image = this.data.image
    let title = this.data.title
    if (this.data.type === 'text') {
      let content = this.data.content;
      if (content) {
        wx.navigateTo({
          url: `/pages/film-review-preview/preview?id=${id}&image=${image}&content=${content}&title=${title}&type=${type}`,
        })
      }
    } else {
      let tempFilePath = this.tempFilePath
      if (tempFilePath) {
        tempFilePath = tempFilePath.replace("=", "x-y")
        wx.navigateTo({
          url: `/pages/film-review-preview/preview?id=${id}&image=${image}&title=${title}&type=${type}&audio=${tempFilePath}`,
        })
      }
    }
  },

  //开始录音的时候
  start: function() {
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //停止录音
  stop: function() {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      if (!this.data.sendLock) {
        this.tempFilePath = res.tempFilePath
        console.log('停止录音', res.tempFilePath)
        const {
          tempFilePath
        } = res
        this.addReview()
      }
    })

  },

  longTap: function() {
    console.log('longTap....')
  },

  touchStart(e) {
    console.log('touchStart....')
    this.setData({
      startPoint: e.touches[0],
      text: "松开保存",
      sendLock: false
    })
    this.start(); //开始录音
    wx.showToast({
      title: "正在录音，上划取消保存",
      icon: "none",
      duration: 60000 //先定义个60秒，后面可以手动调用wx.hideToast()隐藏
    });
  },


  touchEnd: function() {
    console.log('touchEnd....')
    this.setData({
      text: "长按录音",
    })
    //结束录音、隐藏Toast提示框
    wx.hideToast();
    this.stop()
  },

  touchMove(e) {
    //touchmove时触发
    var moveLenght = e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY; //移动距离
    if (Math.abs(moveLenght) > 50) {
      wx.showToast({
        title: "松开手指，取消保存",
        icon: "none",
        duration: 60000
      });
      this.setData({
        sendLock: true
      })
    } else {
      wx.showToast({
        title: "正在录音，上划取消保存",
        icon: "none",
        duration: 60000
      });
      this.setData({
        sendLock: false
      })
    }
  },
})