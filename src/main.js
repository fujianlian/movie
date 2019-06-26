import Vue from 'vue'
import App from './App'
import './icon/iconfont.css'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'movie-6au99',
  traceUser: true
})

Vue.prototype.$db = require('./utils/db')
Vue.prototype.$util = require('./utils/util')

Vue.prototype.goDetail = function (movie) {
  this.$router.push({
    path: '../movie-detail/main',
    query: {
      movie: JSON.stringify(movie)
    }
  })
}

const app = new Vue(App)
app.$mount()
