// pages/hot-movie/hot-movie.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(true)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getList(false, () => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 获取热门电影列表
   */
  getList(isFirst, callback) {
    let self = this
    if (isFirst) {
      wx.showLoading({
        title: '正在加载中...',
      })
    }
    qcloud.request({
      url: config.service.movieList,
      success: function(response) {
        if (!response.data.code) {
          self.setData({
            movieList: response.data.data
          })
        } else {
          wx.showToast({
            title: '加载数据失败',
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '加载数据失败',
        })
      },
      complete: () => {
        wx.hideLoading()
        callback && callback()
      }
    });
  },

  goDetail(event) {
    let index = event.currentTarget.dataset.index
    let m = JSON.stringify(this.data.movieList[index])
    wx.navigateTo({
      url: `/pages/movie-detail/detail?movie=${m}`,
    })
  },

})