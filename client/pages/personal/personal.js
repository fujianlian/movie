// client/pages/personal/personal.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      url: config.service.collectList,
      login: true,
      success: function(response) {
        wx.hideLoading()
        if (!response.data.code) {
          self.setData({
            collectList: response.data.data
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

  goHome() {
    wx.navigateBack({
      delta: getCurrentPages().length - 1
    })
  },

  goDetail(event) {
    let index = event.currentTarget.dataset.index
    let review = JSON.stringify(this.data.collectList[index])
    wx.navigateTo({
      url: `/pages/film-review-detail/detail?review=${review}&onlyShow=${true}`,
    })
  }
})