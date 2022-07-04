// 此文件 -> 封装3个方法 -> 专门用于操作 token 的
const key = 'geek-itheima'

// 设置
export const setToken = (token) => {
  localStorage.setItem(key, token)
}

// 获取
export const getToken = () => localStorage.getItem(key)

// 删除
export const removeToken = () => {
  localStorage.removeItem(key)
}
