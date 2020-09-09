import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element'
import less from 'less'
import axios from 'axios'
//第三方组件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
//第三方插件 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入 富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中展示进度条
axios.interceptors.request.use(config =>{
  //console.log(config);
  NProgress.start()
  config.headers.Authorization =window.sessionStorage.getItem('token');
  return config;
})
//在response拦截器中隐藏进度条
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})
Vue.prototype.$http=axios;
//导入全局样式表
import './assets/css/global.css'
Vue.use(less);

//全局过滤器
Vue.filter('dateFormat',function (originVal) {
  const dt =new Date(originVal)
  const y =dt.getFullYear();
  const m =(dt.getMonth()+1+'').padStart(2,'0');
  const d =(dt.getDate()+'').padStart(2,'0');
  const hh =(dt.getHours()+'').padStart(2,'0');
  const mm =(dt.getMinutes()+'').padStart(2,'0');
  const ss =(dt.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
