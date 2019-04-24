// pages/film-review-detail/detail.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    review: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let review = this.data.review
    review = JSON.parse(options.review)
    review.username = review.username + '的影评'
    this.setData({
      review
    })
  },

  // 收藏影评
  collectReview() {
    wx.showLoading({
      title: '正在收藏影评...',
    })

    let review_id = this.data.review.review_id
    qcloud.request({
      url: config.service.collect,
      method: 'POST',
      login: true,
      data: {
        id: review_id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          this.setData({
            isTrolleyEdit: false
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏影评失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '收藏影评失败'
        })
      }
    })
  },

  // 写影评
  editReview() {
    let image = this.data.review.image
    let id = this.data.review.movie_id
    let title = this.data.review.title
    wx.navigateTo({
      url: `/pages/film-review-edit/edit?title=${title}&id=${id}&image=${image}`,
    })
  }
})