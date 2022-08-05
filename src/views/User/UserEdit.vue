<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profileObj.photo"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
            id="ipp"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileObj.name"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profileObj.birthday"
        @click="birthdayClickFn"
      />
    </van-cell-group>

    <!-- 性名修改的弹窗 -->
    <!-- props 不仅可以传递一个具体的值，还可以传递一个函数体 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" v-model="inputUserName" v-fofo />
    </van-dialog>

    <!-- 时间选择器 -->
    <!-- 选择器外边的弹出层 -->
    <van-popup
      v-model="datetimePickerShow"
      position="bottom"
      :style="{ height: '50%' }"
      round
    >
      <!-- 选择器 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancelFn"
        @confirm="confirmFn"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, updateUserPhotoAPI, updateUserProfileAPI } from '@/api/index.js'
import Notify from '@/ui/Notify.js'
import { formatDate } from '@/utils/date.js'

export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {}, // 用户基本资料
      show: false, // 控制性名修改输入框出现/隐藏
      inputUserName: '', // 修改名字 - 弹出框输入框
      minDate: new Date(1990, 0, 1), // 最小范围
      maxDate: new Date(), // 最大范围（建议不给，不给默认获取系统日期 - 今天）【注意：是不给默认获取系统日期，不是不写】
      // 比如你不给组件传递 :max-date 它不是默认获取系统日期，但是你给 max-date 传递一个值（new Date()）则是默认获取系统日期
      currentDate: new Date(2000, 0, 1), // 当前时间
      datetimePickerShow: false // 日期选择器 - 弹出层显示/隐藏
    }
  },
  async created () {
    const res = await userProfileAPI()
    this.profileObj = res.data.data
  },
  methods: {
    // 文件选择改变 - 事件
    async onFileChange (event) {
      // 当我们上传一次图片后，文件选择输入框虽然关闭了但内容还在。再打开文件选择框再点取消，文件选择框内容清空，此事件就会触发一次
      // 所以会出现，上传一次之后。第二次上传取消，图片直接没了的情况。
      // 放到用户场景就是用户上来改变了一次头像，然后又想改一次，结果打开了文件选择之后又不想改了，点了取消。却发现原来的图片也没了
      // 解决方法：加一次判断，如果用户点击了取消，并且这次取消触发了此事件就不执行下列代码
      if (event.target.files.length === 0) return
      const theFd = new FormData()
      theFd.append('photo', event.target.files[0]) // 请求体里加入一对参数名和值
      const res = await updateUserPhotoAPI(theFd)
      this.profileObj.photo = res.data.data.photo
      this.$store.commit('SET_USERPHOTO', res.data.data.photo)
    },
    // 头像图片 - 点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // JS 模拟标签的事件触发
    },
    // 姓名 - 点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 姓名 - 确认框 - 关闭前回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 点确定
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName)) {
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName // 更新成功 - 回显到页面上
          this.$store.commit('SET_USERNAME', this.inputUserName)
          // 通过了校验
          done()
        } else {
          // 没通过校验，给用户提示，并且不允许关闭
          Notify({
            type: 'warning',
            message: '用户名只能是1-7位中英数字组合'
          })
          // 不允许关闭
          done(false)
        }
      } else {
        // 点取消
        done() // 让弹窗关闭
      }
    },
    // 生日单元格的点击事件
    birthdayClickFn () {
      this.datetimePickerShow = true // 时间选择器出现
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 时间选择器 - 取消事件
    dateCancelFn () {
      this.datetimePickerShow = false
    },
    // 日期选择器 - 确认事件
    async confirmFn () {
      // 日期选择器组件里的 currentDate 是日期对象，而后端要的是 年-月-日 格式的字符串
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.datetimePickerShow = false
      this.profileObj.birthday = formatDate(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

:deep(.van-dialog__content) {
  text-align: center;
  input {
    padding: 0;
    border: none;
    text-align: center;
  }
}
</style>
