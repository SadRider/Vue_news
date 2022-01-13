<template>
  <div class="layout-container">
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item replace
                       icon="home-o"
                       to='/'>首页</van-tabbar-item>
      <van-tabbar-item replace
                       icon="question-o"
                       to='/qa'>问答</van-tabbar-item>
      <van-tabbar-item replace
                       icon="video-o"
                       to='/video'>视频</van-tabbar-item>
      <van-tabbar-item replace
                       icon="user-o"
                       to='/my'>{{user?'我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style lang='stylus' scoped></style>
