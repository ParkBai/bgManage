import axios from 'axios'

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'

import './assets/css/reset.css'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat',function(origin){
  const dt = new Date(origin)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


//https://www.liulongbin.top:8888/api/private/v1/
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器，在这里显示进度条
axios.interceptors.request.use(config =>{
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 响应拦截器，在这里隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
