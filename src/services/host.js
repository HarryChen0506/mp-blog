// host域名管理
// const ENV = 'dev' // 'dev' 本地
const ENV = 'test' // 'test' 测试
// const ENV = 'prod' // 'prod' 生产
const host = {
  miniapi: {
    dev: 'http://localhost:8082',
    test: 'https://sunny.natapp4.cc',
    prod: 'https://mini-program.api.versa-ai.com'
  },
  upload: {
    dev: 'https://versa-static.oss-cn-shanghai.aliyuncs.com',
    prod: 'https://versa-static.oss-cn-shanghai.aliyuncs.com'
  },
  download: {
    dev: 'https://static01.versa-ai.com',
    prod: 'https://static01.versa-ai.com'
  }
}

// 获取域名
export function getHost (type = 'miniapi') {
  return host[type][ENV]
}

export default {
  getHost: getHost
}
