<template>
  <div class="articleDetail">
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章-等待加载中 -->
    <van-loading color="#1989fa" v-if="artObj.title === undefined">文章加载ing...</van-loading>

    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artObj.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="artObj.aut_name"
          :label="formatDate(artObj.pubdate)"
        >
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed"
                @click="followedFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followedFn(false)"
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content" v-highlight></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.attitude === 1"
            @click="loveFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="loveFn(false)"
            >点赞</van-button
          >
        </div>
      </div>

      <!-- 文章评论部分 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import { detailAPI, userFollowedAPI, userUnFollowedAPI, likeArticleAPI, unLikeArticleAPI } from '@/api/index.js'
import { timeAgo } from '@/utils/date.js'
import Notify from '@/ui/Notify.js'
import CommentList from '@/views/ArticleDetail/CommentList'

export default {
  name: 'ArticleDetail',
  data () {
    return {
      artObj: {} // 文章对象
    }
  },
  components: {
    CommentList
  },
  async created () {
    const res = await detailAPI(this.$route.query.art_id)
    this.artObj = res.data.data
  },
  methods: {
    formatDate: timeAgo,
    // 关注/取关 -> 作者
    async followedFn (bool) {
      if (bool) {
        // 用户点在 “已关注” 按钮上，意味着 “取关”
        try {
          // 发请求通知后台
          await userUnFollowedAPI(this.artObj.aut_id)
          // 取关成功，让页面显示 “关注” 按钮
          this.artObj.is_followed = false
          this.$store.state.userInfo.follow_count--
          // 通过用户关注成功
          Notify({
            message: '取消关注',
            background: '#e1e1e1',
            duration: 500
          })
        } catch (error) {
          // 取消失败
          // 通知用户取消失败
          Notify({
            message: '取消失败',
            background: '#e1e1e1',
            duration: 500
          })
        }
      } else {
        // 用户点在 “关注” 按钮上，意味着 “关注作者”
        try {
          // 发请求通知后台
          await userFollowedAPI(this.artObj.aut_id)
          // 关注成功，让页面显示 “已关注” 按钮
          this.artObj.is_followed = true
          this.$store.state.userInfo.follow_count++
          // 通过用户关注成功
          Notify({
            message: '关注成功',
            background: '#e1e1e1',
            duration: 500
          })
        } catch (error) {
          // 关注失败
          // 通知用户关注失败
          Notify({
            message: '关注失败',
            background: '#e1e1e1',
            duration: 500
          })
        }
      }
    },
    // 点赞/取消点赞 -> 文章
    async loveFn (bool) {
      if (bool) {
        // 用户点在 “已点赞” 按钮上，意味着 “取消点赞”
        // 发请求通知后台
        await unLikeArticleAPI(this.artObj.art_id)
        // 让页面显示 “点赞” 按钮
        this.artObj.attitude = 0 // 0 是不喜欢，-1 是无态度
      } else {
        // 用户点在 “点赞” 按钮上，意味着 “点赞”
        // 发请求通知后台
        await likeArticleAPI(this.artObj.art_id)
        // 让页面显示 “已点赞” 按钮
        this.artObj.attitude = 1 // 1 是喜欢
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  :deep(img) {
    width: 100%;
  }
  :deep(pre) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

// 加载中的居中样式
.van-loading {
  text-align: center;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%);
}
</style>
