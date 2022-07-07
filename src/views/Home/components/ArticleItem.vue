<template>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span :style="artObj.cover.type === 1 ? { width: '6.053334rem' } : ''">{{
          artObj.title
        }}</span>
        <!-- 单图 -->
        <img
          v-if="artObj.cover.type === 1"
          class="thumb"
          :src="artObj.cover.images[0]"
          alt=""
        />
      </div>
      <!-- 多图 -->
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <img
          v-for="(imgUrl, index) in artObj.cover.images"
          :key="index"
          class="thumb"
          :src="imgUrl"
          alt=""
        />
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
        <van-icon name="cross" />
      </div>
    </template>
  </van-cell>
</template>

<script>
import { timeAgo } from '@/utils/date.js'

export default {
  name: 'ArticleItem',
  props: {
    artObj: Object // 文章对象
  },
  methods: {
    formatTime: timeAgo // 函数体是 timeAgo
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
