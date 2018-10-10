<template>
  <div>
    <ul class="container log-list">
     文章列表页面
     <button @click="getCategoryList" size="mini">获取分类</button>
     <button @click="getArticleList" size="mini">获取文章</button>
    </ul>  
    <navbar :list="categoryList" :default-category="defaultCategory" @select-category="chooseCategory"></navbar>
    <div class="article-list">
      <ul>
        <li class="article-item" v-for="item in articleList" :key="item.Id">
          <span>{{item.title}}</span> --
          <span>{{item.writers[0].name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import {base, article} from '@/services/service'
import card from '@/components/card'
import navbar from '@/components/navbar'

export default {
  components: {
    card,
    navbar
  },
  data () {
    return {
      categoryList: [],
      defaultCategory: {},
      currentCategory: {},
      articleList: [],
      list: [1, 2]
    }
  },
  created () {
   
  },
  mounted () {
    this.getCategoryList()    
  },
  methods: {
    async getCategoryList () {   
      const res = await article.category()
      this.categoryList = res.result.list || []
      this.defaultCategory = this.currentCategory = this.categoryList[1]
      this.getArticleList()
    },
    chooseCategory (item) {
      console.log('choose', item)
      this.currentCategory = item
      this.getArticleList()
    },
    async getArticleList () {
      const mainCategoryId = this.currentCategory.Id
      const params = {
        mainCategoryId,
        pageNum: 1,
        pageSize: 20
      }
      const res = await article.articleList(params)
      this.articleList = res.result.list
      // console.log('getArticleList', res)
    }
  },
  onShow: function() {
    // Do something when page show.
    // wx.hideTabBar({animation: true})
  },
}
</script>

<style>
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
</style>
