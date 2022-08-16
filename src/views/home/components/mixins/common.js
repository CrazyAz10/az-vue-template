import SwarmFarm from '@/utils/SwarmFarm'
import themeCard from '../themeTools/themeCard'
import gradientBtn from '../themeTools/gradientBtn'
import { parseTime } from '@/utils'
import { scrollTo } from '@/utils/scrollTo'
import commonMixins from '@/mixins'
export default {
  components: {
    themeCard,
    gradientBtn
  },
  mixins: [commonMixins],
  data() {
    return {
      SwarmFarm: SwarmFarm, //
      parseTime: parseTime,
      charitablePool: 0, // 慈善基金池
      bonusPool: 0, // 奖金池
      listentTimer: null,
      reincarnationTips: {} // 轮回盘次提示
    }
  },
  filters: {},
  computed: {
    // 连接钱包的地址
    address: function() {
      return this.$store.getters.address
    },
    // 钱包连接状态
    connectStatus: function() {
      return this.$store.getters.connectStatus
    },
    // 个人资产
    balance: function() {
      return this.$store.getters.balance
    },
    // 最新盘局是否已经结束
    roundOver: function() {
      return this.$store.state.game.roundOver
    },
    // 合约配置
    contractConfig() {
      return this.$store.getters.contractConfig
    },
    device() {
      return this.$store.getters.device
    }
  },
  created() {
  },
  watch: {
    roundOver: function(n, o) {
      if (!n && this.myWheat && this.myWheat.res && this.harvestAmount * 1 > 0) {
        this.wheatStatusVisible = false
      }
    }
  },
  methods: {
    async init() {
      // 开启监听器
      clearInterval(this.listentTimer)
      this.entrance()
      this.entranceHistory()
      this.listenUpadeData()
    },
    // 定时器监听
    listenUpadeData() {
      this.listentTimer = setInterval(async() => {
        // 监听小麦状态
        // if (this.myWheat.res) {
        await this.getMaxRoundNumber()
        this.searchMyWheat()
        // }
        // 获取慈善基金池
        this.getCharityAmount(this.maxRoundNumber)
        // 获取奖金池
        this.getFomoPoolAmount(this.maxRoundNumber)

        // 监听播种队列
        this.$SwarmFarm.doGetRoundData(this.currentNumber).then((res) => {
          console.log('监听-轮回队列：', res)
          var change = false
          if (res.data.lastIndex * 1 !== this.lastIndex * 1) {
            // 队列有新增数据
            this.lastIndex = res.data.lastIndex * 1
            this.getOverDownTime()
            change = true
          }
          if (res.data.currentIndex * 1 !== this.currentIndex * 1) {
            // 队列有出局数据
            // 从播种队列删除已经出局的人
            var currentIndex = this.currentIndex
            if (this.enterList['NO' + this.currentNumber] && this.enterList['NO' + this.currentNumber].length) {
              for (let i = currentIndex; i <= res.data.currentIndex * 1; i++) {
                var deleteIndex = this.enterList['NO' + this.currentNumber].findIndex((item) => {
                  return item.index === i
                })
                this.enterList['NO' + this.currentNumber].splice(deleteIndex, 1)
              }
            }
            this.currentIndex = res.data.currentIndex * 1
            change = true
          }
          if (res.data.firstIndex * 1 !== this.firstIndex * 1) {
            this.firstIndex = res.data.firstIndex * 1
            change = true
          }
          // 重新排查查询队列
          if (change) {
            // 获取个人未出局的数据
            this.getSeedUserData(this.currentNumber)
            this.recursionGetItemData()
          }
        })
        this.getFarmLandPS()
        // // 获取轮回积压值
        // this.getBacklog()
        // 开启轮回倒计时
        this.getOverDownTime()
        // 查询指定轮回奖金池
        this.getRoundFomoPoolAmount(this.currentNumber)
      }, 10 * 1000)
    },
    // 参与游戏
    toGame() {
      var to = document.getElementById('game').offsetTop
      scrollTo(to, 500, () => {})
    },
    // 获取最大轮回数
    async getMaxRoundNumber() {
      if (!this.address || !this.connectStatus) {
        return
      }
      await this.$SwarmFarm.doGetCurrentRoundIndex().then((res) => {
        console.log('最大轮回数：', res)
        if (!this.maxRoundNumber || this.maxRoundNumber !== res.data) {
          // 最大轮回
          this.maxRoundNumber = res.data
          // 分页轮回初始值
          this.currentNumber = res.data
          // 最近一次播种轮回初始值
          this.sowRounds = res.data
        }
      })
    },
    // 查询慈善基金池
    getCharityAmount() {
      this.$SwarmFarm.doGetCharityAmount()
        .then(res => {
          console.log('慈善基金池:', res)
          // 慈善基金池
          this.charitablePool = res.data
        })
    },
    // 查询奖金池
    getFomoPoolAmount(round) {
      this.$SwarmFarm.doGetFomoPoolAmount(round)
        .then(res => {
          console.log('奖金池:', res)
          this.bonusPool = res.data
        })
    },
    /**
     * 检查授权&授权
     * @param {*} coin 授权代币
     * @param {*} modle 授权所属ABI模块
     * @param {*} amount 授权金额
     * @param {*} address 授权钱包地址
     * @param {*} tipsTitle 提示文案标题
     * @param {*} loading 授权完成前loading
     * @param {*} callBack 授权完成后回调
     */
    async inspectAndApprove(coin, modle, amount, address, tipsTitle, loading, callBack) {
      this[loading] = true
      var notify = this.$azNotify.notify({
        type: 'info',
        title: this.$t('l.info_4'),
        message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
      })
      // 检查授权
      this.$SwarmFarm.doCheckAllowance(coin, modle, amount, address)
        .then(res => {
          notify.close()
          if (res.data) {
            // 已经授权
            callBack()
          } else {
            notify = this.$azNotify.notify({
              type: 'info',
              title: tipsTitle,
              message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
            })
            this.$SwarmFarm.doApproveAmount(coin, modle, amount, address)
              .then(res => {
                notify.close()
                if (res.code === 1) {
                  this.$azNotify.notify({
                    type: 'success',
                    title: tipsTitle,
                    duration: 10000,
                    message: `<div>${this.$t('l.info_6')}</div>`
                  })
                  callBack()
                } else {
                  this.$azNotify.notify({
                    type: 'error',
                    title: tipsTitle,
                    duration: 10000,
                    message: `<div>${this.$t('l.info_7')}</div>`
                  })
                  return false
                }
              }, () => {
                this[loading] = false
                notify.close()
                this.$azNotify.notify({
                  type: 'error',
                  title: tipsTitle,
                  duration: 10000,
                  message: `<div>${this.$t('l.info_7')}</div>`
                })
              })
          }
        }, () => {
          this[loading] = false
          notify.close()
          this.$azNotify.notify({
            type: 'error',
            title: tipsTitle,
            duration: 10000,
            message: `<div>${this.$t('l.info_7')}</div>`
          })
        })
    }
  },
  destroyed() {
    clearInterval(this.listentTimer)
  }
}
