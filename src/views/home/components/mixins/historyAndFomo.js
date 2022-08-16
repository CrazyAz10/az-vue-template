export default {
  data() {
    return {
      currentNumber: 1, // 当前访问轮回
      maxRoundNumber: 0, // 最大轮回数
      firstIndex: 1, // 轮回第一个参与编号
      currentIndex: 1, // 当前队列头编号
      lastIndex: 1, // 轮回最后一个参与编号
      backLog: false, // 轮回是否存在
      roundPercent: 0, // 轮回24小时积压值比
      leve: [this.$t('l.lable_22'), this.$t('l.lable_23'), this.$t('l.lable_24'), this.$t('l.lable_25')],
      stack: [], // 记录栈全部队列
      enterList: {}, // 播种队列
      outList: {}, // 收获队列
      bonusRoundPool: 0, // 当前轮回奖金池
      myHistoryWheat: {
        res: false,
        _buyTime: '0',
        _claimedAmount: '0',
        _queueIndex: '0',
        _roundIndex: '0',
        _soldAmount: '0',
        _ssIndex: '0',
        _totalAmount: '0'
      }, // 当前轮回的个人播种记录
      lastParticipant: {
        account: '',
        amount: '',
        res: true
      }, // 最后一名奖
      majorShareholders: {
        account: '',
        amount: '',
        res: true
      }, // 最大出资奖
      myWinPrise: {
        isLastIn: false,
        isMostIn: false,
        amount: 0
      }, // 当前局我的中奖金额
      nowBureauOver: false, // 当前查询局是否结束
      currentLoading: false,
      winPrizeLoading: false,
      timer: null, // 计时器
      surplusTime: 0 // 剩余倒计时
    }
  },
  computed: {
    // 判断是否中奖
    isWinPrize: function() {
      if (this.winList.length) {
        return this.winList.some(val => {
          return val.address === this.address
        })
      } else {
        return false
      }
    },
    // 轮回积压等级样式
    leveClass: function() {
      var className = {
        leve0: this.roundPercent * 1 <= 10,
        leve1: this.roundPercent * 1 > 10 && this.roundPercent * 1 <= 30,
        leve2: this.roundPercent * 1 > 30 && this.roundPercent * 1 <= 80,
        leve3: this.roundPercent * 1 > 80
      }
      return className
    },
    // 轮回距离结束倒计时文案显示
    showSurplusTime: function() {
      var text = ''
      if (this.surplusTime > 0) {
        var h = Math.floor(this.surplusTime / (60 * 60))
        var m = Math.floor(this.surplusTime % (60 * 60) / 60)
        var s = Math.floor(this.surplusTime % (60 * 60) % 60)
        text = h + 'h ' + m + 'm' + s + 's'
      } else {
        text = ''
      }
      return text
    },
    // 轮回积压等级数
    securityLeve: function() {
      var lv = 0
      if (this.roundPercent * 1 <= 10) {
        lv = 0
      } else if (this.roundPercent * 1 <= 30) {
        lv = 1
      } else if (this.roundPercent * 1 <= 80) {
        lv = 2
      } else {
        lv = 3
      }
      return lv
    },
    // 个人收割队列
    myOutWheat: function() {
      if (this.outList['NO' + this.currentNumber] && this.outList['NO' + this.currentNumber].length) {
        var arr = this.outList['NO' + this.currentNumber].find(item => {
          return item.account === this.address
        })
        return arr || {}
      }
      return {}
    }
  },
  created() {},
  methods: {
    // 上一期
    prePage() {
      this.currentLoading = true
      if (this.currentNumber - 1 >= 1) {
        this.currentNumber -= 1
        this.getHistoryList()
        this.currentLoading = false
      } else {
        this.currentLoading = false
        return
      }
    },
    // 下一期
    nextPage() {
      this.currentLoading = true
      if (this.currentNumber + 1 <= this.maxRoundNumber) {
        this.currentNumber += 1
        this.getHistoryList()
        this.currentLoading = false
      } else {
        this.currentLoading = false
        return
      }
    },
    // 重置数据
    resetHistoryAndFomoDate() {
      // this.enterList = [] // 播种队列
      // this.outList = [] // 收获队列
      this.lastParticipant = {
        account: '',
        amount: '',
        res: true
      } // 最后一名奖
      this.majorShareholders = {
        account: '',
        amount: '',
        res: true
      } // 最大出资奖
      this.myWinPrise = {
        isLastIn: false,
        isMostIn: false,
        amount: 0
      }
      clearTimeout(this.timer)
      this.surplusTime = 0
    },
    // 入口
    async entranceHistory() {
      // 获取最大轮回数（当前最新局数）
      await this.getMaxRoundNumber()
      this.getHistoryList()
    },
    // 分页
    async getHistoryList() {
      // 初始化数据
      this.resetHistoryAndFomoDate()
      if (this.maxRoundNumber * 1 > 0) {
        // 获取某轮回队列数据
        await this.getRoundData(this.currentNumber)
        // 获取历史播种队列数据
        await this.recursionGetItemData()
        // 获取个人未出局的数据
        this.getSeedUserData(this.currentNumber)
        // // 获取轮回积压值
        // this.getBacklog()
        // 开启倒计时
        this.getOverDownTime()
        // 查询指定轮回奖金池
        this.getRoundFomoPoolAmount(this.currentNumber)
      }
    },
    // 获取播种节点数据
    async getEnterList(startIndex, enterIndex, currentNumber) {
      var ky = 'NO' + currentNumber
      if (!this.enterList[ky] || !this.enterList[ky].some(item => { return item.index === startIndex })) {
        this.$SwarmFarm.doGetSeedNodeData(startIndex)
          .then(res => {
            var item = {
              index: startIndex,
              ...res.data
            }
            this.enterList[ky] ? this.enterList[ky].push(item) : this.$set(this.enterList, ky, [item])
            if ((startIndex + 1) <= enterIndex) {
              this.getEnterList(++startIndex, enterIndex, currentNumber)
            } else {
              // 查询完毕重新排序队列
              this.enterList[ky] && this.enterList[ky].sort((a, b) => {
                return a.index - b.index
              })
              console.log(`第${currentNumber}局播种队列`, this.enterList)
            }
          })
      } else {
        if ((startIndex + 1) <= enterIndex) {
          this.getEnterList(++startIndex, enterIndex, currentNumber)
        } else {
          // 查询完毕重新排序队列
          this.enterList[ky] && this.enterList[ky].sort((a, b) => {
            return a.index - b.index
          })
          console.log(`第${currentNumber}局播种队列`, this.enterList)
        }
      }
    },
    // 获取收割节点数据
    async getOutList(startIndex, enterIndex, currentNumber) {
      var ky = 'NO' + currentNumber
      if (!this.outList[ky] || !this.outList[ky].some(item => { return item.index === enterIndex })) {
        this.$SwarmFarm.doGetSeedNodeData(enterIndex)
          .then(async(res) => {
            var item = {
              index: enterIndex,
              ...res.data
            }
            this.outList[ky] ? this.outList[ky].push(item) : await this.$set(this.outList, ky, [item])
            if (enterIndex - 1 >= startIndex) {
              this.getOutList(startIndex, --enterIndex, currentNumber)
            } else {
              // 查询完毕重新排序队列
              this.outList[ky] && this.outList[ky].sort((a, b) => {
                return b.index - a.index
              })
              console.log(`第${currentNumber}局收割队列`, this.outList)
            }
          })
      } else {
        if (enterIndex - 1 >= startIndex) {
          this.getOutList(startIndex, --enterIndex, currentNumber)
        } else {
          // 查询完毕重新排序队列
          this.outList[ky] && this.outList[ky].sort((a, b) => {
            return b.index - a.index
          })
          console.log(`第${currentNumber}局收割队列`, this.outList)
        }
      }
    },
    // 递归编号 获取每一条详情数据
    recursionGetItemData() {
      if (this.firstIndex === this.lastIndex || this.firstIndex === this.currentIndex) {
        this.getEnterList(this.currentIndex, this.lastIndex, this.currentNumber)
      } else {
        this.getEnterList(this.currentIndex, this.lastIndex, this.currentNumber)
        this.getOutList(this.firstIndex, this.currentIndex - 1, this.currentNumber)
      }
    },
    // 获取某轮回队列数据
    async getRoundData(roundNumber) {
      if (!this.address || !this.connectStatus) {
        return
      }
      await this.$SwarmFarm.doGetRoundData(roundNumber).then((res) => {
        console.log('轮回队列：', res)
        this.currentIndex = res.data.currentIndex * 1
        this.lastIndex = res.data.lastIndex * 1
        this.firstIndex = res.data.firstIndex * 1
      })
    },
    // 查询未出局的播种数据
    getSeedUserData(findIndex) {
      if (!this.address || !this.connectStatus) {
        return
      }
      this.$SwarmFarm.doGetSeedUserData(findIndex, this.address)
        .then(res => {
          console.log('非最新轮回值-未出局的播种数据：', res)
          if (!res.data.res) {
            // 查询的轮回未找到种植记录 往回一轮回查询
            this.myHistoryWheat = {
              res: false,
              _buyTime: '0',
              _claimedAmount: '0',
              _queueIndex: '0',
              _roundIndex: '0',
              _soldAmount: '0',
              _ssIndex: '0',
              _totalAmount: '0'
            }
          } else {
            // 查询到最近的一次种植记录
            this.myHistoryWheat = res.data
          }
        })
    },
    // 计算轮回结束倒计时
    async getOverDownTime() {
      await this.$SwarmFarm.doGetSeedNodeData(this.lastIndex)
        .then(async(response) => {
          var startTime = response.data.buyTime
          var nowTime = Math.floor(Date.now() / 1000)
          if (nowTime - startTime > this.contractConfig._resetCountDownTimeLength) {
            this.nowBureauOver = true
            // 获取个人是否中奖
            await this.checkFomoReward()
            // 获取最大出资者
            await this.getMostInRewardAddress(this.currentNumber)
            // 获取最后一名播种者
            await this.getLastInRewardAddress(this.currentNumber)
            if (this.currentNumber === this.maxRoundNumber) {
              this.winPrizeLoading = true
              // 递归重新查询中奖名单，避免时间差异导致获取不到中奖名单
              if (!this.majorShareholders.res) {
                if (this.surplusTime) {
                  // 如果倒计时重新刷新则不再查询
                  this.winPrizeLoading = false
                } else {
                  setTimeout(() => {
                    this.getOverDownTime()
                  }, 1000)
                }
              } else {
                this.winPrizeLoading = false
                this.$store.dispatch('game/setRoundsOver', true)
                // 游戏结束提示
                if (!this.reincarnationTips[this.maxRoundNumber] || !this.reincarnationTips[this.maxRoundNumber].gameOverTips) {
                  if (!this.reincarnationTips[this.maxRoundNumber]) {
                    this.reincarnationTips[this.maxRoundNumber] = {
                      gameOverTips: true
                    }
                  } else {
                    this.reincarnationTips[this.maxRoundNumber].gameOverTips = true
                  }
                  if (this.sowRounds === this.maxRoundNumber) {
                    if (this.myWheat.res) {
                      if (this.myWheat._soldAmount * 1 !== this.myWheat._totalAmount * 1) {
                        this.$alert(this.$t('l.info_35'), this.$t('l.lable_28'), {
                          center: true,
                          confirmButtonText: this.$t('l.button_5'),
                          callback: action => {

                          }
                        })
                      }
                    }
                  }
                }
                // 游戏结束中奖提示
                if (!this.reincarnationTips[this.maxRoundNumber] || !this.reincarnationTips[this.maxRoundNumber].winPrizeTips) {
                  if (!this.reincarnationTips[this.maxRoundNumber]) {
                    this.reincarnationTips[this.maxRoundNumber] = {
                      winPrizeTips: true
                    }
                  } else {
                    this.reincarnationTips[this.maxRoundNumber].winPrizeTips = true
                  }
                  if (this.myWinPrise.isLastIn || this.myWinPrise.isMostIn) {
                    this.$alert(this.$t('l.info_36'), this.$t('l.lable_28'), {
                      center: true,
                      confirmButtonText: this.$t('l.button_5'),
                      callback: action => {

                      }
                    })
                  }
                }
              }
            }
          } else {
            this.nowBureauOver = false
            this.winPrizeLoading = false
            if (this.currentNumber === this.maxRoundNumber) {
              this.$store.dispatch('game/setRoundsOver', false)
            }
            this.surplusTime = this.contractConfig._resetCountDownTimeLength - (nowTime - startTime)
            clearTimeout(this.timer)
            this.downTimeAction()
          }
        })
    },
    // 开始倒计时
    downTimeAction() {
      if (isNaN(this.surplusTime)) {
        return
      }
      this.timer = setTimeout(() => {
        if (this.surplusTime > 0) {
          this.surplusTime--
          this.downTimeAction()
        } else {
          clearTimeout(this.timer)
          this.init()
        }
      }, 1000)
    },
    // 获取最后一个播种中奖名单
    async getLastInRewardAddress(currentNumber) {
      await this.$SwarmFarm.doGetLastInRewardAddress(currentNumber)
        .then(res => {
          console.log('最后一个播种', res)
          this.lastParticipant = res.data
        }, () => {
          this.lastParticipant = {}
        })
    },
    // 获取出资最大的中奖名单
    async getMostInRewardAddress(currentNumber) {
      await this.$SwarmFarm.doGetMostInRewardAddress(currentNumber)
        .then(res => {
          console.log('出资最大', res)
          this.majorShareholders = res.data
        }, () => {
          this.majorShareholders = {}
        })
    },
    // 切换轮回查询奖金池
    async getRoundFomoPoolAmount(round) {
      await this.$SwarmFarm.doGetFomoPoolAmount(round)
        .then(res => {
          console.log('奖金池:', res)
          this.bonusRoundPool = res.data
        })
    },
    // 检查是否中奖
    async checkFomoReward() {
      await this.$SwarmFarm.doCheckFomoReward(this.address, this.currentNumber)
        .then(res => {
          console.log('个人中奖:', res)
          this.myWinPrise = res.data
        }, () => {
          this.myWinPrise = {
            isLastIn: false,
            isMostIn: false,
            amount: 0
          }
        })
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
