import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'
import { getToken } from '@/utils/token.js'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示 layout 和 layout 下的首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    beforeEnter (to, from, next) {
      // 需求：如果用户已经登录了，不能切换到登录页面
      if (getToken()?.length > 0) {
        next('/layout/home') // 留在原地
      } else {
        next() // 其它情况统统放行
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时，滚动条的位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User'),
        beforeEnter: (to, from, next) => {
          if (from.path === '/login') {
            store.dispatch('setUserInfo')
          }
          next()
        }
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    // 文章详情页
    path: '/detail',
    component: () => import(/* webpackChunkName: "Detail" */ '@/views/ArticleDetail')
  },
  {
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  {
    // 聊天页面
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 路由 - 全局前置守卫（在路由发生真正跳转之前，执行此函数）
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   // 需求：如果用户已经登录了，不能切换到登录页面
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next('/layout/home') // 留在原地
//   } else {
//     next() // 其它情况统统放行
//   }
// })

export default router
