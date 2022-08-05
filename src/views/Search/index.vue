<template>
  <div class="search">
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        @input="inputFn"
        v-model.trim="kw"
        @search="searchFn"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-show="suggestList[1]">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestClickFn(str)"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-show="kw.length === 0 && history.length > 0">
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"></van-icon>
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="historyClickFn(str)"
          >{{ str }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
import { getStorage, setStorage } from '@/utils/storage.js'

export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字,
      timer: null, // 防抖的定时器
      suggestList: [], // 联想建议列表
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn () {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        this.suggestList = []
        if (this.kw.length === 0) return
        const res = await suggestListAPI(this.kw)
        this.suggestList = res.data.data.options
      }, 300)
    },
    // 专门处理字符串高亮关键字
    lightFn (originStr, target) {
      // originStr：原来的字符串
      // target：关键字

      // 因为不是所有关键字都会返回数据的，如果关键字没有数据返回，会这样一个数组 [null]
      // 此时如果 null.replaceAll 会报错，所以加一个判断，如果传递进来的是一个 null 值就直接结束
      if (originStr === null) {
        return
      }

      // 如果要使用变量，作为正则的匹配条件，不能使用语法糖简化写法
      const reg = new RegExp(target, 'ig')

      // 替换后的值不能用 target
      // 例如：输入框里的是 java，匹配回来的联想菜单是 Java，JAVA jAVA，都被 replace 替换成输入框 target 值 java
      return originStr.replaceAll(reg, (match) => {
        // match 就是匹配中时，原字符串里的那个字符，用人家原来的，只不过给个颜色即可
        return `<span style="color: red;">${match}</span>`
      })
    },
    // 输入框 - 搜索事件
    searchFn () {
      // 如果没有关键字，以下所有都不执行
      if (this.kw) {
        // 搜索关键字 - 保存到历史记录的数组里
        this.history.push(this.kw)
        // 坑：路由跳转，在 watch 之前执行，所以我们要让路由跳转，来一个定时器包裹，让跳转最后执行
        // 原因是 watch 属于 searFn 新开启的宏任务，而直接跳转属于 searchFn 的微任务。给跳转包一个定时器之后，
        // 跳转也是 searchFn 新开启的宏任务了，而且是后开启的，所以执行顺序排在 watch 之后
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${this.kw}`
          })
        }, 0)
      }
    },
    // 联想菜单 - 点击事件
    suggestClickFn (str) {
      // 搜索关键字 - 保存到历史记录的数组里
      this.history.push(str)
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${str}`
        })
      }, 0)
    },
    // 搜索历史记录列表项的点击事件
    historyClickFn (str) {
      this.$router.push({
        path: `/search_result/${str}`
      })
    },
    // 清空历史记录
    clearFn () {
      this.history = []
    }
  },
  watch: {
    history: { // 监听历史记录数组的改变
      deep: true,
      handler () {
        const theSet = new Set(this.history)
        const arr = Array.from(theSet)
        // 立即覆盖式的保存到本地
        setStorage('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

// 搜索建议列表样式
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 搜索历史
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
