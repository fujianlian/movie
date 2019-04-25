const DB = require("../utils/db.js")

module.exports = {
  random: async ctx => {
    let l = await DB.query("SELECT * FROM review;")
    if (l.length) {
      let id = l[Math.floor(Math.random() * l.length)].id
      let data = (await DB.query('SELECT *, review.id AS `review_id` FROM review LEFT JOIN movies ON review.movie_id = movies.id where review.id=?', [id]))[0]
      data.username = data.username
      ctx.state.data = data
    } else {
      ctx.state.data = {}
    }
  },

  list: async ctx => {
    let movie_id = ctx.request.query.id
    ctx.state.data = await DB.query("SELECT review.id as review_id, review.movie_id as movie_id, review.avatar as avatar, review.content as content, review.audio as audio, review.username as username, movies.title as title, movies.image as image FROM review LEFT JOIN movies ON review.movie_id = movies.id where review.movie_id = ? order by review.create_time desc", [movie_id])
  },

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let movie_id = ctx.request.body.id
    let content = ctx.request.body.content

    await DB.query('INSERT INTO review(user, username, avatar, content, movie_id) VALUES (?, ?, ?, ?, ?)', [user, username, avatar, content, movie_id])
    ctx.state.data = {}
  }
}