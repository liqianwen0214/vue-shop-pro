import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home' // 是App的子组件
import Welcome from '@/components/Welcome' // 具体是home的子组件
import User from '@/components/User' // 具体是home的子组件

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ]
    }
  ]
})
// 路由导航守卫，检测token如果不存在，跳转登录页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 访问非login，判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
