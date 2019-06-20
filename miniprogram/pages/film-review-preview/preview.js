// pages/film-review-preview/preview.js

const db = require('../../utils/db')
const util = require('../../utils/util')
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    content: "",
    audio: "",
    username: "",
    avatar: "",
    seconds: 0,
    movieId: "",
    image: "",
    title: "",
    id: 0,
    type: "",
    text: "",
    isPlay: false,
    isUpload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('尚未通过身份验证');
    })

    let title = options.title
    let image = options.image
    let id = options.id
    let type = options.type
    let content = type === 'text' ? options.content : ""
    let audio = type === 'audio' ? options.audio.replace("x-y", "=") : ""
    let seconds = type === 'audio' ? Math.round(options.time) : 0
    let text = seconds + "s"

    this.setData({
      image: image,
      title: title,
      movieId: id,
      type: type,
      content: content,
      audio: audio,
      seconds: seconds,
      text: text
    })
    if (type === 'audio') {
      innerAudioContext.src = audio
    }
  },

  // 发布影评
  addReview() {
    let id = this.data.id
    if (this.data.type === 'audio') {
      this.uploadAudio()
    } else {
      let data = {
        content: this.data.content,
        audio: "",
        seconds: 0,
        movieId: this.data.movieId,
        username: this.data.userInfo.nickName,
        avatar: this.data.userInfo.avatarUrl
      }
      wx.showLoading({
        title: '正在发布影评...',
      })
      this.uploadPreview(data)
    }
  },

  // 上传影评
  uploadPreview(data) {
    console.log(data)
    db.addReview(data).then(result => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '发布成功'
      })
      wx.navigateTo({
        url: `/pages/film-review-list/list?id=${data.movieId}&image=${this.data.image}`,
      })
      this.setData({
        isUpload: false
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '发布失败'
      })
      this.setData({
        isUpload: false
      })
    })
  },

  // 上传录音接口
  uploadAudio() {
    if (this.data.isUpload) {
      return
    }
    let filePath = this.data.audio
    wx.showLoading({
      title: '正在发布影评...',
    })
    this.setData({
      isUpload: true
    })

    db.uploadAudio(filePath).then(result => {
      let audio = result.fileID

      let data = {
        content: "",
        audio: result.fileID,
        seconds: this.data.seconds,
        movieId: this.data.movieId,
        username: this.data.userInfo.nickName,
        avatar: this.data.userInfo.avatarUrl
      }
      this.uploadPreview(data)
    }).catch(err => {
      console.log('err', err)
      wx.showToast({
        icon: 'none',
        title: '上传录音失败'
      })
      this.setData({
        isUpload: false
      })
    })
  },

  // 播放声音/停止播放
  playAndStop() {
    let that = this
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onEnded((res) => {
      that.setData({
        text: `${this.data.seconds}s`,
        isPlay: false
      })
    })
    if (!innerAudioContext.paused) {
      innerAudioContext.pause()
      innerAudioContext.onPause(() => {
        that.setData({
          text: `${this.data.seconds}s`,
          isPlay: false
        })
      })
    } else {
      innerAudioContext.autoplay = true
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        that.setData({
          text: '正在播放',
          isPlay: true
        })
      })
    }
  },

  back() {
    wx.navigateBack()
  }
})