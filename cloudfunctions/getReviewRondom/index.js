// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'movie-6au99',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  
  const list = await db.collection('review').get()
  if (list.data.length) {
    const f = list.data[Math.floor(Math.random() * list.data.length)]
    const m = await db.collection('movie').doc(f.movieId).get()
    return Object.assign(f, m.data, { "reviewId": f._id})
  } else {
    return {}
  }
}