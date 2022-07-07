<template>
  <div class="home">
    <!-- 头部导航 -->
    <!--
      fixed 可以让 van-nav-bar 带固定定位样式（原理：给组件内 props 传入 true/false，从而影响组件内的动态样式）
     -->
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/logo.png" alt="" />
        </template>
        <template v-slot:right>
          <!-- 坑：postcss 只能翻译 style li 的 css 样式代码，标签的行内样式无法将 px 转 rem，所以需要自己手动计算 -->
          <van-icon name="search" color="#fff" size="0.48rem" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab 栏导航 + 内容 -->
    <!--
      van-tabs 一行容器
      van-tab 每个 tab 栏
      v-model 关联的是激活项的下标（双向绑定）

      每个 van-tab 代表一个标签导航，中间夹着的内容，对应着下属列表内容

      每个 van-tab 都对应独立的自己的 ArticleList（多次）

      van-tab 循环了很多标签导航，与之一一对应的内容列表不是上来都创建的，默认创建当前激活导航对应列表组件
        且切换到别的标签导航时，当前的列表并不会被销毁
     -->
    <div class="main">
      <van-tabs v-model="channelId" animated sticky offset-top="1.226667rem">
        <!-- 如果 van-tab 没有 name 属性，那么 v-model 关联的就是 van-tab 的索引值，如果有 name，则关联 name 的值 -->
        <van-tab
          v-for="channel in userChannelList"
          :key="channel.id"
          :title="channel.name"
          :name="channel.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'

export default {
  name: 'Home',
  data () {
    return {
      channelId: 0, // tab 导航 - 激活频道 ID（默认频道 ID 为 0，页面刚打开是推荐频道高亮 - 对应文章数据）
      userChannelList: [] // 用户选择频道列表
    }
  },
  components: {
    ArticleList
  },
  async created () {
    const res = await getUserChannelsAPI()
    this.userChannelList = res.data.data.channels
    // 将频道列表的第一个的 ID 赋值给 channelId
    this.channelId = res.data.data.channels[0].id
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}

.main {
  padding-top: 46px;
}
</style>
