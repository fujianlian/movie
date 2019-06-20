const util = require('./util')

const db = wx.cloud.database({
  env: 'movie-6au99'
})

module.exports = {
  getMovieList() {
    return db.collection('movie').get()
  },

  getFavoriteRondom() {
    return wx.cloud.callFunction({
      name: 'getFavoriteRondom'
    })
  },
}