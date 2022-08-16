import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (!store.getters.roles) {
    try {
      // 权限路由获取
      const accessRoutes = await store.dispatch('permission/generateRoutes')
      console.log(accessRoutes)
      // dynamically add accessible routes
      router.matcher.addRoutes(accessRoutes)
      console.log(router)
      next({ ...to, replace: true })
    } catch (error) {
      next()
    }
  } else {
    console.log(to)
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
