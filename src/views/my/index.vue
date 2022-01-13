<template>
  <div class="my-container">
    <div v-if="!user"
         class="header not-login">
      <div class="login-btn"
           @click="$router.push('/login')">
        <img class="mobile-img"
             src="~@/assets/mobile.png">
        <span class="text">登录/注册</span>
      </div>
    </div>
    <div v-else
         class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image round
                     class="avatar"
                     fit="cover"
                     :src="userInfo.photo" />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">点赞</span>
        </div>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid :column-num="2"
              class="grid-nav"
              clickable>
      <van-grid-item>
        <i slot="icon"
           class="iconfont icon-shoucang"></i>
        <span slot="text"
              class="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon"
           class="iconfont icon-lishi"></i>
        <span slot="text"
              class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知"
              is-link />
    <van-cell title="单元格"
              class="cell"
              is-link />
    <van-cell v-if="user"
              title="退出登录"
              clickable
              class="logout-cell"
              @click="Onlogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () { },
  methods: {
    Onlogout () {
      this.$dialog.confirm({
        title: '确认退出登录吗?'
        // message: '弹窗内容'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.my-container
  .header
    height 361px
    background url('~@/assets/banner.png')
    background-size cover
  .not-login
    display flex
    justify-content center
    align-content center
    .login-btn
      display flex
      flex-direction column
      justify-content center
      align-content center
      .mobile-img
        width 132px
        height 132px
        margin-bottom 15px
      .text
        display block
        text-align center
        font-size 28px
        color #fff
  .user-info
    .base-info
      height 231px
      padding 76px 32px 23px
      box-sizing border-box
      display flex
      justify-content space-between
      align-items center
      .left
        display flex
        align-items center
        .avatar
          width 132px
          height 132px
          margin-right 23px
          border 4px solid #fff
        .name
          font-size 30px
          color #fff
    .data-stats
      // height 130px
      display flex
      .data-item
        height 130px
        flex 1
        display flex
        flex-direction column
        justify-content center
        align-items center
        color #fff
        .count
          font-size 36px
        .text
          font-size 23px
  .grid-nav
    margin-bottom 9px
    i.iconfont
      font-size 45px
    .icon-shoucang
      color pink
    .icon-lishi
      color orange
    span.text
      font-size 28px
  .cell
    margin-bottom 9px
  .logout-cell
    text-align center
    color red
</style>
