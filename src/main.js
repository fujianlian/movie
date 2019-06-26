import Vue from 'vue'
import App from './App'
import './icon/iconfont.css'

wx.cloud.init({
  env: 'movie-6au99',
  traceUser: true
})

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$db = require('./utils/db')
Vue.prototype.$util = require('./utils/util')

const app = new Vue(App)
app.$mount()
