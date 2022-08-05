<template>
  <div id="app">
    <keep-alive :exclude="['Search', 'Login', 'ArticleDetail', 'SearchResult']">
      <!-- exclude 用来标记那些不需要缓存的组件，标记项为组件的 name 属性值 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">

</style>
