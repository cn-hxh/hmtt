<template>
  <div class="articleItem">
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span
            :style="artObj.cover.type === 1 ? { width: '6.053334rem' } : ''"
            >{{ artObj.title }}</span
          >
          <!-- 单图 -->
          <!-- <img
            v-if="artObj.cover.type === 1"
            class="thumb"
            :src="artObj.cover.images[0]"
            alt=""
          /> -->
          <van-image
            v-if="artObj.cover.type === 1"
            class="thumb"
            :src="artObj.cover.images[0]"
            lazy-load
          >
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <!-- <img
            v-for="(imgUrl, index) in artObj.cover.images"
            :key="index"
            class="thumb"
            :src="imgUrl"
            alt=""
          /> -->
          <van-image
            v-for="(imgUrl, index) in artObj.cover.images"
            :key="index"
            class="thumb"
            :src="imgUrl"
            lazy-load
          >
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }} 评论</span>
            <span>{{ formatTime(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <!-- van-action-sheet 默认挂载在当前组件上，但可能会出现一些问题，get-container 属性可以指定挂载在哪个元素上 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="bottomText"
      @cancel="cancelFn"
      @close="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'

export default {
  name: 'ArticleItem',
  props: {
    artObj: Object, // 文章对象
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false, // 反馈面板显示/隐藏
      actions: firstActions,
      bottomText: '取消' // 反馈面板底部按钮的文字
    }
  },
  methods: {
    formatTime: timeAgo, // 函数体是 timeAgo
    // 点击反馈面板的选项时的回调
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // 这个 item 是点击的那个项
      // this.show = false

      if (item.name === '反馈垃圾内容') {
        // 点击反馈垃圾内容项则展示新列表
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (item.name === '不感兴趣') {
        this.$emit('dislikeEV', this.artObj.art_id)
        this.show = false
      } else {
        // 二级反馈选项
        this.$emit('reportEV', this.artObj.art_id, item.value)
        // 关闭反馈面板
        this.show = false
      }
    },
    // 点击反馈面板的“取消”按钮的回调
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true // 不让反馈面板隐藏
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 关闭反馈面板-触发事件
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }
}
</script>

<style lang="less" scoped>
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label-box span {
  margin-right: 5px;
}

// 图片的样式，矩形黄金比例：0.618
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

// 三图，图片容器
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
