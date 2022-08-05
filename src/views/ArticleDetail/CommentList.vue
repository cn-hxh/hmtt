<template>
  <div class="commentList">
    <!-- 评论列表 -->
    <!-- van-list 最好在这个 div 内，让底部文字/加载中，作为此 div 的内容，容器 padding-bottom 底部文字也挤上去了 - 看得见 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmtBox,
        'art-cmt-container-2': !isShowCmtBox,
      }"
    >
    <!--
      van-list 包裹列表，组件内源码，检测网页滚动事件，判断滚动位置是否快到达内容高度（触底）
      -> 触发 load 事件执行 -> loading：为 true -> 底部加载中文字出现 -> 内容认为现在处于加载中状态
      - immediate-check 作用：让 list 组件不要上来就检查是否触底
      原因：list 中列表内容是异步网络请求回来的，标签挂载时，没有高度，list 就会判定触底执行一次 onLoad 方法
      问题：create 发送一次，onLoad 立刻又发送一次，就会出现请求两次第一页的数据/上来就请求第一页和第二页
     -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking"
                @click="likeFn(false, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(true, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ obj.content }}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>
    <!-- 发布评论容器 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="commentClickFn"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-fofo
          @blur="blurFn"
          v-model.trim="comText"
        ></textarea>
        <van-button type="default" :disabled="!comText" @click="sendFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { commentsListAPI, commentLikingAPI, commentDislikingAPI, commentSendAPI } from '@/api/index.js'
import { timeAgo } from '@/utils/date.js'

export default {
  name: 'CommentList',
  data () {
    return {
      offset: null, // 偏移量评论ID
      commentArr: [], // 评论列表
      isShowCmtBox: true,
      totalCount: 0, // 评论总数量
      comText: '', // 发布评论的内容
      loading: false,
      finished: false,
      lastId: null // 分页
    }
  },
  async created () {
    const res = await commentsListAPI({
      artId: this.$route.query.art_id
    })
    this.commentArr = res.data.data.results
    this.totalCount = res.data.data.total_count
    this.lastId = res.data.data.last_id

    // 网页打开 -> 没有评论，res 结果空数组
    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 评论点赞与否的事件
    async likeFn (bool, obj) {
      if (bool) {
        // 用户点赞该条评论，小心心变红
        // 页面显示红心
        obj.is_liking = bool
        await commentLikingAPI(obj.com_id)
      } else {
        // 用户取消点赞该条评论，小心心变灰
        // 页面显示灰心
        obj.is_liking = bool
        await commentDislikingAPI(obj.com_id)
      }
    },
    // 显示 -> 评论输入框（第二套-高）
    toggleShowFn () {
      this.isShowCmtBox = false
    },
    // 评论按钮 -> 点击事件 -> 把第一条评论滑动到最上面
    commentClickFn () {
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // // window.scrollTo() 使网页进行滚动，设置相应的坐标，就可以让网页滚动到屏幕的最顶端
      // // 如果底下没有内容了，则不再滚动
      // window.scrollTo(0, articleHeight)

      // 比较方便的方法（既能滚动也能带动画）
      // 原生标签 .scrollIntoView()，让原生的标签滚动到屏幕的最上面
      // 为何选择 like-box 不选择第一条评论，因为头部导航会挡住
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布按钮 - 点击事件
    async sendFn () {
      const res = await commentSendAPI(this.$route.query.art_id, this.comText)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++
      this.comText = ''
      this.commentClickFn()
    },
    // 评论输入框 - 失去焦点事件
    blurFn () {
      // 问题：点击发布按钮，发现点击事件不执行 - 排除代码问题
      // 原因：高的评论容器 - 在页面点击发布的一瞬间，输入框失去了焦点，被 v-if 和 v-else 移除了整个标签，
      // 导致点击事件没来得及执行
      // 解决方法：失去焦点时，变量值在最后再执行
      setTimeout(() => {
        this.isShowCmtBox = true
      }, 0)
    },
    // 底部加载更多
    async onLoad () {
      // 请求下一页数据（请求更多评论）
      // const res = await commentsListAPI({
      //   artId: this.$route.query.art_id, // 文章 id
      //   offset: this.lastId
      // })
      // console.log(res)
      // this.commentArr = [...this.commentArr, ...res.data.data.results]
      // this.lastId = res.data.data.last_id // 分页

      // if (res.data.data.last_id === null) {
      //   // 没有下一页了
      //   this.finished = true
      // }

      // this.loading = false
      // 为何要加这个判断，具体就看 ArticleList 组件
      if (this.commentArr.length > 0) {
        if (this.commentArr.length >= 10) {
          // 请求下一页数据（请求更多评论）
          const res = await commentsListAPI({
            artId: this.$route.query.art_id, // 文章 id
            offset: this.lastId
          })
          console.log(res)
          this.commentArr = [...this.commentArr, ...res.data.data.results]
          this.lastId = res.data.data.last_id // 分页

          if (res.data.data.results.length < 10) {
            // 没有下一页了
            this.finished = true
          }

          this.loading = false
        } else {
          this.loading = false
          this.finished = true
        }
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #e3e5e7;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
