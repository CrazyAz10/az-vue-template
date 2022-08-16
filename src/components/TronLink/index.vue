<template>
  <div>
    <div
      v-if="!address"
      class="farm-header-navbar-right-user"
      @click="showLoignDialog"
    >
      连接钱包
    </div>
    <div v-else class="farm-header-navbar-right-user">
      <el-dropdown @command="handleCommand">
        <div class="el-dropdown-link ">
          <i class="el-icon-folder" />
          <span class="farm-header-navbar-right-user-info">
            {{ address }} <i class="el-icon-arrow-down el-icon--right" />
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="mutId">你的MUT</el-dropdown-item>
          <el-dropdown-item command="wheatId">你的小麦</el-dropdown-item>
          <el-dropdown-item command="fomoId">你的FOMO奖金</el-dropdown-item>
          <el-dropdown-item command="commissionId">你的推广佣金</el-dropdown-item>
          <el-dropdown-item command="nftId">你的土地NFT</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <theme-dialog
      :visible.sync="loignDialogVisible"
      :width="'435px'"
      :destroy-on-close="true"
    >

      <div v-if="!isConnectWallet" class="center">
        <div class="logo">
          互助农场
        </div>
        <div class="wallet-list" @click="handleConnectWallet">
          <div class="wallet-item">
            <svg-icon class-name="Tronlink-icon" icon-class="Tronlink" />
            <span>TronLink 钱包</span>
          </div>
        </div>
        <div class="tronlink-tips">
          <span>还没安装 TronLink？ </span><a
            href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec"
          >请点击此处&gt;&gt;</a>
        </div>
        <div class="tronlink-tips mt10">
          <span>连接则代表您已接受 </span><a
            href="https://www.sunswap.com/docs/SunSwap_Terms_of_Use_cn.pdf"
            target="walletService"
          >服务条款</a>&nbsp;<a
            href="https://www.sunswap.com/docs/SunSwap_Privacy_Policy_cn.pdf"
            target="walletPrivacy"
          >隐私协议</a>
        </div>
      </div>
      <div v-else class="">
        <div class="back-icon pointer" @click="handleBack">
          <svg-icon class-name="back-icon" icon-class="back" />
        </div>
        <div class="step2-wallet">
          <svg-icon class-name="Tronlink-icon" icon-class="Tronlink" /><span>TronLink 钱包</span>
        </div>
        <div v-loading="loading" class="loading" />
        <div class="init-text">正在初始化...</div>
        <div class="login-tip-text">
          <span>请登录
            <a
              href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec"
            >TronLink 钱包 </a>进行连接</span>
        </div>
      </div>
    </theme-dialog>
  </div>
</template>

<script>
import themeDialog from '@/views/home/components/themeDialog'
import { cutMiddle } from '@/utils/helper'
export default {
  components: {
    themeDialog
  },
  data() {
    return {
      loignDialogVisible: false,
      isConnectWallet: false,
      loading: true,
      timeId: null
    }
  },
  computed: {
    address: function() {
      return this.$store.getters.address ? cutMiddle(this.$store.getters.address, 4, 4) : ''
    }
  },
  mounted() {
    if (window.tronLink) {
      console.log(window.tronLink, window.tronWeb)
      this.checkTronLinkConnect()
    }
    window.addEventListener('message', (e) => this.handleTronLinkMessage(e))
  },
  created() {
    this.timeId = setInterval(() => {
      this.checkTronLinkConnect()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timeId)
  },
  methods: {
    handleCommand(command) {
      this.$router.push({
        path: `/user`,
        query: {
          type: command
        }
      })
    },
    checkTronLinkConnect() {
      if (window.tronLink) {
        if (window.tronLink && window.tronLink.ready && window.tronLink.tronWeb) {
          this.handleSetAddress(window.tronLink.tronWeb.defaultAddress.base58)
        } else {
          this.handleSetAddress('')
        }
      }
      // console.log(window.tronLink, window.tronWeb)
    },
    handleTronLinkMessage(e) {
      const message = e.data.message
      if (message) {
        if (message.action === 'rejectWeb') {
          this.loignDialogVisible = true
          this.isConnectWallet = false
          this.checkTronLinkConnect()
        }
        if (message.action === 'acceptWeb') {
          this.loignDialogVisible = false
          this.isConnectWallet = false
          this.checkTronLinkConnect()
        }
        if (message.action === 'disconnect') {
          this.loignDialogVisible = false
          this.isConnectWallet = false
          this.checkTronLinkConnect()
        }
        if (message.action === 'accountsChanged') {
          this.checkTronLinkConnect()
        }
      }
    },
    showLoignDialog() {
      this.loignDialogVisible = !this.loignDialogVisible
    },
    handleConnectWallet() {
      this.isConnectWallet = !this.isConnectWallet
      this.connectWallet()
    },
    handleBack() {
      this.isConnectWallet = !this.isConnectWallet
    },
    handleSetAddress(address) {
      this.$store.dispatch('address/setAddress', address)
    },
    async connectWallet() {
      // 建议接收方法
      if (window.tronLink) {
        const res = await window.tronLink.request({ method: 'tron_requestAccounts' })
        if (res.code === 200) {
          this.loignDialogVisible = false
          this.isConnectWallet = false
          // this.getTronweb(
        }
      } else {
        this.$message({
          message: '请先安装TronLink并启用TronLink',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-dropdown{
  color: #000;
}
.farm-header-navbar-right-user {
  line-height: 70px;
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
</style>
