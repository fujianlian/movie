const util = require('./util')

const db = wx.cloud.database({
  env: 'movie-6au99'
})

module.exports = {
  getMovieList() {
    return db.collection('movie').get()
  },

  getReviewRondom() {
    return wx.cloud.callFunction({
      name: 'getReviewRondom'
    })
  },

  favoriteReview(reviewId) {
    return wx.cloud.callFunction({
      name: 'favoriteReview',
      data: {
        reviewId
      },
    })
  },

  getMyFavorite() {
    return wx.cloud.callFunction({
      name: 'getMyFavorite',
      data: {
        reviewId
      },
    })
  },

  getMovieReview(movieId) {
    return db.collection('review').where({movieId}).get()
  },

  addReview(data) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addReview',
          data,
        })
      })
      .catch(() => {
        wx.showToast({
          icon: 'none',
          title: '请先登录'
        })
        return {}
      })
  },

  uploadAudio(tempFilePath) {
    return wx.cloud.uploadFile({
      cloudPath: `audio/${util.getId()}`,
      filePath: tempFilePath,
    })
  }
}