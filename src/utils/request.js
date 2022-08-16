/**
 * 啊佐
 * 2022/06/17
 */

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
// 创建axios 实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/phpProxyApi' : process.env.VUE_APP_PHPAPI,
  timeout: 12000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // 追加token
      config.headers['token'] = getToken()
    }
    if (config.Headers) {
      config.headers = Object.assign(config.headers, config.Headers)
    }
    const data = qs.parse(config.data) // data参数
    // 追加lang参数
    data.lang = store.getters.language
    data.account = store.getters.address
    if (config.method === 'post') {
      config.data = qs.stringify(data)
    } else if (config.method === 'get') {
      config.params = data
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // 请求错误code 拦截并提示
    if (res.code !== 1 && res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        offset: 100,
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
