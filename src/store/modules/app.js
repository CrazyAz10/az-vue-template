const state = {
  device: 'desktop',
  mobileNavSlide: true, // 移动端 顶部导航栏显示
  noticeSlideBar: true, // 移动端 顶部公告栏显示
  language: localStorage.getItem('language') || 'en',
  size: localStorage.getItem('size') || 'medium'
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    localStorage.setItem('language', language)
  },
  SET_NOTICE: (state, notice) => {
    state.notice = notice
  },
  SET_SIZE: (state, size) => {
    state.size = size
    localStorage.setItem('size', size)
  },
  SET_MOBILENAVSLIDE: (state, mobileNavSlide) => {
    state.mobileNavSlide = mobileNavSlide
  },
  SET_NOTICESLIDEBAR: (state, noticeSlideBar) => {
    state.noticeSlideBar = noticeSlideBar
  }
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setNotice({ commit }, notice) {
    commit('SET_NOTICE', notice)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setMobileNavSlide({ commit }, mobileNavSlide) {
    commit('SET_MOBILENAVSLIDE', mobileNavSlide)
  },
  setNoticeSlideBar({ commit }, noticeSlideBar) {
    commit('SET_NOTICESLIDEBAR', noticeSlideBar)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
