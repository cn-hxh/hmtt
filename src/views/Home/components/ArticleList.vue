<template>
  <div class="articleList">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
      >
      <!--
        van-list 组件挂载时，默认就会执行判定一次是否触底，第一页数据也是网络请求回来的，标签先挂载了，数据回来更新 DOM，
          所以标签没有高度，组件判定触底了，组件的 load 事件就触发了（简单理解就是，van-list 的 load 事件一上来就执行了一次）
          解决方法：1. 关闭默认判定（给 List 组件传递一个 immediate-check 属性，属性值为 false）  2. 删除 created
          1 号方法有一个缺陷，因为如果你已经下滑并触发过了一次 load 事件。那么 List 组件切换的时候，不管你身上有没有 immediate-check
            它都会触发一次 load 事件，所以还是采用 2 号方法
          1 号方法的语法：<van-list :immediate-check="false"></van-list>
      -->
        <ArticleItem
          v-for="article in articleList"
          :key="article.art_id"
          :artObj="article"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/views/Home/components/ArticleItem'
import { getAllArticleListAPI } from '@/api'

export default {
  name: 'ArticleList',
  props: {
    // list: Array // 文章列表数组
    channelId: Number
  },
  data () {
    return {
      articleList: [], // 文章列表
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 用于分页
      refreshing: false // 顶部加载状态
    }
  },
  components: {
    ArticleItem
  },
  // async created () {
  //   const res = await getAllArticleListAPI({
  //     channel_id: this.channelId,
  //     timestamp: this.theTime
  //   })
  //   // pre_timestamp -> 下一段开头的那篇文章时间戳
  //   // 第一次 系统时间（timestamp）-> 后台 返回 0-9 条数据 -> 携带第 10 条 pre_timestamp 值返回
  //   // 第二次（timestamp）-> 上一次 pre_timestamp（代表告诉后台，从指定的时间戳再往后找 10 个）10-19 条
  //   // 简单理解就是，想要获得下一个 10 条数据，就要把上一次请求返回的 pre_timestamp 作为这一次请求的 timestamp 的值传给后台
  //   this.theTime = res.data.data.pre_timestamp
  //   // 保存文章列表
  //   this.articleList = res.data.data.results
  // },
  methods: {
    // 专门负责发送请求的方法
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      // pre_timestamp -> 下一段开头的那篇文章时间戳
      // 第一次 系统时间（timestamp）-> 后台 返回 0-9 条数据 -> 携带第 10 条 pre_timestamp 值返回
      // 第二次（timestamp）-> 上一次 pre_timestamp（代表告诉后台，从指定的时间戳再往后找 10 个）10-19 条
      // 简单理解就是，想要获得下一个 10 条数据，就要把上一次请求返回的 pre_timestamp 作为这一次请求的 timestamp 的值传给后台
      this.theTime = res.data.data.pre_timestamp
      // 合并文章列表
      this.articleList = [...this.articleList, ...res.data.data.results]

      // 下面的代码都是为 onLoad 服务的，因为本函数是异步函数，所以如果把下面的代码放在 onLoad 中会出现，本函数还没执行完，
      // 下面的代码执行了
      this.loading = false // 关闭加载状态，如果不关闭，底部一直是加载中状态

      // 如果后面没有数据了，则返回的 pre_timestamp 是一个 null，此时就需要将 finished 的值设置为 true
      // 这样底部就会出现一行字（finished-text 属性的值），并且 List 组件的 onLoad 事件不再触发
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
        // 下面这个判断是因为 this.refreshing = false 代表顶部刷新。但是如果先到了底部，再回到顶部刷新
        // 因为之前已经到了底部，this.finished = true 了，所以无法底部刷新了
        // 而有了下面这个判断，就可以了。因为顶部刷新会走下面判断，重新开启底部刷新
      } else {
        this.finished = false
      }

      // 下面这行代码是专门为 onRefresh 服务的，理由也是因为本函数是异步函数
      // 顶部加载状态改为 false
      this.refreshing = false
    },
    // 底部加载事件方法
    async onLoad () {
      this.getArticleListFn()
    },
    // 顶部刷新数据事件方法
    async onRefresh () {
      // 目标：list 数组清空，来一份新的数据
      this.articleList = []
      this.theTime = new Date().getTime()

      this.getArticleListFn()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
