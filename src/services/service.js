// 业务服务的封装
import http from './http.js'
import tool from '../utils/tool.js'
import {getHost} from './host.js'
import config from './config.js'

// 基础服务
export const base = {
  test: function () {
    const reqData = {
      url: `${getHost()}/mp/api/wechat/wlyh/demo`,
      data: {
        name: 123
      },
      method: 'GET',
      dataType: 'json'
    }
    return http.commonRequest(reqData)
  },
  logincode: function (code) {
    const reqData = {
      url: `${getHost()}/mp/api/wechat/wlyh/logincode`,
      data: {
        code,
        appId: config.appId,
        appSecret: config.appSecret
      },
      method: 'POST',
      dataType: 'json'
    }
    return http.commonRequest(reqData)
  },
  updateUserInfo: function (data) {
    const reqData = {
      url: `${getHost()}/mp/api/wechat/wlyh/userinfo`,
      data: data,
      method: 'POST',
      dataType: 'json'
    }
    return http.commonRequest(reqData)
  },
  // 待删
  uploadToken: function () {
    const reqData = {
      url: `${getHost()}/upload/uploadPolicy`,
      data: {
        clientType: 'mini-program',
        fileType: 'image',
        filename: 'image.jpeg'
      },
      method: 'GET',
      dataType: 'json'
    }
    return http.request(reqData)
  },
  // 管理上传token
  getUploadToken: async function () {
    let token = wx.getStorageSync('token')
    if (token && token.expire > Date.now()) {
      return token
    }
    try {
      const data = await base.uploadToken()
      token = data && data.result
      wx.setStorageSync('token', token)
      return token
    } catch (err) {
      console.log('get uploadToken fail', err)
    }
  },
  upload: async function (filePath, type) {
    // 上传图片
    // filePath 本地图片路径
    let imageType = type || 'png'
    const token = await base.getUploadToken()
    const imgName = tool.createImgName(16)
    // token.params.key = `upload/mini-program/transfer/${imgName}.${imageType}?x-oss-process=image/resize,h_600/quality,q_50`
    token.params.key = `upload/mini-program/transfer/${imgName}.${imageType}`
    // console.log('upload-token', token)
    // console.log('filePath', filePath)
    let {data} = await wepy.uploadFile({
      filePath,
      name: 'file',
      url: token.host,
      formData: token.params
    })
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
        data.host = 'https://static01.versa-ai.com/'
        data.url = data.host + data.picurl
      } catch (err) {
        console.log('upload image string parse to json fail !!!')
      }
    }
    return data
  },
  downloadFile: function (url) {
    // 下载文件
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: url,
        success: function (res) {
          if (res.statusCode === 200) {
            // console.log('res', res)
            // const localImageUrl = res.tempFilePath
            resolve(res.tempFilePath)
          } else {
            reject('download file fail!')
          }
        },
        fail: function (err) {
          // console.log('download fail', err)
          reject(err)
        }
      })
    })
  },
  // 通过login的code鉴权获取session
  auth: function (code) {
    const reqData = {
      url: `${getHost()}/user/auth/wechat/mini`,
      data: {
        code,
        appId: config.appId
      },
      method: 'POST',
      dataType: 'json'
    }
    return http.commonRequest(reqData)
  },
  // 用户授权后向后端请求auth
  loginAuth: function (detail) {
    const data = {}
    data.appId = config.appId || ''
    data.encryptedData = detail.encryptedData || ''
    data.iv = detail.iv || ''
    const reqData = {
      url: `${getHost()}/user/auth/miniProgram`,
      data: data,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    return http.request(reqData)
  },
  timeout: function (interval, toReject) {
    // isReject为true时reject
    // 默认resolve
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (toReject) {
          reject('timeout fail !')
        } else {
          resolve('timeout success !')
        }
      }, interval)
    })
  }
}


export default {
  base
}
