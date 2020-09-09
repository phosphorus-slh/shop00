import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'

import Welcome from "../components/Welcome";
import Users from "../components/Users";
import Power from "../components/power/Power";
import Roles from "../components/power/Roles"
import Cate from "../components/goods/Cate"
import Params from "../components/goods/Params";
import List from "../components/goods/List";
import Add from "../components/goods/Add";
import Orders from "../components/orders/Orders";
import Report from "../components/report/Report";
Vue.use(Router)

const router =new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/home',
      name:'home',
      component: Home,
      redirect: '/welcome',
      children:[
        {
          path:'/welcome',
          name:'welcome',
          component:Welcome
        },
        {
          path:'/users',
          name:'users',
          component: Users
        },
        {
          path:'/rights',
          name:'power',
          component: Power
        },
        {
          path:'/roles',
          name:'roles',
          component: Roles
        },
        {
          path:'/categories',
          name:'categories',
          component: Cate
        },
        {
          path:'/params',
          name:'params',
          component: Params
        },
        {
          path:'/goods',
          name:'goods',
          component: List
        },
        {
          path:'/goods/add',
          component: Add
        },
        {
          path:'/orders',
          name:'orders',
          component: Orders
        },
        {
          path:'/reports',
          name:'reports',
          component: Report
        },

      ]
    },
    {
      path:'/',
      redirect:'/login'
    }
  ]
})
//挂载路由对象守卫
router.beforeEach((to,from,next) => {
  //to表示将要访问的路劲，from表示从哪个路径跳转来，next是一个函数，表示放行
  if(to.path==='/login') return next();
  const tokenStr =window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next();
})
export default router

