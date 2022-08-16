import developmentRouter from '@/router/modules/development'
import userRouter from '@/router/modules/user'
const state = {
  roles: false
}

const mutations = {
  'SET_ROLES': (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  setRoles({ commit }, roles) {
    commit('SET_ROLES', roles)
  },
  generateRoutes({ commit, dispatch }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // 钱包链接权限路由
      if (this.getters.connectStatus) {
        accessedRoutes = accessedRoutes.concat(accessedRoutes, userRouter)
      }
      // 开发环境路由
      if (process.env.NODE_ENV === 'development') {
        accessedRoutes = accessedRoutes.concat(accessedRoutes, developmentRouter)
      }
      accessedRoutes = accessedRoutes.concat(accessedRoutes, [{ path: '*', redirect: '/404', hidden: true }])
      commit('SET_ROLES', true)
      resolve(accessedRoutes)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
