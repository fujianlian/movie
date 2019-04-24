// pages/film-review-list/list.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    reviewList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.setData({
      id: id
    })
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getList(false, () => {
      wx.stopPullDownRefresh()
    })
  },

  goHome() {
    wx.navigateBack({
      delta: getCurrentPages().length - 1
    })
  },

  /**
   * 获取收藏影评列表
   */
  getList(isFirst, callback) {
    let self = this
    if (isFirst) {
      wx.showLoading({
        title: '正在加载中...',
      })
    }
    qcloud.request({
      url: config.service.reviewList,
      data: {
        id: this.data.id
      },
      success: function(response) {
        wx.hideLoading()
        if (!response.data.code) {
          self.setData({
            reviewList: response.data.data
          })
        } else {
          wx.showToast({
            title: '加载数据失败',
          })
        }
      },
      fail: function(err) {
        wx.hideLoading()
        console.log(err)
        wx.showToast({
          title: '加载数据失败',
        })
      },
      complete: () => {
        callback && callback()
      }
    });
  },
})