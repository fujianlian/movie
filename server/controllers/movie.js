const DB = require("../utils/db.js")

module.exports = {
  random: async ctx => {
    let l = await DB.query("SELECT * FROM movies;")
    if (l.length) {
      ctx.state.data = l[Math.floor(Math.random() * l.length)]
    } else {
      ctx.state.data = {}
    }
  },
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  }
}