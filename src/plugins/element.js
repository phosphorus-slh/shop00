import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//配置消息弹框
import {Message} from "element-ui";
Vue.prototype.$message = Message
