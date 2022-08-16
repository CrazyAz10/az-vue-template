import BigNumber from 'bignumber.js'

export default {
  data() {
    return {
      sowDialogVisible: false,
      MUTDialogVisible: false,
      WheatDialogVisible: false,
      wheatStatusVisible: false,
      FOMODialogVisible: false,
      extensionDialogVisible: false,
      farmDialogVisible: false,
      buyLandVisible: false,
      sendMUTVisible: false,
      showLandInfo: false,
      buyLandLoading: false,
      buyWheatLoading: false,
      sharedProfitLoading: false,
      sharedMUTLoading: false,
      gameLoading: false,
      harvestLoading: false,
      parentAddr: null,
      maxRoundNumber: 0, // 最大轮回数
      harvestAmount: 0, // 可收割数量
      hasLand: false, // 是否拥有土地
      canHarvest: false, // 是否可收割
      sowRounds: 0, // 最近一次播种的轮回
      newestWinPrise: {
        isLastIn: false,
        isMostIn: false,
        amount: 0
      }, // 最新一局是否中奖
      myWheat: {
        res: false,
        _buyTime: '0',
        _claimedAmount: '0',
        _queueIndex: '0',
        _roundIndex: '0',
        _soldAmount: '0',
        _ssIndex: '0',
        _totalAmount: '0'
      }, // 我种植的小麦
      formData: {
        uNumber: 0, // 播种小麦使用的usdt
        fNumber: 0, // 播种小麦使用的奖金
        cNumber: 0 // 播种小麦使用的佣金
      },
      farmLandPS: 0
    }
  },
  computed: {
    // 小麦生长状态
    farmLandStatus: function() {
      if (this.hasLand) {
        if (this.roundOver) {
          console.log('当前局已结束', this.roundOver)
          // 当前局已结束
          if (this.canHarvest && !isNaN(this.harvestAmount * 1)) {
            // 当前播种状态还有未收割
            return 6
          } else {
            // 回复初始可播种状态
            return 1
          }
        } else {
          console.log('当前局未结束', this.roundOver)
          // if (this.maxRoundNumber === this.sowRounds) {
          if (this.myWheat.res) {
            if (this.myWheat._claimedAmount * 1 >= this.myWheat._totalAmount * 1) {
              // 已收割完
              return 1
            } else if (this.maxRoundNumber !== this.sowRounds && this.harvestAmount * 1 <= 0) {
              // 小麦不是最新局播种 切无可收割
              return 1
            } else {
              var startTimer = this.myWheat._buyTime * 1000
              var nowTimer = Date.now()
              var sevenDayTimer = this.contractConfig._matureTime * 1000
              var rate = Math.floor(((nowTimer - startTimer) / sevenDayTimer) * 100)
              if (rate >= 100) {
                if (this.canHarvest && this.harvestAmount * 1 > 0) {
                  return 6
                } else {
                  return 5
                }
              } else if (rate >= 50) {
                return 4
              } else if (rate >= 20) {
                return 3
              } else {
                return 2
              }
            }
          } else {
            // 未种植状态
            return 1
          }
          // } else {
          //   return 1
          // }
        }
      } else {
        // ***调试bug
        // return 1
        // 调试bug***
        return 0
      }
    },
    // 播种时 播种总量计算
    sowTotalNumber: function() {
      var fNumber = new BigNumber(this.formData.fNumber)
      var cNumber = new BigNumber(this.formData.cNumber)
      var uNumber = new BigNumber(this.formData.uNumber)
      return fNumber.plus(cNumber).plus(uNumber)
    },
    // 播种时 播种捐赠慈善基金量
    sowCharitableFund: function() {
      var sowTotalNumber = new BigNumber(this.sowTotalNumber)
      var charityPercent = new BigNumber(this.contractConfig._charityPercent)
      return sowTotalNumber.times(charityPercent)
    }
  },
  created() {
    // 获取邀请地址
    if (this.$route.query.share) {
      this.parentAddr = this.$route.query.share
    }
    // 赋值分享发送最小值MUT
    this.formData.sendMUT = this.contractConfig._landPrice
  },
  methods: {
    // 重置游戏数据
    resetFarmData() {
      this.maxRoundNumber = 1
      this.harvestAmount = 0
      this.hasLand = false
      this.canHarvest = false
      this.sowRounds = 0
      this.myWheat = {
        res: false,
        _buyTime: '0',
        _claimedAmount: '0',
        _queueIndex: '0',
        _roundIndex: '0',
        _soldAmount: '0',
        _ssIndex: '0',
        _totalAmount: '0'
      } // 我种植的小麦
      this.formData = {
        uNumber: 0, // 播种小麦使用的usdt
        fNumber: 0, // 播种小麦使用的奖金
        cNumber: 0 // 播种小麦使用的佣金
      }
    },
    // 农场游戏入口
    async entrance() {
      this.gameLoading = true
      // 初始化数据
      this.resetFarmData()
      // 查询是否拥有土地
      await this.getFarmHas()
      // 获取最大轮回数（当前最新局数）
      await this.getMaxRoundNumber()
      // 获取最新轮回是否结束
      await this.getRoundOver()
      // 查询个人地址未出局数据
      await this.searchMyWheat()
      this.getFarmLandPS()
      // 获取慈善基金池
      this.getCharityAmount(this.maxRoundNumber)
      // 获取奖金池
      this.getFomoPoolAmount(this.maxRoundNumber)
      // 获取最新一局自己是否中奖
      this.checkFomoRewardNewest()
      this.gameLoading = false
    },
    listenData() {
      // 获取慈善基金池
      this.getCharityAmount(this.maxRoundNumber)
      // 获取奖金池
      this.getFomoPoolAmount(this.maxRoundNumber)
    },
    // 汇集查询资产
    getUBalance() {
      this.getMUTBalance()
      this.getUSDTBalance()
      this.getProfitBalance()
      this.getFOMOBalance()
    },
    getFarmLandPS() {
      if (![0, 1, 5, 6].includes(this.farmLandStatus)) {
        var startTimer = this.myWheat._buyTime * 1000
        var nowTimer = (new Date()).getTime()
        var sevenDayTimer = this.contractConfig._matureTime * 1000
        var rate = Math.ceil((nowTimer - startTimer) / sevenDayTimer * 100)
        this.farmLandPS = rate > 100 ? 100 : rate
      } else {
        this.farmLandPS = 0
      }
    },
    // 查询MUT余额
    getMUTBalance() {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$store.dispatch('address/getMUTBalance')
    },
    // 查询USDT余额
    getUSDTBalance() {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$store.dispatch('address/getUSDTBalance')
    },
    // 查询FOMO资产
    getFOMOBalance() {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$store.dispatch('address/getFOMOBalance')
    },
    // 查询佣金资产
    getProfitBalance() {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$store.dispatch('address/getCMSSBalance')
    },
    // 查询是否拥有土地
    getFarmHas() {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$SwarmFarm.doGetFarmLand(this.address)
        .then(res => {
          console.log('擁有土地：', res)
          this.hasLand = res.data
        })
    },
    // 购买土地
    async buyFarmLand() {
      if ((!this.address || !this.connectStatus) || this.buyLandLoading) {
        return
      }
      if (this.contractConfig._landPrice * 1 > this.balance.MUT * 1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: this.$t('l.info_12')
        })
        return
      }
      this.inspectAndApprove(
        'MUT',
        'FarmLand',
        this.contractConfig._landPrice,
        this.address,
        this.$t('l.info_13'),
        'buyLandLoading',
        this.sendBuyLand)
    },
    // 请求购买土地
    sendBuyLand() {
      var notify = this.$azNotify.notify({
        type: 'info',
        title: this.$t('l.button_4'),
        message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
      })
      this.$SwarmFarm.doBuyLand(this.contractConfig._landPrice, this.address)
        .then(res => {
          console.log('購買土地：', res)
          notify.close()
          this.buyLandLoading = false
          this.hasLand = true
          this.landItem.lv = 1
          this.buyLandVisible = false
          // 重新查询MUT资产
          this.getMUTBalance()
          this.$azNotify.notify({
            type: 'success',
            duration: 10000,
            title: this.$t('l.button_4'),
            message: `<div>${this.$t('l.info_14')}</div>`
          })
        }, () => {
          this.buyLandLoading = false
          this.buyLandVisible = false
          notify.close()
          this.$azNotify.notify({
            type: 'error',
            duration: 10000,
            title: this.$t('l.button_4'),
            message: `<div>${this.$t('l.info_7')}</div>`
          })
        })
    },
    // 播种小麦
    async buyWheat() {
      // ***调试bug
      // this.inspectAndApprove(
      //   'USDT',
      //   'MUTFarmApp',
      //   this.formData.uNumber,
      //   this.address,
      //   this.$t('l.info_19'),
      //   'buyWheatLoading',
      //   this.distinguishBuyWheat)
      // 调试bug***
      if ((!this.address || !this.connectStatus) || this.buyWheatLoading) {
        return
      }
      var totalU = (this.formData.fNumber + this.formData.cNumber + this.formData.uNumber)
      if (this.formData.uNumber * 1 > this.balance.USDT * 1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: this.$t('l.info_15')
        })
        return
      } else if (this.formData.cNumber * 1 > this.balance.CMSS * 1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: this.$t('l.info_16')
        })
        return
      } else if (this.formData.fNumber * 1 > this.balance.FOMO * 1) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: this.$t('l.info_17')
        })
        return
      } else if (totalU < this.contractConfig._minAmountBuy || totalU > this.contractConfig._maxAmountBuy) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: `${this.$t('l.info_18')}${this.contractConfig._minAmountBuy}-${this.contractConfig._maxAmountBuy}`
        })
        return
      }
      this.inspectAndApprove(
        'USDT',
        'MUTFarmApp',
        this.formData.uNumber,
        this.address,
        this.$t('l.info_19'),
        'buyWheatLoading',
        this.distinguishBuyWheat)
    },
    // 区分是否拥有上级播种小麦
    distinguishBuyWheat() {
      if (this.parentAddr) {
        this.invitationSendBuyWheat()
      } else {
        this.sendBuyWheat()
      }
    },
    // 请求播种小麦
    sendBuyWheat() {
      var notify = this.$azNotify.notify({
        type: 'info',
        title: this.$t('l.info_20'),
        message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
      })
      this.$SwarmFarm.doSowSeed(this.formData.uNumber, this.formData.cNumber, this.formData.fNumber, this.address)
        .then(res => {
          console.log('購買小麥：', res)
          this.buyWheatLoading = false
          this.hasLand = true
          this.landItem.lv = 1
          this.sowDialogVisible = false
          // 重新查询game 模块数据
          this.init()
          notify.close()
          this.$azNotify.notify({
            type: 'success',
            title: this.$t('l.info_20'),
            duration: 10000,
            message: `<div>${this.$t('l.info_21')}</div>`
          })
        }, () => {
          this.buyWheatLoading = false
          this.sowDialogVisible = false
          notify.close()
          this.$azNotify.notify({
            type: 'error',
            title: this.$t('l.info_20'),
            duration: 10000,
            message: `<div>${this.$t('l.info_7')}</div>`
          })
        })
    },
    // 受邀请播种小麦
    invitationSendBuyWheat() {
      var notify = this.$azNotify.notify({
        type: 'info',
        title: this.$t('l.info_20'),
        message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
      })
      this.$SwarmFarm.doSowSeedWithParent(this.parentAddr, this.formData.uNumber, this.formData.cNumber, this.formData.fNumber, this.address)
        .then(res => {
          this.buyWheatLoading = false
          console.log('邀請購買小麥：', res)
          this.hasLand = true
          this.landItem.lv = 1
          this.sowDialogVisible = false
          // 重新查询MUT资产
          this.init()
          notify.close()
          this.$azNotify.notify({
            type: 'success',
            duration: 10000,
            title: this.$t('l.info_20'),
            message: `<div>${this.$t('l.info_21')}</div>`
          })
        }, () => {
          this.buyWheatLoading = false
          this.sowDialogVisible = false
          notify.close()
          this.$azNotify.notify({
            type: 'error',
            duration: 10000,
            title: this.$t('l.info_20'),
            message: `<div>${this.$t('l.info_7')}</div>`
          })
        })
    },
    // 查询最新一局未出局的播种数据
    async searchMyWheat() {
      var res = await this.$SwarmFarm.doGetSeedUserData(this.sowRounds, this.address)
      if (!res.data.res) {
        // 查询的轮回未找到种植记录 往回一轮回查询
        if (this.sowRounds * 1 > 1) {
          this.searchMyWheat(--this.sowRounds)
        } else {
          // 全部轮回查询完毕未能查询到种植记录
          this.myWheat = {
            res: false,
            _buyTime: '0',
            sowAmount: '0',
            _claimedAmount: '0',
            _queueIndex: '0',
            _roundIndex: '0',
            _soldAmount: '0',
            _ssIndex: '0',
            _totalAmount: '0'
          }
          this.sowRounds = this.maxRoundNumber
        }
      } else {
        // 查询到最近的一次种植记录
        var sowMoreData = await this.$SwarmFarm.doGetSeedNodeData(res.data._queueIndex)
        this.myWheat = res.data
        this.myWheat.sowAmount = sowMoreData.data.sowAmount
        console.log('可收割或待成长小麦：', this.myWheat)
        try {
          this.checkCollectable()
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 获取数据并判断最新轮回是否已经结束
    async getRoundOver() {
      await this.$SwarmFarm.doGetRoundData(this.maxRoundNumber).then(async(res) => {
        await this.$SwarmFarm.doGetSeedNodeData(res.data.lastIndex)
          .then(response => {
            var startTime = response.data.buyTime
            var nowTime = Math.floor(Date.now() / 1000)
            if (nowTime - startTime > this.contractConfig._resetCountDownTimeLength) {
              // 轮回结束
              this.$store.dispatch('game/setRoundsOver', true)
            } else {
              // 轮回正在执行
              this.$store.dispatch('game/setRoundsOver', false)
            }
          })
      })
    },
    // 查询账号是否可收割
    checkCollectable() {
      this.$SwarmFarm.doCheckCollectable(this.sowRounds, this.address)
        .then(res => {
          console.log('可收割數量：', res)
          if (res) {
            this.canHarvest = res.data.res
            this.harvestAmount = res.data.amount
            if (this.canHarvest) {
              // 有可收割小麦
              if (this.reincarnationTips[this.sowRounds]) {
                if (this.reincarnationTips[this.sowRounds].harvestTips) {
                  return
                } else {
                  this.reincarnationTips[this.sowRounds].harvestTips = true
                  this.showHaarvestTips(this.sowRounds)
                }
              } else {
                this.reincarnationTips[this.sowRounds] = {
                  harvestTips: true
                }
                this.showHaarvestTips(this.sowRounds)
              }
            }
          }
        })
    },
    // 提示小麦可收割
    showHaarvestTips(sowRounds) {
      this.$alert(this.$rpt(this.$t('l.info_34'), { round: sowRounds }), this.$t('l.lable_28'), {
        center: true,
        confirmButtonText: this.$t('l.button_5'),
        callback: action => {

        }
      })
    },
    // 收割小麦
    harvestWheat() {
      if (this.harvestLoading) {
        return
      }
      this.harvestLoading = true
      var notify = this.$azNotify.notify({
        title: this.$t('l.info_8'),
        showClose: false,
        type: 'info',
        message: `<div><i class="el-icon-loading"></i>${this.$t('l.info_5')}</div>`
      })
      this.$SwarmFarm.doClaimSeed(this.sowRounds, this.address)
        .then(res => {
          console.log('收割小麦', res)
          this.harvestLoading = false
          notify.close()
          // 关闭小麦详情弹出层
          this.wheatStatusVisible = false
          if (res.data.status) {
            this.init()
            this.$azNotify.notify({
              title: this.$t('l.info_8'),
              type: 'success',
              duration: 10000,
              message: `<div>${this.$t('l.info_9')}</div>`
            })
          } else {
            this.$azNotify.notify({
              title: this.$t('l.info_8'),
              type: 'warning',
              duration: 10000,
              message: `<div>${this.$t('l.info_10')}</div>`
            })
          }
        }, () => {
          this.harvestLoading = false
          notify.close()
          this.$azNotify.notify({
            title: this.$t('l.info_8'),
            type: 'error',
            duration: 10000,
            message: `<div>${this.$t('l.info_11')}</div>`
          })
        })
    },
    // 检查是否中奖
    checkFomoRewardNewest() {
      this.$SwarmFarm.doCheckFomoReward(this.address, this.maxRoundNumber)
        .then(res => {
          console.log('最新局个人中奖:', res)
          this.newestWinPrise = res.data
          console.log('个人中奖:', this.newestWinPrise)
        }, () => {
          this.newestWinPrise = {
            isLastIn: false,
            isMostIn: false,
            amount: 0
          }
        })
    }
  }
}
