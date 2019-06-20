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
}