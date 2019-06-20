// pages/home/home.js

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
  onLoad: function (options) {
    //this.getRondom()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
   
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
      success: function (response) {
        wx.hideLoading()
        if (!response.data.code) {
          let m = response.data.data;
          m.username = m.username + '给你推荐了一部电影'
          self.setData({
            movie: m
          })
        } else {
          wx.showToast({
            title: '加载数据失败',
          })
        }
      },
      fail: function (err) {
        console.log(err)
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

  onTapLogin: function () {
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