<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading"
                      @refresh="onRefresh"
                      success-text="刷新成功"
                      :success-duration="1500">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :error.sync="error"
                error-text="请求失败，点击重新加载">
        <ArticleItem v-for="(item,index) in list"
                     :key="index"
                     :article="item" />
        <!-- <van-cell v-for="(item,index) in list"
                  :key="index"
                  :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false, // 控制列表加载错误
      isRefreshLoading: false
    }
  },
  watch: {},
  computed: {},
  created () { },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: null || Date.now()
        })
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (e) {
        console.log(e)
        this.error = true
        this.loading = false
      }
    },
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })
        const { results } = data.data
        this.list.unshift(...results)
        this.isRefreshLoading = false
      } catch (e) {
        this.refreshSuccessText = '刷新失败'
        this.isRefreshLoading = false
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.article-list
  height 79vh
  overflow-y auto
</style>
