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
          <van-icon
            name="search"
            color="#fff"
            size="0.48rem"
            @click="moveSearchPageFn"
          />
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
      <van-tabs
        v-model="channelId"
        animated
        sticky
        offset-top="1.226667rem"
        @change="channelChangeFn"
        :before-change="channelBeforeChangeFn"
      >
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

      <!-- 编辑频道图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="plusClickFn"
      ></van-icon>
    </div>

    <!-- 频道管理弹出层 -->
    <van-popup class="channel_popup" v-model="show" get-container="body">
      <ChannelEdit
        :userList="userChannelList"
        :unCheckList="unCheckChannelList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="removeChannelFn"
        @closeEV="closeFn"
        v-model="channelId"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, removeTheChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from '@/views/Home/ChannelEdit'

export default {
  name: 'Home',
  data () {
    return {
      channelId: 0, // tab 导航 - 激活频道 ID（默认频道 ID 为 0，页面刚打开是推荐频道高亮 - 对应文章数据）
      userChannelList: [], // 用户选择频道列表
      allChannelList: [], // 所有频道列表
      show: false, // 频道弹出层显示/隐藏
      channelScrollTObj: {}
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  async created () {
    // 频道列表
    const res = await getUserChannelsAPI()
    this.userChannelList = res.data.data.channels
    // 将频道列表的第一个的 ID 赋值给 channelId
    this.channelId = res.data.data.channels[0].id

    // 所有频道列表
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  methods: {
    // tabs 切换的事件
    channelChangeFn () {
      // tab 切换时（我个人感觉是切换后），组件内部，会把切走的容器 height 设置为 0，滚动条因为没有高度回到了顶部
      // 也就是切回来的一瞬间是没有高度的，滚动条自动就会在顶部
      // 所以我们需要等有高度之后再设置滚动条的位置
      this.$nextTick(() => {
        // 因为谷歌浏览器的内核和安卓手机内置浏览器的内核不是同一个
        // 所以可能会出现获取 scrollTop 方式不同
        // 谷歌浏览器用的是 html 的 scrollTop
        // 有的浏览器用的是 body 的 scrollTop
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
        document.body.scrollTop = this.channelScrollTObj[this.channelId]
      })
    },
    // tabs 切换前的事件
    channelBeforeChangeFn () {
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop || document.body.scrollTop
      return true
    },
    // + 号点击方法
    plusClickFn () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (channelObj) {
      this.userChannelList.push(channelObj)
      // 还要把最新的数组，发送给后台
      await updateChannelsAPI(this.userChannelList)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)

      // 第一种方式：把现在用户数组的数据，再覆盖式的发给后台
      // 第二种方式：只调用删除的接口
      await removeTheChannelAPI(channelObj.id)
    },
    // 关闭频道设置弹出层
    closeFn () {
      this.show = false
    },
    // 首页-右上角放大镜点击事件 -> 跳转搜索页面
    moveSearchPageFn () {
      this.$router.push('/search')
    }
  },
  computed: {
    unCheckChannelList () {
      // 目标：把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让 filter 方法收集到一个新数组里
      const newArr = this.allChannelList.filter(bigObj => {
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
        })

        // 如果找到了
        if (index > -1) {
          return false
        } else {
          return true
        }
      })

      return newArr
    }
  },
  activated () {
    // 每次进入组件，立刻设置滚动条位置，如果是第一次进入或者进入了没滚就切走了
    // 切回来的位置就是顶部，如果是滚动了之后切走又切回来的，就设置成切走之前的位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
    document.body.scrollTop = this.$route.meta.scrollT
  },
  // 组件切换走前
  beforeRouteLeave (to, from, next) {
    // 收集组件切换前滚动条的滚动位置
    this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
    next()
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

// 设置 tabs 容器的样式
:deep(.van-tabs__wrap) {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 60px;
  right: 8px;
  z-index: 999;
}

.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>
