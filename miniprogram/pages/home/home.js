// pages/home/home.js

const db = require('../../utils/db.js')
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 影评数据及其对应电影数据
    movie: {},
    // 用户信息
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRondom()
  },

  onShow() {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('尚未通过身份验证');
    })
  },

  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
  },

  /**
   * 随机获取热门电影
   */
  getRondom() {

    wx.showLoading({
      title: '正在加载中...',
    })
    db.getReviewRondom().then(result => {
      wx.hideLoading()
      this.setData({
        movie: result.result
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  goDetail(event) {
    let m = JSON.stringify(this.data.movie)
    wx.navigateTo({
      url: `/pages/movie-detail/detail?movie=${m}`,
    })
  },

  goHot(event) {
    wx.navigateTo({
      url: '/pages/hot-movie/hot-movie',
    })
  },

  goPersonal(event) {
    wx.navigateTo({
      url: '/pages/personal/personal',
    })
  },

  goReview(event) {
    let review = this.data.movie

    review = JSON.stringify(review)
    wx.navigateTo({
      url: `/pages/film-review-detail/detail?review=${review}`,
    })
  },

  onTapLogin: function() {
    app.login({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo: userInfo
        })
      }
    })
  },
})