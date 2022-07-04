// 基于 axios 封装网络请求
import theAxios from 'axios'
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 20 秒超时时间（请求20秒无响应直接判定超时）
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
