// pages/film-review-list/list.js
const db = require('../../utils/db.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    reviewList: [],
    time: 0,
    text: "",
    image: "",
    isPlay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    let image = options.image
    this.setData({
      id: id,
      image: image
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
   * 获取影评列表
   */
  getList(isFirst, callback) {
    let self = this
    if (isFirst) {
      wx.showLoading({
        title: '正在加载中...',
      })
    }
    db.getMovieReview(this.data.id).then(result => {
      wx.hideLoading()
      this.setData({
        reviewList: result.data
      })
      callback && callback()
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      callback && callback()
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  goDetail(event) {
    let index = event.currentTarget.dataset.index
    let review = Object.assign(this.data.reviewList[index], {
      "image": this.data.image
    })
    wx.navigateTo({
        url: `/pages/film-review-detail/detail?review=${JSON.stringify(review)}&onlyCollect=${true}`,
    })
  }

})