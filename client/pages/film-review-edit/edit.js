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
    type: "",
    content: ""
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
    if (this.data.type === 'text') {
      let content = this.data.content
      let id = this.data.id
      let image = this.data.image
      let title = this.data.title
      if (content) {
        wx.navigateTo({
          url: `/pages/film-review-preview/preview?id=${id}&image=${image}&content=${content}&title=${title}&type=${type}`,
        })
      }
    }
  }
})