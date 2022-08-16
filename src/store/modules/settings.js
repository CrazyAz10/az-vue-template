import { getHelpVieo } from '@/api/system'
const state = {
  contractConfig: {
    '_matureTime': '0', // 最小成熟周期
    '_backlogTime': '0', // 积压计算时间，如：24小时内入金比总金额的24小时。
    '_cycleYieldsPercent': '0.08', // 收益率,
    '_minDevelopCustomAmount': '0', // 发展下线最少花费MUT量,
    '_fomoPoolPercent': '0', // fomo奖金截留比率,
    '_sysFundPercent': '0', // 系统维护费截留比率,
    '_resetCountDownTimeLength': '0', // 倒计时长,
    '_backlogToCountdown': '0', // 重启倒计时触发比率,
    '_landPrice': '0', // 土地价格（MUT）,
    '_minAmountBuy': '0', // 最小播种量,
    '_maxAmountBuy': '0', // 最大播种量,
    '_charityPercent': '0', // 慈善基金截留比率,
    '_sharedPercent': [
      '4',
      '3',
      '1',
      '5'
    ] // 分销等级和返佣比率数组
  }, // 合约配置
  helpVedio: {
    promote: '', // 推广视频链接
    seed: '' // 播种教程视频链接
  } // 视频教程
}

const mutations = {
  SETCONTRACTCONFIG: (state, contractConfig) => {
    state.contractConfig = contractConfig
  },
  SET_HELPVIDEO: (state, helpVedio) => {
    state.helpVedio = helpVedio
  }
}

const actions = {
  // 获取合约配置
  async getContractConfig({ dispatch, commit }) {
    await this._vm.$SwarmFarm.doGetSysSetting(0)
      .then(res => {
        console.log('合约配置', res.data)
        var conf = res.data
        conf._landPrice = conf._landPrice / Math.pow(10, 18)
        conf._minAmountBuy = conf._minAmountBuy / Math.pow(10, 18)
        conf._maxAmountBuy = conf._maxAmountBuy / Math.pow(10, 18)
        conf._cycleYieldsPercent = conf._cycleYieldsPercent / 1000
        conf._charityPercent = conf._charityPercent / 1000
        conf._sharedPercent = conf._sharedPercent.map(item => {
          return item / 10
        })
        for (const i in conf) {
          if (!isNaN(conf[i] * 1)) {
            conf[i] *= 1
          }
        }
        commit('SETCONTRACTCONFIG', conf)
      })
  },
  // 获取视频教程链接
  async getHelpVieo({ commit }) {
    getHelpVieo()
      .then(res => {
        console.log('视频教程', res.data)
        commit('SET_HELPVIDEO', res.data)
      }, () => {
        commit('SET_HELPVIDEO', {
          promote: '', // 推广视频链接
          seed: '' // 播种教程视频链接
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

