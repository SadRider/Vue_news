<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 title="登录">
      <template #left>
        <van-icon name="cross"
                  size="18"
                  @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- 登录 -->
    <van-form @submit="onSubmit"
              ref="loginForm">
      <van-field name="mobile"
                 v-model="user.mobile"
                 placeholder="请输入手机号"
                 :rules="userFormRules.mobile"
                 type="number"
                 maxlength="11">
        <i slot="left-icon"
           class="iconfont icon-shouji"></i>
      </van-field>
      <van-field v-model="user.code"
                 name="code"
                 placeholder="请输入验证码"
                 :rules="userFormRules.code"
                 type="number"
                 maxlength="6">
        <i slot="left-icon"
           class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow"
                          :time="1000*10"
                          format="ss s"
                          @finish="isCountDownShow=false" />
          <van-button v-else
                      round
                      size="small"
                      type="default"
                      class="send-sms-btn"
                      native-type="button"
                      @click="onSendSms">发送验证码</van-button>
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
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          {
            required: true, message: '请填写手机号'
          },
          {
            pattern: /1[3|5|7|8]\d{9}/, message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true, message: '请填写验证码'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  watch: {},
  computed: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit () {
      const user = this.user
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const res = await login(user)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        this.$router.push('/my')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败')
        }
      }
    },
    async onSendSms () {
      try {
        // 验证手机号
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log(err)
      }
      this.isCountDownShow = true
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast.fail('发送失败')
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
