// 基于 axios 封装网络请求
import theAxios from 'axios'
import router from '@/router/index.js'
import Notify from '@/ui/Notify.js'
import { getToken, removeToken, setToken } from '@/utils/token.js'
import { getNewTokenAPI } from '../api'

const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 20 秒超时时间（请求20秒无响应直接判定超时）
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标：统一携带 token
  // 判断本地有 token 再携带，判断具体 api/index.js 里没有携带 Authorization，再添加上去
  // ?. 可选链操作符，如果前面对象里没有 length，原地返回 undefined
  // 如果 getToken() 在原地有值 token 字符串，才能调用 length 获取长度
  // 也就是，如果 geToken() 返回的是一个 undefined（也就是没有 token），那么 getToken()?.length === undefined
  // 如果 getToken() 返回的是一个真正的值，那么 getToken()?.length === 正常的值
  // 为什么要用这种语法呢？因为如果是这样写 getToken().length，那么如果 getToken() 返回的是一个 undefined（也就是没有 token）
  // 那么 undefined.length 是会报错的。而 getToken()?.length 它发现 getToken() 返回的是 undefined 之后就不会执行 .length 了
  // 而是直接返回一个 undefined，这样就不会报错了
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
// 拦截器本质就是一个函数
axios.interceptors.response.use(function (response) {
  // http 响应状态码为 2xx，3xx 就进入这里
  // 对响应数据做点什么
  return response
}, async function (error) {
  // http 响应状态码为 4xx，5xx 报错就进入这里
  // 对响应错误做点什么
  // 当状态为 401 时代表身份过期，需要跳转到登录页
  if (error.response.status === 401) {
    // 不能使用 this.$router（因为 this 不是 vue 组件对象无法调用 $router）
    // 解决：从路由文件引入路由对象
    // Notify({
    //   type: 'warning',
    //   message: '身份已过期'
    // })

    // 方式一：清除 token，强制跳转到登录页面，用户有感知
    // removeToken() // 先清除 token，才能让路由守卫判断失效，放行用户去登录页面
    // router.replace('/login')

    // 方式二：使用 refresh_token 换回新的 token 再继续使用，JS 代码实现，用户无感知（效果好）
    const res = await getNewTokenAPI()

    // 新的 token 回来之后
    // 1. 更新 token 在本地
    setToken(res.data.data.token)
    // 2. 更新新的 token 在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 3. 未完成的这次请求，再次发起
    // error.config 就是上一次请求的配置对象
    // 结果我们要 return 回原本逻辑页面调用的地方
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 刷新的 refresh_token 也过期了
    removeToken()
    Notify({
      type: 'warning',
      message: '身份已过期'
    })
    // router.currentRoute 相当于在 vue 文件内 this.$route -> 当前路由对象信息
    // fullPath，路由对象里完整路由路径 # 后面的一切（http://localhost:8080/#/layout/home 中的 /layout/home）
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  return Promise.reject(error)
})

export default ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {}
}) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })

  // return new Promise((resolve, reject) => {
  //   $.ajax({
  //     url,
  //     data,
  //     headers,
  //     type: method,
  //     success: (res) => {
  //       resolve(res)
  //     },
  //     error: (err) => {
  //       reject(err)
  //     }
  //   })
  // })
}
