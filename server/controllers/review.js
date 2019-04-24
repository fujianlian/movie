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

}