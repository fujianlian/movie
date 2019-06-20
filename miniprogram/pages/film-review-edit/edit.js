// pages/film-review/edit.js

const recorderManager = wx.getRecorderManager()
var tempFilePath
var time

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
    startPoint: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    recorderManager.onStop(this.onVoiceStop);
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
          url: `/pages/film-review-preview/preview?id=${id}&image=${image}&content=${content}&title=${title}&type=${type}`
        })
      }
    } else {
      if (tempFilePath) {
        tempFilePath = tempFilePath.replace("=", "x-y")
        wx.navigateTo({
          url: `/pages/film-review-preview/preview?id=${id}&image=${image}&title=${title}&type=${type}&audio=${tempFilePath}&time=${time}`,
        })
      }
    }
  },

  voiceStartRecord() {
    console.log('start record');
    recorderManager.start({
      // 最大长度设置为 2 分钟
      duration: 2 * 60 * 1000,
      // 格式
      format: 'mp3',
      sampleRate: 16000,
      encodeBitRate: 25600,
      frameSize: 9,
      numberOfChannels: 1
    })
  },

  voiceEndRecord() {
    console.log('stop record')
    recorderManager.stop()
  },

  onVoiceStop(voiceInfo) {
    tempFilePath = voiceInfo.tempFilePath
    let duration = voiceInfo.duration
    this.setData({
      text: "长按录音",
    })
    //结束录音、隐藏Toast提示框
    wx.hideToast()
    // 不允许小于 1 秒
    if (duration < 1000) {
      wx.showToast({
        title: "录音过短",
        icon: "none"
      })
      return;
    }
    time = duration / 1000;
    this.addReview()
  },

  touchMove(e) {
    //touchmove时触发
    var moveLenght = e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY; //移动距离
    if (Math.abs(moveLenght) > 50) {
      wx.showToast({
        title: "松开手指，取消保存",
        icon: "none",
        duration: 60000,
      })
    } else {
      wx.showToast({
        title: "正在录音，上划取消保存",
        icon: "none",
        duration: 60000,
      })
    }
  }
})