// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRondom()
  },

  /**
   * 随机获取热门电影
   */
  getRondom() {
    let self = this
    wx.showLoading({
      title: '正在加载中...',
    })
    qcloud.request({
      url: config.service.rondom,
      success: function(response) {
        wx.hideLoading()
        if (!response.data.code) {
          self.setData({
            movie: response.data.data
          })
        } else {
          wx.showToast({
            title: '加载数据失败',
          })
        }
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载数据失败',
        })
      }
    });
  },

  goDetail(event) {
    let m = JSON.stringify(this.data.movie)
    wx.navigateTo({
      url: `/pages/detail/detail?movie=${m}`,
    })
  },

  goHot(event) {
    wx.navigateTo({
      url: '/pages/hot-movie/hot-movie',
    })
  },

  goPersonal(event) {

  }
})