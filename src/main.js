import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import hljs from 'highlight.js' // hljs 对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import { directiveObj } from '@/utils/directive.js' // 引入全局自定义指令
import './VueComponent.js' // vant 组件注册，单独的分离成一个 js 文件，让 main.js 更清晰

Vue.config.productionTip = false

// 注册全局自定义指令
// Vue.use 方法本质就是执行传入的对象里的 install 方法，并给这个 install 方法传入 Vue 这个对象
Vue.use(directiveObj)

Vue.directive('highlight', function (el) { // 自定义一个代码高亮指令
  // （在铺设文章详情标签使用 v-highlight 指令，也就是用在 ArticleDetail 组件的文章内容标签）
  const highlight = el.querySelectorAll('pre, code') // 获取里面所有 pre 或 code 标签
  highlight.forEach((block) => {
    hljs.highlightElement(block) // 突出显示这些标签（以及内部代码，会自动识别语言）
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 首页 -> 滚动位置保存
// 首页滚动一些，切换到我的页面再切回来，滚动条回到了顶部
// 疑惑：组件缓存 keep-alive 保存组件标签 + 样式 + js 变量，不会保存滚动位置
// 原因：切换到我的页面，页面高度不够高，没有滚动条（此“滚动条是整个网页”的）
// 滚动位置会回到顶部，所以切换回首页，只是内容变了，滚动条还在顶部
