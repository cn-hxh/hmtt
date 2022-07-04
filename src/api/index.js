// 统一封装接口方法
// 每个方法负责请求一个 url 地址
// 逻辑页面，导入这个接口方法，就能发请求咯
// 好处：请求的 url 路径，可以在这里统一管理
import request from '@/utils/request.js'

// 登录 - 登录接口
// axios 内部，会把参数对象转成 json 字符串格式发后台
// axios 内部，会自动携带请求参数（headers）里的 Content-Type: 'application/json' 帮你自动添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'post',
  data: {
    mobile,
    code
  }
})

// 频道 - 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'get'
})
