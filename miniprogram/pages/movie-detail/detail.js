// pages/movie-detail/detail.js
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
  onLoad: function (options) {
    let movie = this.data.movie
    movie = JSON.parse(options.movie)
    this.setData({
      movie
    })
  },

  showEditActions: function (event) {
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: res => {
        if (res.tapIndex === 0) {
          this.editReview("text")
        } else if (res.tapIndex === 1) {
          this.editReview("audio")
        }
      }
    });
  },

  // 写影评
  editReview(type) {
    let id = this.data.movie._id
    let title = this.data.movie.title
    let image = this.data.movie.image
    wx.navigateTo({
      url: `/pages/film-review-edit/edit?title=${title}&id=${id}&image=${image}&type=${type}`,
    })
  },

  lookReview() {
    let id = this.data.movie._id
    wx.navigateTo({
      url: `/pages/film-review-list/list?id=${id}`,
    })
  }
})