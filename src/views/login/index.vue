<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 title="登录" />
    <!-- 登录 -->
    <van-form @submit="onSubmit">
      <van-field name="手机号"
                 v-model="user.mobile"
                 placeholder="请输入手机号">
        <i slot="left-icon"
           class="iconfont icon-shouji"></i>
      </van-field>
      <van-field v-model="user.code"
                 name="验证码"
                 placeholder="请输入验证码">
        <i slot="left-icon"
           class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-button round
                      size="small"
                      type="default"
                      class="send-sms-btn">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrp">
        <van-button class="login-btn"
                    block
                    type="info"
                    native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  watch: {},
  computed: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit () {
      try {
        const res = await login(this.user)
        console.log('成功', res)
      } catch (err) {
        console.log('失败')
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
        } else {
          console.log('登陆失败')
        }
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.login-container
  .iconfont
    font-size 37px
  .send-sms-btn
    width 156px
    height 46px
    line-height 46px
    font-size 22px
    color #666
    background-color #ededed
  .login-btn-wrp
    padding 53px 33px
    .login-btn
      background-color #6db4fb
      border none
</style>
