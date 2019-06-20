module.exports = {

  getUserInfo() {
    return new Promise((resolve, reject) => {
      this.isAuthenticated().then(() => {
        wx.getUserInfo({
          success(res) {
            resolve(res.userInfo)
          }
        })
      }).catch(() => {
        reject()
      })
    })
  },

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo'] === true) {
            resolve()
          } else {
            reject()
          }
        }
      })
    })
  },

  getId() {
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).slice(1)
  },
}