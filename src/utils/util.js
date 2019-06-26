export function getUserInfo () {
  return new Promise(function (resolve, reject) {
    this.isAuthenticated().then(() => {
      wx.getUserInfo({
        success: res => {
          resolve(res.userInfo)
        }
      })
    })
  })
}

export function isAuthenticated () {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === true) {
          resolve()
        }
      }
    })
  })
}

export function getId () {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(16).slice(1)
}

export default {
  getUserInfo,
  isAuthenticated,
  getId
}
