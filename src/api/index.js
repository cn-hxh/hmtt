// 统一封装接口方法
// 每个方法负责请求一个 url 地址
// 逻辑页面，导入这个接口方法，就能发请求咯
// 好处：请求的 url 路径，可以在这里统一管理
import request from '@/utils/request.js'
import { getStorage } from '../utils/storage.js'

// 既引入也同时向外按需导出所有引入过来的方法（相当于一个中转）
export * from './ArticleDetail.js'

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

// 用户 - 刷新 token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'put',
  headers: {
    // 请求拦截器统一携带的是 token，而这次请求需要携带的是 refresh_token
    // 所以在 axios 请求拦截器里判断的后半段，就是为了这种情况准备的
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})

// 用户 - 获取个人资料（编辑页面使用）
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'get'
})

// 用户 - 获取基本信息（我的页面显示数据）
export const getUserInfoAPI = () => request({
  url: '/v1_0/user',
  method: 'get'
})

// 用户 - 更新头像
export const updateUserPhotoAPI = (data) => request({
  url: '/v1_0/user/photo',
  method: 'patch',
  // 如果你的请求体直接是 FormData 表单对象，不用自己添加请求头 Content-Type，axios 发现数据请求体是表单对象，不会转换为 json 字符串
  // 也不会带 Content-Type: application/json，而是交给浏览器，浏览器发现请求体是 FormData 会自己携带 Content-Type
  data // 这个数据是调用时传进来的一个 new FormData() 表单对象
})

// 用户 - 更新基本资料
export const updateUserProfileAPI = (data) => request({
  url: '/v1_0/user/profile',
  method: 'patch',
  data
  // data: {
  //   name, // 昵称
  //   gender, // 性别：0-男，1-女
  //   birthday, // 生日（要求格式：年-月-日）
  //   intro // 个人介绍
  //   // 全都是非必须参数
  // }
})

// 频道 - 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'get'
})

// 频道 - 获取用户选择的频道
// 注意：用户没有登录，则默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'get'
})

// 频道 - 更新覆盖频道
export const updateChannelsAPI = (channels) => request({
  url: '/v1_0/user/channels',
  method: 'put',
  data: {
    channels // 用户已选的整个频道数组
  }
})

// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = (channelId) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'delete'
})

// 文章 - 获取列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'get',
  params: {
    channel_id,
    timestamp
  }
})

// 文章 - 反馈 - 不感兴趣
export const dislikeArticleAPI = (atrId) => request({
  url: '/v1_0/article/dislikes',
  method: 'post',
  data: {
    target: atrId
  }
})

// 文章 - 反馈 - 反馈垃圾内容
export const reportArticleAPI = (atrId, type) => request({
  url: '/v1_0/article/reports',
  method: 'post',
  data: {
    target: atrId,
    type,
    remark: '如果你想写，你可以在逻辑页面判断下，如果点击的是其它问题，再给一个弹出框输入其它问题，传参到这里'
  }
})

// 搜索 - 联想菜单
export const suggestListAPI = (keywords) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索 - 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'get',
  params: {
    // 页数，不传默认为 1
    page,
    // 每页数量，不传由后端决定
    per_page,
    // 搜索关键字
    q
  }
})
