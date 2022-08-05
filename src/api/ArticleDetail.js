import request from '@/utils/request.js'

// 文章 - 获取详情
export const detailAPI = (article_id) => request({
  url: `/v1_0/articles/${article_id}`,
  method: 'get'
})

// 文章 - 点赞
export const likeArticleAPI = (target) => request({
  url: '/v1_0/article/likings',
  method: 'post',
  data: {
    target
  }
})

// 文章 - 取消点赞
export const unLikeArticleAPI = (target) => request({
  url: `/v1_0/article/likings/${target}`,
  method: 'delete'
})

// 文章 - 获取 - 评论列表
export const commentsListAPI = ({ artId, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'get',
  params: { // axios 针对 params 参数，如果发现键值对，值为 null，会忽略此参数名和值不携带在 url? 后面
    type: 'a',
    source: artId,
    offset,
    limit
  }
})

// 文章 - 评论 - 喜欢
export const commentLikingAPI = (comId) => request({
  url: '/v1_0/comment/likings',
  method: 'post',
  data: {
    target: comId
  }
})

// 文章 - 评论 - 取消喜欢
export const commentDislikingAPI = (comId) => request({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'delete'
})

// 文章 - 评论 - 发布评论
export const commentSendAPI = (target, content) => request({
  // axios 中，data 请求体传参，如果值为 null 或 undefined 是不会忽略这个参数的，也会把参数名和值携带给后台
  // 只有 params 遇到才会忽略
  url: '/v1_0/comments',
  method: 'post',
  data: {
    target,
    content
  }
})

// 用户 -> 关注
export const userFollowedAPI = (target) => request({
  url: '/v1_0/user/followings',
  method: 'post',
  data: {
    target
  }
})

// 用户 -> 取消关注
export const userUnFollowedAPI = (target) => request({
  url: `/v1_0/user/followings/${target}`,
  method: 'delete'
})
