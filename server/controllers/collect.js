const DB = require("../utils/db.js")

module.exports = {
  collect: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let review_id = ctx.request.body.id
    let list = await DB.query('SELECT * FROM favorite where user = ? and review_id = ?', [user, review_id])
    if (list.length > 0) {
      ctx.state.data = {
        isCollect: true
      }
    } else {
      await DB.query('INSERT INTO favorite(user, review_id) VALUES (?, ?)', [user, review_id])
      ctx.state.data = {
        isCollect: false
      }
    }
  },

  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query("SELECT favorite.review_id as review_id, review.movie_id as movie_id, review.avatar as avatar, review.content as content, review.audio as audio, review.username as username, movies.title as title, movies.image as image FROM favorite LEFT JOIN review ON favorite.review_id = review.id LEFT JOIN movies ON review.movie_id = movies.id where favorite.user = ? order by favorite.create_time Desc", [user])
  }
}