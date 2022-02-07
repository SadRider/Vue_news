<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 fixed>
      <van-button class="search-btn"
                  slot="title"
                  type="info"
                  size="small"
                  round
                  icon="search">搜索</van-button>
    </van-nav-bar>

    <!-- 频道标签页 -->
    <van-tabs class="channel-tabs"
              v-model="active"
              animated
              swipeable>
      <van-tab v-for="item in channels"
               :key="item.id"
               :title="item.name">
        <article-list :channel="item"></article-list>
      </van-tab>
      <div slot="nav-right"
           class="placeholder"></div>
      <div slot="nav-right"
           @click="isChennelEditShow=true"
           class="hamburger-btn">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup v-model="isChennelEditShow"
               closeable
               position="bottom"
               close-icon-position="top-left"
               :style="{ height: '100%' }">
      <ChannelEdit :myChannels="channels"
                   :active="active"
                   @update-active="onUpdateActive" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/articleList.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: '',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false
    }
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  created () { },
  mounted () {
    this.getUserChannels()
  },
  methods: {
    async getUserChannels () {
      try {
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('NEWS_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (e) {
        // console.log(e)
        this.$toast('获取失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang='stylus' scoped>
.home-container
  padding-top 174px
  padding-bottom 100px
  /deep/.van-nav-bar__title
    max-width unset
  .search-btn
    width 555px
    height 64px
    background-color #5babfb
    border none
    font-size 28px
    .van-icon
      color #fff
      font-size 32px
  /deep/.channel-tabs
    .van-tabs__wrap
      height 82px
      position fixed
      top 92px
      left 0
      right 0
      z-index 1
    .van-tab
      border-right 1px solid #edeff3
      min-width 200px
      font-size 30px
      color #777777
    .van-tab--active
      color #333333
    .van-tabs__line
      bottom 38px
      width 31px !important
      height 6px
      background-color #3296fa
    .placeholder
      padding-right 66px
      height 82px
    .hamburger-btn
      position fixed
      right 0
      width 66px
      height 82px
      display flex
      justify-content center
      align-items center
      background-color #fff
      opacity 0.902
      i.iconfont
        font-size 33px
      &:before
        content ''
        position absolute
        left 0
        width 1px
        height 80%
        background-image url('~@/assets/gradient-gray-line.png')
        background-size cover
</style>
