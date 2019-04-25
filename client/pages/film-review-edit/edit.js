// pages/film-review/edit.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: "",
    title: "",
    id: 0,
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title
    let image = options.image
    let id = options.id
    this.setData({
      image: image,
      title: title,
      id: id
    })
  },

  onInput(event) {
    this.setData({
      content: event.detail.value.trim()
    })
  },

  // 发布影评
  addReview() {
    let content = this.data.content;
    if (!content) return

    wx.showLoading({
      title: '正在发布影评...',
    })

    let id = this.data.id

    qcloud.request({
      url: config.service.addrReview,
      method: 'POST',
      login: true,
      data: {
        id: id,
        content: content
      },
      success: result => {
        wx.hideLoading();
        let data = result.data;
        if (!data.code) {
          wx.showToast({
            icon: 'none',
            title: '发布成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '发布失败'
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
      }
    })
  },
})