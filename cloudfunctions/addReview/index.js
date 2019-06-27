// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'movie-6au99',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID

  const username = event.username
  const avatar = event.avatar
  const content = event.content
  const audio = event.audio
  const seconds = event.seconds
  const movieId = event.movieId

  await db.collection('review').add({
    data: {
      user,
      createTime: +new Date(),
      username,
      avatar,
      content,
      audio,
      seconds,
      movieId
    },
  })
  return {}
}