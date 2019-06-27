// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'movie-6au99',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const user = cloud.getWXContext().OPENID
  const list = await db.collection('favorite').where({
    user
  }).get()
  return list
}