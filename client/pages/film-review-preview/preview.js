// pages/film-review-preview/preview.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    audio: "",
    image: "",
    title: "",
    id: 0,
    type: "",
    time: 0,
    text: "",
    isPlay: false,
    isUpload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title
    let image = options.image
    let id = options.id
    let type = options.type
    let content = type === 'text' ? options.content : ""
    let audio = type === 'audio' ? options.audio.replace("x-y", "=") : ""
    let that = this
    this.setData({
      image: image,
      title: title,
      id: id,
      type: type,
      content: content,
      audio: audio
    })
    if (type === 'audio') {
      innerAudioContext.src = audio
      innerAudioContext.onCanplay(() => {
        setTimeout(function() {
          console.log(innerAudioContext.duration)
          let time = Math.round(innerAudioContext.duration) === 0 ? 1 : Math.round(innerAudioContext.duration)
          that.setData({
            time: time,
            text: `${time}s`
          })
        }, 200)  //这里设置延时1秒获取
      })
    }
  },

  // 发布影评
  addReview() {
    let id = this.data.id
    if (this.data.type === 'audio') {
      this.uploadAudio()
    } else {
      let content = this.data.content;
      if (!content) return

      let data = {
        id: id,
        content: content
      }

      wx.showLoading({
        title: '正在发布影评...',
      })

      this.uploadPreview(data)
    }
  },

  // 上传影评
  uploadPreview(data) {
    let id = this.data.id
    qcloud.request({
      url: config.service.addrReview,
      method: 'POST',
      login: true,
      data: data,
      success: result => {
        wx.hideLoading();
        let data = result.data;
        if (!data.code) {
          wx.showToast({
            icon: 'none',
            title: '发布成功'
          })
          wx.navigateTo({
            url: `/pages/film-review-list/list?id=${id}`,
          })
          that.setData({
            isUpload: false
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
          that.setData({
            isUpload: false
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
        that.setData({
          isUpload: false
        })
      }
    })
  },

  // 上传录音接口
  uploadAudio() {
    if (this.data.isUpload) {
      return
    }
    let that = this
    let id = this.data.id
    let filePath = this.data.audio
    let second = Math.round(innerAudioContext.duration) === 0 ? 1 : Math.round
    wx.showLoading({
      title: '正在发布影评...',
    })
    this.setData({
      isUpload: true
    })
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: filePath,
      name: 'file',
      success: function(res) {

        res = JSON.parse(res.data)
        console.log(res.data)
        let data = {
          id: id,
          audio: res.data.imgUrl,
          second: second
        }
        that.uploadPreview(data)
      },

      fail: function(e) {
        wx.showToast({
          icon: 'none',
          title: '上传录音失败'
        })
        that.setData({
          isUpload: false
        })
      }
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
        text: `${this.data.time}s`,
        isPlay: false
      })
    })
    if (!innerAudioContext.paused) {
      console.log("paused")
      innerAudioContext.onPause(() => {
        that.setData({
          text: `${this.data.time}s`,
          isPlay: false
        })
      })
    } else {
      innerAudioContext.autoplay = true
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