<template>
  <div
    class="risk-tips-wrap"
    @mouseover="mouseOver"
    @mouseleave="mouseLeave"
  >
    <div
      class="risk-tips"
    >
      <i class="el-icon-warning-outline" />
      <span>{{ $t('l.info_37') }}</span>
    </div>
    <transition name="fade-transform" mode="out-in">
      <div v-if="riskTipsPop" class="risk-tips-text">
        <div class="risk-tips-pop">
          <p>{{ $t('l.home_game_text71') }}</p>
          <el-link type="primary" @click="$router.push({path: '/helpPage', query: { id: 24 } })">{{ $t('l.lable_29') }}<i class="el-icon-d-arrow-right el-icon--right" /> </el-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      riskTipsPop: false
    }
  },
  methods: {
    mouseOver() {
      this.riskTipsPop = true
    },
    mouseLeave() {
      this.riskTipsPop = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .risk-tips-wrap{
    position: relative;
    .risk-tips{
      background: #FEEBEC;
      color: #DD6767;
      padding: 5px 14px;
      font-size: 14px;
      height: 30px;
      border-radius: 15px;
      user-select: none;
      cursor: pointer;
      i{
        font-size: 20px;
        vertical-align: middle;
      }
    }
    .risk-tips-text{
      position: absolute;
      left: 0;
      top: 30px;
      right: 0;
      padding: 10px 0;
      width: 550px;
      z-index: 10;
      .risk-tips-pop{
        background-color: #696969;
        color: #fff;
        padding: 20px 40px;
        border-radius: 30px;
        p{
          line-height: 26px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
