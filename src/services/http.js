// http 请求的封装
import tool from '../utils/tool.js'
import {getHost} from './host.js'
import config from './config.js'

const appId = 'wxcfe56965f4d986f0'
// 通过login的code鉴权获取session
function auth (code) {
  const reqData = {
    url: `${getHost()}/user/auth/wechat/mini`,
    data: {
      code,
      appId: config.appId
    },
    method: 'POST',
    dataType: 'json',
    header: {'content-type': 'application/x-www-form-urlencoded'}
  }
  return commonRequest(reqData)
}

// session管理
const Session = {
  _name: 'session',
  get () {
    return wx.getStorageSync(this._name)
  },
  async set () {
    const loginInfo = await wx.login()
    console.log('login-info', loginInfo)
    const {code} = loginInfo
    try {
      const data = await auth(code, appId)
      const {responseCode, result} = data
      // console.log('setSession', responseCode, result)
      if (responseCode === '0000') {
        wx.setStorageSync(this._name, result)
        return result
      } else {
        console.log('auth fail!(get sessionId)', data)
      }
    } catch (err) {
      console.log('auth fail!(get sessionId)', err)
    }
  },
  remove () {
    wx.removeStorageSync(this._name)
  }
}
const sessionName = 'sessionId'

// versa专用的request 需要sessionId
function request (option = {}) {
  const config = {
    // responseType: 'json'
    // responseType: 'text'
    data: {}
  }
  const newOption = Object.assign({}, config, option)
  const session = Session.get()
  // console.log('session-get', typeof session, session)
  newOption.data[sessionName] = session
  newOption.data['deviceId'] = tool.getDeviceId()
  // newOption.url = tool.formatQueryUrl(newOption.url, {
  //   [sessionName]: session
  // })
  return new Promise(async function (resolve, reject) {
    try {
      let result = await wx.request(newOption)
      resManage(result, resolve, reject, option)
    } catch (err) {
      reject(err)
    }
  })
}
function resManage (res = {}, resolve, reject, option = {}) {
  const {data, errMsg, header, statusCode} = res
  if (statusCode !== 200) {
    reject(errMsg)
  } else {
    if (data.responseCode === '40001') {
      // 微信小程序登录验证不通过
      // 将自动获取新的sessionId重新验证
      console.log('微信小程序登录验证不通过,将进行续session')
      continueSessionRequest(option, resolve, reject)
    } else {
      resolve(data)
    }
  }
}

// 续session请求
async function continueSessionRequest (option = {}, resolve, reject) {
  // reject({name: 1})
  const config = {
    data: {}
  }
  const newOption = Object.assign({}, config, option)
  // 最多执行三次
  let rejectData = {}
  for (let i = 0; i < 2; i++) {
    Session.remove()
    const session = await Session.set()
    console.log('续session次数：' + i, session)
    newOption.data[sessionName] = session
    let result = await wx.request(newOption)
    const {data, errMsg, header, statusCode} = result
    if (statusCode === 200 && data.responseCode !== '40001') {
      resolve(data)
      return
    }
    rejectData = data
  }
  console.log('续session仍然失败！！！')
  reject(rejectData)
}

// 微信专有request
function wxRequest (option = {}) {
  console.log('promise')
  return new Promise((resolve, reject) => {
    wx.request({
      url: option.url,
      method: option.method,
      data: option.data,
      header: option.header,
      dataType: option.dataType,   
      success: function(res) {
        debugger
        console.log('promise')
        const {data, statusCode, errMsg} = res
        if (statusCode === 200) {
          resolve(data)
        } else {
          reject(errMsg)
        } 
      },
      fail: function(err){
        reject(err)
      }
    })
  })
}
// 通用request
function commonRequest (option = {}) {
  const config = {
    // responseType: 'json'
    // responseType: 'text'
    data: {}
  }
  option = Object.assign({}, config, option)
  return new Promise(function (resolve, reject) {
    
    try {      
      // let result = await wxRequest(newOption)      
      wx.request({
        url: option.url,
        method: option.method,
        data: option.data,
        header: option.header,
        dataType: option.dataType,   
        success: function(res) {
          const {data, statusCode, errMsg} = res
          if (statusCode === 200) {
            resolve(data)
          } else {
            reject(errMsg)
          } 
        },
        fail: function(err){
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

const http = {
  request,
  commonRequest,
  Session
}

export default http
