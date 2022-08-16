<template>
  <div>
    <div
      v-if="!connectStatus"
      class="farm-header-navbar-right-user"
      @click="connect"
    >
      <img src="@/assets/img/wallet.png" alt="">  {{ $t('l.home_top_title_7') }}
    </div>
    <div v-else class="farm-header-navbar-right-user">
      <el-dropdown trigger="click" class="user-dropdown" @command="handleCommand">
        <div class="el-dropdown-link ">
          <img src="@/assets/img/wallet.png" alt="">
          <span class="farm-header-navbar-right-user-info">
            {{ address }} <i class="el-icon-arrow-down el-icon--right" />
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="mutId">{{ $t('l.home_top_wallet_1') }}</el-dropdown-item>
          <el-dropdown-item command="wheatId">{{ $t('l.home_top_wallet_2') }}</el-dropdown-item>
          <el-dropdown-item command="fomoId">{{ $t('l.home_top_wallet_3') }}</el-dropdown-item>
          <el-dropdown-item command="commissionId">{{ $t('l.home_top_wallet_4') }}</el-dropdown-item>
          <el-dropdown-item command="disConnect" divided>
            <div class="logout">
              <span>{{ $t('l.home_top_wallet_6') }}</span>
              <img src="@/assets/img/exit.png" alt="" class="exit">
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { cutMiddle } from '@/utils/helper'
export default {
  name: 'WalletConnectContainer',
  data() {
    return {
      loignDialogVisible: false,
      isConnectWallet: false,
      loading: true,
      timeId: null,
      connector: null
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.address ? cutMiddle(this.$store.getters.address, 4, 4) : ''
    },
    connectStatus: function() {
      return this.$store.getters.connectStatus
    },
    device() {
      return this.$store.getters.device
    }
  },
  mounted() {

  },
  created() {
    if (!this.$store.getters.connectStatus && this.$store.getters.address) {
      this.connect()
    }
  },
  destroyed() {

  },
  methods: {
    async connect() {
      await this.$store.dispatch('address/connectWallet')
    },
    async handleCommand(command) {
      if (command === 'disConnect') {
        console.log('command', command)
        await this.$store.dispatch('address/disConnectWallet')
      } else {
        this.$router.push({
          path: `/user`,
          query: {
            type: command,
            time: Date.parse(new Date())
          }
        })

        // this.$router.push({
        //   name: 'user',
        //   params: {
        //     type: command,
        //     time: Date.parse(new Date())
        //   }
        // })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
>>> .el-dropdown{
  color: #000;
}
>>> .el-dropdown-menu{
  border-radius: 32px !important;
}
>>> .el-dropdown-menu.el-popper.el-dropdown-menu--medium{

  border-radius: 32px !important;
}
>>> .el-dropdown-menu__item{
  font-size: 16px;
font-family: Microsoft YaHei;
font-weight: 400;
color: #666666;
line-height: 40px;
padding: 0 30px;
}
>>> .el-dropdown-menu__item--divided:before{
  margin: 0 -30px !important;
}

>>> .el-dropdown-menu__item:hover{
  color: #6f65ee ;

background: #F7F6FE;
}
.logout{
      display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
  span{
font-size: 16px;
font-family: Microsoft YaHei;
font-weight: 400;
color: #666666;
line-height: 40px;
  }
  .exit{
  vertical-align: middle;

}
}

.farm-header-navbar-right-user {
  line-height: 80px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
 color: #444;
 cursor: pointer;
 margin-right: 40px;
  &:hover{
 color: #DD9231;
  }
  img{
    height: 33px;
    vertical-align: middle;
  }
}
.Tronlink-icon {
  font-size: 32px;
}
.center {
  text-align: center;
}
.wallet-list {
  text-align: center;
  margin-top: 40px;
}
.wallet-item {
  display: flex;
  justify-content: space-between;
  width: 95%;
  align-items: center;
  margin: 0 auto;
  box-shadow: 0 10px 40px 0 rgb(21 55 156 / 6%);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  .tronlink-logo {
    width: 40px;
  }
  & > span:last-child {
    font-family: AvenirNext-Medium;
    font-size: 20px;
    color: #333;
  }
}
.tronlink-tips {
  padding-left: 20px;
  margin-top: 80px;
  text-align: left;
  font-family: AvenirNext-Medium;
  color: #999;
}
.mt10 {
  margin-top: 10px !important;
}
.step2-wallet {
  margin-top: 60px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > span:last-child {
    font-family: AvenirNext-DemiBold;
    display: inline-block;
    font-size: 20px;
    color: #333;
    margin-left: 10px;
  }
}
.back-icon {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 50px;
  text-align: left;
}
.pointer {
  cursor: pointer;
}
.init-text {
  font-family: AvenirNext-DemiBold;
  font-size: 16px;
  color: #333;
  margin: 30px 0;
  text-align: center;
}
.login-tip-text {
  font-family: AvenirNext-Medium;
  color: #999;
  line-height: 19px;
  text-align: center;
}
.loading{
  width: 100%;
  height: 45px;
}

.mobile{
  .farm-header-navbar-right-user img{
    height: 40px;
  }
  .farm-header-navbar-right-user-info{
    font-size: 20px;
    vertical-align: middle;
  }
}
</style>
