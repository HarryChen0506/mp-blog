<template>
  <div>
    <ul class="container log-list">
     文章列表页面
    </ul>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import card from '@/components/card'

export default {
  components: {
    card
  },

  data () {
    return {
      
    }
  },

  created () {
   
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
</style>
