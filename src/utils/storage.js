class Store {
  constructor(key) {
    this.key = 'store'
  }

  // 存储
  setItem(params) {
    const initObj = {
      key: '', // 存储的key
      value: '', // 存储的值
      validity: null, // 过期时间 单位：毫秒
      start: new Date().getTime() // 记录什么时候存储的
    }
    const options = {}
    // 合并、并处理参数
    Object.assign(options, initObj, params)
    localStorage.setItem(options.key, JSON.stringify(options))
  }

  // 取值
  getItem(key) {
    const options = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : undefined
    // 设置了过期时间
    if (options.validity && options.validity > 0) {
      const date = new Date().getTime()
      // 判断是否超时
      if (date - options.start > options.validity) {
        //  缓存过期，清除缓存，返回undefined
        localStorage.removeItem(key)
        return undefined
      } else {
        // 存储还没到时间
        return options.value
      }
    } else {
      // 如果没有设置失效时间，直接返回值
      return options.value
    }
  }

  // 对外暴露移出缓存方法
  removeItem(key) {
    localStorage.removeItem(key)
  }
}

export default new Store()
