// pages/personal/personal.js

const db = require('../../utils/db.js')

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
   * 获取收藏影评列表
   */
  getList(isFirst, callback) {
    let that = this
    if (isFirst) {
      wx.showLoading({
        title: '正在加载中...',
      })
    }

    db.getMyFavorite().then(result => {
      wx.hideLoading()
      let favoriteList = result.result.data
      let list = []
      favoriteList.forEach(favorite => {
        db.getReview(favorite.reviewId).then(result => {
          let review = result.data
          db.getMovie(favorite.movieId).then(result => {
            let movie = result.data
            console.log(movie)
            list.push(Object.assign(favorite, review, movie))
            if (list.length == favoriteList.length) {
              that.setData({
                collectList: list
              })
            }
          })
        });
      })
      wx.hideLoading()
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