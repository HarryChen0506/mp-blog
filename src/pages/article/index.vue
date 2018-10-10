<template>
  <div>
    <ul class="container log-list">
     文章详情页面-{{articleId}}
     <button size="mini">获取分类</button>
    </ul>
    <div class="content">
      <wxParse v-if="text" :content="text" @preview="preview" @navigate="navigate" class-name="content-box"/>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import {base, article} from '@/services/service'
import card from '@/components/card'
import navbar from '@/components/navbar'
import wxParse from 'mpvue-wxparse'

export default {
  components: {
    wxParse,
    card,
    navbar
  },
  data () {
    return {
      articleId: '',
      chapterList: [],
      text: ''
    }
  },
  created () {
   
  },
  mounted () {
     const {articleId} = this.$root.$mp.query
     this.articleId = articleId
     this.getChapterList()
  },
  methods: {
    async getChapterList () {
      const articleId = this.articleId
      const params = {
        articleId,
        pageNum: 1,
        pageSize: 1
      }  
      const res = await article.chapterList(params)
      this.chapterList = res.result.list || []
      this.text = this.chapterList[0].content
      console.log('chapterList', this.chapterList)
    },
    preview(src, e) {
      // do something 预览图片时触发
    },
    navigate(href, e) {
      // do something 点击链接时触发
    }
  },
  onShow: function () {
    // Do something when page show.
    // wx.hideTabBar({animation: true})
  },
  onUnload: function () {
    // console.log('onUnload')
    this.articleId = ''
    this.chapterList = []
    this.text = ''
  }
}
</script>

<style>
  @import url("~mpvue-wxparse/src/wxParse.css");
  .log-list {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
  }
  .log-item {
    margin: 10rpx;
  }
  .article-list {
    font-size: 12px
  }
  .article-item {
    padding: 10px
  }
  .content {
    padding: 10px
  }
  .content-box {
    /* color: red */
  }
</style>
