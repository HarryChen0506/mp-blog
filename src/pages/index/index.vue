<template>
  <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>
    <div>
      <span>openid: {{openid}}</span><br>
      <span>userId: {{userId}}</span><br>
      <!-- <span>session_key: {{session_key}}</span> -->
    </div>
    <!-- <button @click="demo">异步</button>  -->
    <button open-type="getUserInfo" @getuserinfo="getUesrInfo">getUserInfo</button>
    <button @click="logincode">logincode</button>
    <button @click="test">test</button>

    <!-- <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form> -->
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
  </div>
</template>

<script>
import card from '@/components/card'
import {base} from '@/services/service'
import config from '@/services/config.js'

export default {
  data () {
    return {
      motto: 'Hello World！！！',
      userInfo: {},
      openid: '',
      userId: '',
      session_key: ''
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    async getUesrInfo (e) {
      console.log('e', e)
      const {userInfo, encryptedData, id, iv, rawData, signature} = e.target
      this.userInfo = userInfo
      const postData = {
        openId: this.openid , 
        appId: config.appId,
        userInfo,
        encryptedData, 
        iv, 
        rawData, 
        signature
      }
      console.log('postData', postData)
      const res = await base.updateUserInfo(postData)
      this.userId = res.result.Id
      console.log('userUpdata res', res)
    },
    clickHandle (msg, ev) {
      // console.log('clickHandle:', msg, ev)
    },
    async test () {
      const res = await base.test()
      console.log('test', res)
    },
    async logincode () {
      const self = this
      wx.login({
        async success (data) {
          // console.log('login code', data.code)
          const res = await base.logincode(data.code)
          const {openid, session_key} = res.result
          console.log('codeRes', res)
          self.openid = openid
          self.session_key = session_key
        }
      })
    },
    async demo () {
      console.log('demo')
    }
  }, 

  created () {
    // 调用应用实例的方法获取全局数据
    this.logincode()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 10px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
