import { fetchCommission } from '@/api/user'
import { Message } from 'element-ui'
import Vm from '@/main'
const defaultBalanc = {
  MUT: '0.0000',
  BSC: '0.0000',
  USDT: '0.0000',
  CMSS: '0.0000',
  FOMO: '0.0000'
}
const state = {
  address: localStorage.getItem('address') ? localStorage.getItem('address') : '',
  balance: localStorage.getItem('balance') ? JSON.parse(localStorage.getItem('balance')) : defaultBalanc,
  connectStatus: false, // 钱包连接状态
  commissionReceived: {
    'total': '0',
    'received': '0',
    'level1': '0',
    'level2': '0',
    'level3': '0',
    'level4': '0'
  } // 已领取佣金
}

const mutations = {
  SET_ADDRESS: (state, address) => {
    state.address = address
    localStorage.setItem('address', address)
  },
  DELETE_ADDRESS: (state) => {
    state.address = ''
    localStorage.removeItem('address')
  },
  SET_CONNECT_STATUS: (state, connectStatus) => {
    state.connectStatus = connectStatus
    localStorage.setItem('connectStatus', connectStatus)
  },
  GET_CONNECT_STATUS(state) {
    return state.connectStatus
  },
  DELETE_CONNECT_STATUS: (state) => {
    state.connectStatus = ''
    localStorage.removeItem('connectStatus')
  },
  SET_BALANCE: (state, balance) => {
    state.balance = Object.assign(state.balance, balance)
    localStorage.setItem('balance', JSON.stringify(state.balance))
  },
  DELETE_BALANCE: (state) => {
    state.balance = defaultBalanc
    localStorage.setItem('balance', JSON.stringify(defaultBalanc))
  },
  SET_COMMISSIONRECEIVED: (state, commissionReceived) => {
    state.commissionReceived = commissionReceived
  }
}

const actions = {
  setAddress({ commit }, address) {
    commit('SET_ADDRESS', address)
  },
  setConnectStatus({ commit }, status) {
    commit('SET_CONNECT_STATUS', status)
  },
  getConnectStatus({ commit }) {
    return commit('GET_CONNECT_STATUS')
  },
  setBalance({ state, commit }, balance) {
    console.log('资产:', state.balance)
    commit('SET_BALANCE', balance)
  },
  // 连接钱包
  async connectWallet({ state, dispatch, commit }) {
    await this._vm.$SwarmFarm.setBallBack(async(res) => {
      console.log('链接钱包', res)
      if (res.code === 1007) {
        if (res.address) {
          // 连接钱包成功
          console.log('连接钱包成功')
          Message({
            type: 'success',
            message: Vm.$t('l.info_38')
          })
          // 立即查询合约配置并保存状态
          await dispatch('settings/getContractConfig', null, { root: true })
          await dispatch('permission/setRoles', false, { root: true })
          commit('SET_ADDRESS', res.address)
          commit('SET_CONNECT_STATUS', true)
          commit('SET_BALANCE', defaultBalanc)
          // 查询个人已领取佣金
          dispatch('getCommision')
        } else {
          // 断开连接钱包
          commit('SET_ADDRESS', '')
          commit('SET_CONNECT_STATUS', false)
        }
      } else if (res.code === 1004) {
        // 切换了钱包地址
        console.log('切换了钱包地址', res)
        if (res.accounts.length === 0) {
          dispatch('disConnectWallet')
        } else {
          if (!window.provider) {
            dispatch('disConnectWallet')
          } else {
            commit('SET_CONNECT_STATUS', true)
            commit('SET_ADDRESS', res.accounts[0])
          }
        }
      } else if (res.code === 1005) {
        // 切换钱包链
        console.log('切换钱包链')
        dispatch('disConnectWallet')
      } else if (res.code === 1006) {
        // 切换钱包网络
        console.log('切换钱包网络')
        dispatch('disConnectWallet')
      } else if (res.code === 1002) {
        console.log('连接钱包失败')
        Message({
          type: 'error',
          message: Vm.$t('l.info_44')
        })
      }
    })
    this._vm.$SwarmFarm.doConnectWallet()
  },
  // 断开连接
  async disConnectWallet({ commit, dispatch }) {
    await dispatch('permission/setRoles', false, { root: true })
    this._vm.$SwarmFarm.doDisconnectWallet()
      .then(res => {
      // 清除缓存
        commit('DELETE_ADDRESS')
        commit('DELETE_CONNECT_STATUS')
        commit('DELETE_BALANCE')
      }, () => {
      // 清除缓存
        commit('DELETE_ADDRESS')
        commit('DELETE_CONNECT_STATUS')
        commit('DELETE_BALANCE')
      })
  },
  // 获取USDT资产
  getUSDTBalance({ state, dispatch }) {
    this._vm.$SwarmFarm.doGetTokenBalance(state.address)
      .then(res => {
        dispatch('setBalance', { 'USDT': res.data })
      }, () => {
        dispatch('setBalance', { 'USDT': 0 })
      })
  },
  // 获取MUT资产
  async getMUTBalance({ state, dispatch }) {
    await this._vm.$SwarmFarm.doGetTokenBalance(state.address, 'MUT')
      .then(res => {
        console.log('MUT', res)
        dispatch('setBalance', { 'MUT': res.data })
      }, () => {
        dispatch('setBalance', { 'MUT': 0 })
      })
  },
  // 获取FOMO奖金资产
  getFOMOBalance({ state, dispatch }) {
    this._vm.$SwarmFarm.doFomoRewardClaimable(state.address)
      .then(res => {
        dispatch('setBalance', { 'FOMO': res.data })
      }, () => {
        dispatch('setBalance', { 'FOMO': 0 })
      })
  },
  // 获取佣金资产
  getCMSSBalance({ state, dispatch }) {
    this._vm.$SwarmFarm.doGetSharedProfit(state.address)
      .then(res => {
        console.log('佣金：', res)
        dispatch('setBalance', { 'CMSS': res.data })
      }, () => {
        dispatch('setBalance', { 'CMSS': 0 })
      })
  },
  // 获取已领取佣金
  getCommision({ state, commit }) {
    fetchCommission({ account: state.address })
      .then(res => {
        commit('SET_COMMISSIONRECEIVED', res.data)
      }, () => {
        commit('SET_COMMISSIONRECEIVED', {
          'total': '0',
          'received': '0',
          'level1': '0',
          'level2': '0',
          'level3': '0',
          'level4': '0'
        })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
