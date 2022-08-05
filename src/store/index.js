import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfoAPI } from '@/api/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F17%2F20171017215814_fwPMQ.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661517459&t=a3a98d76ff776419bbdb1bbecf5f7bb0',
    username: '用户157',
    userInfo: {} // 用户信息对象
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    },
    SET_USERNAME (state, value) {
      state.username = value
    },
    SET_USERINFO (state, value) {
      state.userInfo = value
      state.userPhoto = value.photo
      state.username = value.name
    }
  },
  actions: {
    async setUserInfo (context) {
      // 请求用户信息
      const res = await getUserInfoAPI()
      context.commit('SET_USERINFO', res.data.data)
    }
  },
  modules: {
  }
})
