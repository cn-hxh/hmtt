<template>
  <div class="login">
    <van-nav-bar title="黑马头条-登录"></van-nav-bar>
    <div>
      <!--
        van-form 整体表单组件
        @submit -> 自定义事件（提交事件）

        van-field 输入框（表单项）
        1. 输入框name属性="用户名"
        表单整体提交时，默认收集一个提交对象
        往服务器发送的参数名就是 name 里的值
        { "用户名": "页面值" }
        2. label 属性输入框左侧文本
        3. rules 属性配置检验规则
        :属性名="表达式"
       -->
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[
            {
              required: true,
              message: '请填写正确手机号',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="code"
          label="密码"
          placeholder="请输入6位密码"
          :rules="[
            { required: true, message: '请填写密码', pattern: /^\d{6}$/ },
          ]"
        />
        <div style="margin: 16px">
          <!--
            round 是否为圆形
              （1）属性后面无值，默认值为 true
              （2）block 代表块级元素
              （3）type 代表类型（有默认颜色）
              （4）native-type 代表原生 button 的 type 属性
                - submit 代表这个 van-button 组件渲染的原生 button 标签 type 是 submit，
                  是提交整个表单功能的按钮
           -->
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :loading="isLoading"
            loading-text="正在登录"
            :disabled="isLoading"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
// Notify 是一个函数，不是一个组件
import { Notify } from 'vant'
import { setToken } from '@/utils/token'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13888888888', // 手机号
        code: '246810' // 验证码（密码-必须是 246810 后台规定死的，无论手机号是什么）
      },
      isLoading: false // 登录按钮的加载状态
    }
  },
  methods: {
    // 提交方法（form 整体验证通过）
    async onSubmit (values) {
      // 可以直接用 values（收集参数名和值）
      // console.log(values)

      // 状态设置 true，使得提交按钮禁用并有提示
      this.isLoading = true

      try {
        const res = await loginAPI(values)
        Notify({
          type: 'success',
          message: '登录成功'
        })
        setToken(res.data.data.token)
        // 跳转一定要写在最后 -> 尽量到最后执行
        this.$router.replace({
          path: '/layout/home'
        })
      } catch (error) {
        Notify({
          type: 'danger',
          message: '账号或密码错误'
        })
      }

      // 网络请求完成无论成功/报错，把状态关掉。使得提交按钮可以点击
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
// .van-nav-bar {
//   background-color: #007bff;
// }

// :deep(.van-nav-bar__title) {
//   color: #fff;
// }
</style>
