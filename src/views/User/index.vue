<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ $store.state.username }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token.js'
import { mapState } from 'vuex'

export default {
  name: 'User',
  created () {
    // 通知 vuex 发请求
    this.$store.dispatch('setUserInfo')
    // 为什么不在组件内发请求，反而多次一举到 vuex 去发请求呢？
    // 答：1. 因为当 token 和 refresh_token 都过期时进入 User 组件，但 created 已经触发，且组件缓存了，
    // 就无法在 created 无法获取后台数据，所以把请求放到 vuex 里，并且每当从 login 跳到 user 时，都在路由守卫发一次请求，保证获取
    // 2. 数据放在组件里，文章详情的关注和取消关注就影响不到这里的数据
  },
  methods: {
    // 退出登录
    quitFn () {
      Dialog.confirm({
        title: '是否退出登录',
        message: '这就走了？不爱我了吗？'
      })
        .then(() => {
          // 用户点击 “确认” 选项 -> 内部 resolve 触发 then
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          // 用户点击 “取消” 选项 -> 内部 reject 触发 catch
        })
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
  }
}
</style>
