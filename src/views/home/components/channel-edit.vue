<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div class="title-text"
           slot="title">我的频道</div>
      <van-button type="danger"
                  class="edit-btn"
                  plain
                  round
                  size="mini"
                  @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid class="my-grid"
              :gutter="10">
      <van-grid-item v-for="(channel,index) in myChannels"
                     class="grid-item"
                     :key="index"
                     @click="onMyChannelClick(channel,index)">
        <van-icon v-show="isEdit && !fiexdChannels.includes(channel.id)"
                  slot="icon"
                  name="clear"></van-icon>
        <span slot="text"
              class="text"
              :class="{active:index===active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div class="title-text"
           slot="title">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid"
              :gutter="10">
      <van-grid-item v-for="(channel,index) in recommendChannels"
                     class="grid-item"
                     :key="index"
                     icon="plus"
                     :text="channel.name"
                     @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所以频道
      isEdit: false, // 控制编辑状态切换
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  watch: {},
  computed: {
    ...mapState(['user']),
    // 从全部模块中筛选出剩余的推荐模块
    recommendChannels () {
      const channels = []
      this.allChannels.forEach(channel => {
        // find遍历数组，找到满足条件的元素
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // 如果找到相同的频道，不存入数组，反之存入
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  created () {
    this.getAllChannels()
  },
  mounted () { },
  methods: {
    // 获取全部频道
    async getAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        // 已登录
        try {
          addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登录，存到本地
        setItem('NEWS_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      // 编辑状态
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        this.myChannels.splice(index, 1)
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          setItem('NEWS_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败')
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.channel-edit
  padding 85px 0
  .title-text
    font-size 32px
    color #333333
  .edit-btn
    width 104px
    height 48px
    font-size 26px
    color #f85959
    border 1px solid #f85959
  /deep/.grid-item
    width 160px
    height 86px
    .van-grid-item__content
      background-color #f4f5f6
      white-space nowrap
      .van-grid-item__text, .text
        font-size 28px
        color #222
        margin-top 0
      .active
        color #f85959
  /deep/.recommend-grid
    .van-grid-item__content
      flex-direction row
      .van-icon-plus
        font-size 28px
        margin-right 6px
  /deep/.my-grid
    .grid-item
      .van-grid-item__icon-wrapper
        position static
        .van-icon-clear
          position absolute
          right -10px
          top -10px
          font-size 15px
          color #cacaca
          z-index 2
</style>
