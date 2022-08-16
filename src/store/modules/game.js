const state = {
  maxRound: 1, // 最大回合数
  lastSowIndex: 0, // 最后一个播种索引
  roundOver: false // 当前局是否已经结束
}

const mutations = {
  SET_ROUNDOVER: (state, roundOver) => {
    state.roundOver = roundOver
  }
}

const actions = {
  setRoundsOver({ commit }, roundOver) {
    commit('SET_ROUNDOVER', roundOver)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
