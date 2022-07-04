<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getAllChannelsAPI } from '@/api'
export default {
  async created () {
    try {
      const res = await getAllChannelsAPI()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="less">

</style>
