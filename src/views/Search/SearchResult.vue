<template>
  <div class="searchResult">
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="articleObj in articleList"
          :key="articleObj.art_id"
          :artObj="articleObj"
          :isShow="false"
          @click.native="itemClickFn(articleObj.art_id)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api/index.js'
import ArticleItem from '@/components/ArticleItem.vue'

export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false // 是否全部加载完成
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    this.articleList = res.data.data.results
  },
  methods: {
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
        })

        if (res.data.data.results.length === 0) {
          // 没有更多数据
          this.finished = true
          return
        }

        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 每个文章单元格的点击事件
    itemClickFn (art_id) {
      this.$router.push({
        path: '/detail',
        query: {
          art_id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
