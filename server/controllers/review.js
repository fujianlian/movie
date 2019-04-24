const DB = require("../utils/db.js")

module.exports = {
  random: async ctx => {
    let l = await DB.query("SELECT * FROM review;")
    if (l.length) {
      let id = l[Math.floor(Math.random() * l.length)].id
      let data = (await DB.query('SELECT *, review.id AS `review_id` FROM review LEFT JOIN movies ON review.movie_id = movies.id and review.id=?', [id]))[0]
      data.username = data.username
      ctx.state.data = data
    } else {
      ctx.state.data = {}
    }
  },

  list: async ctx => {
    let movie_id = ctx.request.query.id
    ctx.state.data = await DB.query("SELECT review.id as review_id, review.movie_id as movie_id, review.avatar as avatar, review.content as content, review.audio as audio, review.username as username, movies.title as title, movies.image as image FROM review LEFT JOIN movies ON review.movie_id = movies.id and review.movie_id = ?", [movie_id])
  }
}