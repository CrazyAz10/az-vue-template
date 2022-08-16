'use strict'

import Web3 from 'web3'
const evmChains = require('evm-chains')
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Message } from 'element-ui'
// import { openApp } from './utils/index.js'
const getRevertReason = require('eth-revert-reason')

var metaMaskDapp = 'https://metamask.app.link/dapp/' + window.location.host
var browser = {
  versions: (function() {
    var u = navigator.userAgent
    return {
      trident: u.indexOf('Trident') > -1,
      presto: u.indexOf('Presto') > -1,
      webKit: u.indexOf('AppleWebKit') > -1,
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
      mobile: !!u.match(/AppleWebKit.*Mobile.*/),
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      iPhone: u.indexOf('iPhone') > -1,
      iPad: u.indexOf('iPad') > -1,
      webApp: u.indexOf('Safari') === -1,
      souyue: u.indexOf('souyue') > -1,
      superapp: u.indexOf('superapp') > -1,
      weixin: u.toLowerCase().indexOf('micromessenger') > -1,
      Safari: u.indexOf('Safari') > -1
    }
  }()),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

var ResCode = {
  CONNECT_WALLET_SUCCESS: 1001,
  CONNECT_WALLET_FAILED: 1002,
  DISCONNECT_WALLET_SUCCESS: 1003,
  ACCOUNT_CHANGED: 1004,
  CHAIN_CHANGED: 1005,
  ADD_CHAIN: 1015,
  NETWORK_CHANGED: 1006,
  ACCOUNT_INFO: 1007,
  CHAIN_SELECTED: 1008,
  TOKEN_INFO: 1009,
  CHECK_APPROVE: 1011,
  APPROVE_AMOUNT: 1012,
  BUY_TICKET: 1013,
  RESULT_ERROR: 1014,
  SUCCESS: 0,
  ERROR: -1
}

class SwarmFarm {
  constructor() {
    this.callBack = (res) => { console.log(res) }
    this.ABI = {
      FarmLand: this.getABI('./ABI/FarmLand.abi'),
      History: this.getABI('./ABI/History.abi'),
      MUT: this.getABI('./ABI/MUT.abi'),
      MUTFarmApp: this.getABI('./ABI/MUTFarmApp.abi'),
      MUTFarmAppData: this.getABI('./ABI/MUTFarmAppData.abi'),
      Relationship: this.getABI('./ABI/Relationship.abi'),
      RelationshipData: this.getABI('./ABI/RelationshipData.abi'),
      SystemAuth: this.getABI('./ABI/SystemAuth.abi'),
      SystemSetting: this.getABI('./ABI/SystemSetting.abi'),
      USDT: this.getABI('./ABI/USDT.abi')
    }
    this.contractAddr = {
      FarmLand: this.getABI('./ABI/FarmLand.addr'),
      History: this.getABI('./ABI/History.addr'),
      MUT: this.getABI('./ABI/MUT.addr'),
      MUTFarmApp: this.getABI('./ABI/MUTFarmApp.addr'),
      MUTFarmAppData: this.getABI('./ABI/MUTFarmAppData.addr'),
      Relationship: this.getABI('./ABI/Relationship.addr'),
      RelationshipData: this.getABI('./ABI/RelationshipData.addr'),
      SystemAuth: this.getABI('./ABI/SystemAuth.addr'),
      SystemSetting: this.getABI('./ABI/SystemSetting.addr'),
      USDT: this.getABI('./ABI/USDT.addr')
    }
    this.evmChains = evmChains
    this.web3Modal = window.web3Modal
    this.provider = window.provider
    this.web3 = null
    this.connectedAddress = ''
    this.connectedChainName = ''
  }

  getABI(name) {
    var json = ''
    var xhr = new XMLHttpRequest()
    xhr.open('get', name, false)
    xhr.send()
    try {
      json = JSON.parse(xhr.responseText)
    } catch (error) {
      json = xhr.responseText
    }
    return json
  }

  setBallBack(cb) {
    this.callBack = cb
  }

  // 链接钱包
  async doConnectWallet() {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.VUE_APP_INFURAID
          }
        }
      }
      this.web3Modal = await new Web3Modal({
        cacheProvider: true,
        // connectTo: process.env.VUE_APP_CHAINID,
        providerOptions,
        disableInjectedProvider: false
      })
      window.web3Modal = this.web3Modal
      // 切换指定链
      await this.doSwitchChain(process.env.VUE_APP_CHAINID, process.env.VUE_APP_RPCURL, process.env.VUE_APP_CHAINNAME, process.env.VUE_APP_SYMBOL, process.env.VUE_APP_BLOCKBROWSER)
      if (window.web3Modal.cachedProvider) {
        this.provider = await this.web3Modal.connect()
      } else {
        this.provider = await this.web3Modal.connect()
      }
      window.provider = this.provider
      this.web3 = new Web3(this.provider)
      window.web3 = this.web3
      this.provider.on('accountsChanged', async(accounts) => {
        this.callBack({ code: ResCode.ACCOUNT_CHANGED, msg: 'account changed', accounts })
      })

      this.provider.on('chainChanged', (chainId0x) => {
        var chainId = parseInt(chainId0x)
        const chainData = this.evmChains.getChain(chainId)
        this.connectedChainName = chainData.name
        this.callBack({ code: ResCode.CHAIN_CHANGED, msg: 'chain changed', chainId: chainId, chainName: this.connectedChainName })
      })

      this.provider.on('networkChanged', (networkId) => {
        this.callBack({ code: ResCode.NETWORK_CHANGED, msg: 'network changed', networkId: networkId })
      })

      this.provider.on('disconnect', (res) => {
        this.callBack({ code: ResCode.DISCONNECT_WALLET_SUCCESS, msg: 'disconnect wallet', data: res })
      })

      this.provider.on('connect', (res) => {
        this.callBack({ code: ResCode.CONNECT_WALLET_SUCCESS, msg: 'connect wallet', data: res })
      })

      // this.callBack({ code: ResCode.CONNECT_WALLET_SUCCESS, msg: 'connect wallet success', address: this.connectedAddress, chainName: this.connectedChainName })
      await this.doGetAccountInfo()
    } catch (e) {
      this.callBack({ code: ResCode.CONNECT_WALLET_FAILED, msg: 'connect wallet failed' })
      return
    }
  }

  // 断开钱包
  async doDisconnectWallet() {
    // console.log(this.provider, window.provider)
    return new Promise(async(resolve, reject) => {
      if (this.provider || window.provider) {
        if (this.provider.close) {
          await this.provider.close()
        } else {
          window.provider = null
        }

        await this.web3Modal.clearCachedProvider()
        this.provider = null
        window.provider = null
        window.web3Modal = null
        console.log('断开连接')
        resolve()
      } else {
        reject()
      }
    })
  }

  // 切换链
  async doSwitchChain(chainId, rpcUrl, chainName, symbol, explorerUrl) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      if (window.ethereum) {
        try {
          // check if the chain to connect to is installed
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.numberToHex(chainId) }] // chainId must be in hexadecimal numbers
          })
          resolve({ code: ResCode.CHAIN_SELECTED, msg: 'chain selected', chainId: chainId, chainName: chainName, symbol: symbol })
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902 || error.code === -32603) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: web3.utils.numberToHex(chainId),
                    rpcUrls: [rpcUrl],
                    chainName: chainName,
                    nativeCurrency: {
                      symbol: symbol,
                      decimals: 18
                    },
                    blockExplorerUrls: [explorerUrl]
                  }
                ]
              })
              resolve({ code: ResCode.ADD_CHAIN, msg: 'add chain', chainId: chainId, chainName: chainName, symbol: symbol })
            } catch (addError) {
              Message({
                type: 'error',
                message: 'connect wallet error!'
              })
              console.error(addError)
            }
          }
          console.error(error)
        }
      } else {
        // if no window.ethereum then MetaMask is not installed
        // alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html')
        if (browser.versions.ios || browser.versions.android) {
          window.location.href = metaMaskDapp
          setTimeout(function() {
            window.location.href = metaMaskDapp
          }, 2000)
        }
      }
    })
  }

  /**
   * 验证钱包地址
   * @param {String} address
   * @returns
   */
  checkAddressChecksum(address) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var address_ = await web3.utils.toChecksumAddress(address)
      console.log(address)
      var res = await web3.utils.checkAddressChecksum(address_)
      resolve(res)
    })
  }

  async isAddress(address) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var res = web3.utils.isAddress(address)
      resolve(res)
    })
  }

  /**
     * 授权
     * @param {*} modle // 授权合约ABI 和address 所属模块
     * @param {*} toModle // 授权使用的代币合约模块
     * @param {*} amount // 授权金额
     * @param {*} sender // 授权人地址
     * @returns
     */
  doApproveAmount(modle, toModle, amount, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI[modle], this.contractAddr[modle], {})
      var weiAmount = await web3.utils.toWei(amount.toString(), 'ether')

      contract.methods.approve(this.contractAddr[toModle], weiAmount)
        .send({ from: sender })
        .then(result => {
          resolve({ code: 1, msg: 'success', data: result })
        })
        .catch(error => {
          reject({ code: -1, msg: 'error', error })
        })
    })
  }

  /**
     * 检查授权
     * @param {*} modle // 授权合约ABI 和address 所属模块
     * @param {*} toModle // 授权使用的代币合约模块
     * @param {*} amount // 授权金额
     * @param {*} sender // 授权人地址
     * @returns
     */
  doCheckAllowance(modle, toModle, amount, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI[modle], this.contractAddr[modle], {})
      contract.methods.allowance(sender, this.contractAddr[toModle])
        .call()
        .then(function(result) {
          var approvedAmount = web3.utils.fromWei(result.toString(), 'ether')
          var approved = false
          if (amount <= approvedAmount) {
            approved = true
          }
          resolve({ code: ResCode.CHECK_APPROVE, msg: 'check approve', data: approved })
        })
        .catch(function(error) {
          reject({ code: -1, msg: 'error', error })
          reject({ code: ResCode.RESULT_ERROR, msg: 'check approve error' })
        })
    })
  }

  // 获取账户信息
  async doGetAccountInfo() {
    const web3 = new Web3(this.provider)
    const chainId = await web3.eth.getChainId()
    const chainData = this.evmChains.getChain(chainId)
    var chainName = chainData.name
    var symbol = chainData.chain
    const accounts = await web3.eth.getAccounts()
    const rowResolvers = accounts.map(async(address) => {
      const balance = await this.getCoinBalance(address)
      this.connectedChainName = chainName
      this.connectedAddress = address
      console.log(address)
      console.log(chainName)
      this.callBack({ code: ResCode.ACCOUNT_INFO, msg: 'account info', address: address, balance: balance, chainName: chainName, symbol: symbol })
      return
    })

    await Promise.all(rowResolvers)
  }

  // 获取钱包资产
  async getCoinBalance(address) {
    const web3 = new Web3(this.provider)
    const balance = await web3.eth.getBalance(address)
    const ethBalance = await web3.utils.fromWei(balance, 'ether')
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4)
    return humanFriendlyBalance
  }

  // 查询USDT合约资产
  async doGetTokenBalance(accountAddress, modle = 'USDT') {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI[modle], this.contractAddr[modle], {})

      await contract.methods.balanceOf(accountAddress)
        .call()
        .then((result) => {
          var resultTemp = web3.utils.fromWei(result, 'ether')
          resultTemp = parseFloat(resultTemp).toFixed(4)
          resolve({ code: 0, msg: 'token balance', data: resultTemp })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 查询是否拥有土地
       * @param {*} accountAddress 待查询的账号地址
       * @returns
       */
  doGetFarmLand(accountAddress) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['FarmLand'], this.contractAddr['FarmLand'], {})
      await contract.methods.haveLand(accountAddress)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 购买土地
       * @param {*} amount MUT数额，默认值不得小于100个MTU
       * @returns
       */
  doBuyLand(amount, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['FarmLand'], this.contractAddr['FarmLand'], {})
      var weiAmount = await web3.utils.toWei(amount.toString(), 'ether')
      await contract.methods.buyLand(weiAmount)
        .send({
          from: sender
        })
        .then((result) => {
          resolve({ code: 0, msg: 'by land success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 播种
       * @param {*} withPaymentAmount 使用钱包usdt金额
       * @param {*} withSharedProfit  使用分销佣金金额
       * @param {*} withFomoReward 使用fomo奖金金额
       * @returns
       */
  doSowSeed(withPaymentAmount, withSharedProfit, withFomoReward, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      var withPaymentAmount_ = await web3.utils.toWei(withPaymentAmount.toString(), 'ether')
      var withSharedProfit_ = await web3.utils.toWei(withSharedProfit.toString(), 'ether')
      var withFomoReward_ = await web3.utils.toWei(withFomoReward.toString(), 'ether')
      await contract.methods.sowSeed(withPaymentAmount_, withSharedProfit_, withFomoReward_)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 带上级播种
       * @param {*} withPaymentAmount 使用钱包usdt金额
       * @param {String} parentAddress 上级（上线）钱包地址
       * @param {Number} withSharedProfit 使用分销佣金金额
       * @param {Number} withFomoReward 使用fomo奖金金额
       * @returns
       */
  doSowSeedWithParent(parentAddress, withPaymentAmount, withSharedProfit, withFomoReward, sender) {
    console.log(parentAddress, withPaymentAmount, withSharedProfit, withFomoReward, sender)
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      var withPaymentAmount_ = await web3.utils.toWei(withPaymentAmount.toString(), 'ether')
      var withSharedProfit_ = await web3.utils.toWei(withSharedProfit.toString(), 'ether')
      var withFomoReward_ = await web3.utils.toWei(withFomoReward.toString(), 'ether')
      await contract.methods.sowSeedWithParent(parentAddress, withPaymentAmount_, withSharedProfit_, withFomoReward_)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 查询账号是否可收割
       * @param {*} roundNumber 轮次
       * @param {*} account 账号地址
       * @returns
       */
  doCheckCollectable(roundNumber, account) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.checkCollectable(roundNumber, account)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 收割小麦
       * @param {*} roundNumber 轮次
       * @returns
       */
  doClaimSeed(roundNumber, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      await contract.methods.claimSeed(roundNumber)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 开单发展下线
       * @param {*} customer 下线玩家的钱包地址
       * @param {*} amount 开单金额
       * @returns
       */
  doDevelopCustomer(customer, amount, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['Relationship'], this.contractAddr['Relationship'], {})
      var amount_ = await web3.utils.toWei(amount.toString(), 'ether')
      await contract.methods.developCustomer(customer, amount_)
        .send({ from: sender, to: customer })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 查询上线
       * @param {*} child child钱包地址
       * @returns
       */
  doGetParent(child) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['RelationshipData'], this.contractAddr['RelationshipData'], {})
      await contract.methods.getParent(child)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取直接下线人数
       * @param {*} parent 钱包地址
       * @returns
       */
  doGetChildrenNumber(parent) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['RelationshipData'], this.contractAddr['RelationshipData'], {})
      await contract.methods.getChildrenNumber(parent)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取下线钱包地址
       * @param {*} parent 钱包地址
       * @param {*} index 下线编号，取值范围：1 <= index <= N，其中N=getChildrenNumber(parent)
       * @returns
       */
  doGetChildByIndex(parent, index) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['Relationship'], this.contractAddr['Relationship'], {})
      await contract.methods.getChildByIndex(parent, index)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取分销佣金账户详情
       * @param {String} account 钱包地址
       * @returns
       */
  doGetSharedProfit(account) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['RelationshipData'], this.contractAddr['RelationshipData'], {})
      await contract.methods.getSharedProfit(account)
        .call()
        .then((result) => {
          var resultTemp = web3.utils.fromWei((result.totalAmount - result.claimedAmount).toString(), 'ether')
          resultTemp = parseFloat(resultTemp).toFixed(4)

          var claimedAmount = web3.utils.fromWei((result.claimedAmount).toString(), 'ether')
          claimedAmount = parseFloat(claimedAmount).toFixed(4)

          var totalAmount = web3.utils.fromWei((result.totalAmount).toString(), 'ether')
          totalAmount = parseFloat(totalAmount).toFixed(4)

          resolve({ code: 0, msg: 'success', data: resultTemp, result: { claimedAmount, totalAmount }})
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 领取分销佣金
       * @param {Number} account 领取金额
       * @returns
       */
  doClaimSharedProfit(account, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      var account_ = await web3.utils.toWei(account.toString(), 'ether')
      await contract.methods.claimSharedProfit(account_)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 检查是否中奖
       * @param {*} account 账号地址
       * @param {*} roundNumber 轮次
       * @returns
       */
  doCheckFomoReward(account, roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.checkFomoReward(account, roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取可领取奖金金额
       * @param {String} account 账号地址
       * @returns
       */
  doFomoRewardClaimable(account) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.fomoRewardClaimable(account)
        .call()
        .then((result) => {
          var resultTemp = web3.utils.fromWei(result.amount, 'ether')
          resultTemp = parseFloat(resultTemp).toFixed(4)
          resolve({ code: 0, msg: 'success', data: resultTemp })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 领取奖金
       * @param {*} account 领取金额
       * @returns
       */
  doClaimFomoReward(account, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      var account_ = await web3.utils.toWei(account.toString(), 'ether')
      await contract.methods.claimFomoReward(account_)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取当前最大盘局编号
       * @returns
       */
  doGetCurrentRoundIndex() {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getCurrentRoundIndex()
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取盘局轮次数据
       * @param {*} roundNumber 轮次编号，1 <= roundNumber <= getMaxRoundNumber()
       * @returns
       */
  doGetRoundData(roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getRoundData(roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 慈善基金账户余额
       * @returns
       */
  doGetCharityAmount() {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getCharityAmount()
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }
  /**
       * 获取fomo奖池金额
       * @returns
       */
  doGetFomoPoolAmount(roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getFomoPoolAmount(roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 系统维护基金账户余额
       * @returns
       */
  doGetSysFundAmount() {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getSysFundAmount()
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取播种节点数据
       * @param {*} index 播种编号
       * @returns
       */
  doGetSeedNodeData(index) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getSeedNodeData(index)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取玩家未出局的播种数据
       * @param {*} roundNumber  轮次
       * @param {*} account 账号地址
       * @returns
       */
  doGetSeedUserData(roundNumber, account) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getSeedUserData(roundNumber, account)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取积压程度值
       * @param {*} roundNumber 轮次
       * @returns
       */
  doGetBacklog(roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getBacklog(roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 最后一名获奖者名单
       * @param {*} roundNumber 轮次
       * @returns
       */
  doGetLastInRewardAddress(roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getLastInRewardAddress(roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 最大出资获奖者名单
       * @param {*} roundNumber 轮次
       * @returns
       */
  doGetMostInRewardAddress(roundNumber) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmAppData'], this.contractAddr['MUTFarmAppData'], {})
      await contract.methods.getMostInRewardAddress(roundNumber)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 播种事件
       * @param {*} account 账号地址
       * @param {*} amount 买入金额
       * @returns
       */
  doSeedBoughtEvent(account, amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      await contract.methods.seedBoughtEvent(account, amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 卖出小麦事件
       * @param {*} account 账号地址
       * @param {*} amount 卖出金额
       * @returns
       */
  doSeedSoldEvent(account, amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      await contract.methods.seedSoldEvent(account, amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 领取小麦事件
       * @param {*} account 账号地址
       * @param {*} amount 领取金额
       * @returns
       */
  doSeedClaimedEvent(account, amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      await contract.methods.seedClaimedEvent(account, amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 领取奖金事件
       * @param {*} account 账号地址
       * @param {*} amount 领取金额
       * @returns
       */
  doFomoRewardClaimedEvent(account, amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['MUTFarmApp'], this.contractAddr['MUTFarmApp'], {})
      await contract.methods.fomoRewardClaimedEvent(account, amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 领取分销佣金事件
       * @param {*} account 账号地址
       * @param {*} amount  领取金额
       * @returns
       */
  doSharedProfitClaimedEvent(account, amount, sender) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['Relationship'], this.contractAddr['Relationship'], {})
      var amount_ = await web3.utils.toWei(amount.toString(), 'ether')
      await contract.methods.sharedProfitClaimedEvent(account, amount_)
        .send({ from: sender })
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 购买土地事件
       * @param {*} account 账号地址
       * @param {*} amount  MUT金额
       * @returns
       */
  doLandBought(account, amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['FarmLand'], this.contractAddr['FarmLand'], {})
      await contract.methods.landBought(account, amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置管理员
       * @param {*} to 账号地址
       * @returns
       */
  doSetOwner(to) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setOwner(to)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }
  /**
       * 获取管理员
       * @returns
       */
  doGetOwner() {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.getOwner()
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置小麦成熟时间
       * @param {*} time 时间长度，单位：秒。
       * @returns
       */
  doSetMatureTime(time) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setMatureTime(time)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置小麦收益率
       * @param {*} cyp  收益率，千分制，10表示1%，100表示10%，1000表示100%。
       * @returns
       */
  doSetCycleYieldsPercent(cyp) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setCycleYieldsPercent(cyp)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置奖金截留比率
       * @param {*} fpp 奖金截留比率，千分制
       * @returns
       */
  doSetFomoPoolPercent(fpp) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setFomoPoolPercent(fpp)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置系统维护基金截留比率
       * @param {*} sfp 系统维护基金截留比率，千分制
       * @returns
       */
  doSetSysFundPercent(sfp) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setSysFundPercent(sfp)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置慈善基金截留比率
       * @param {*} cp 慈善基金截留比率，千分制
       * @returns
       */
  doSetCharityPercent(cp) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setCharityPercent(cp)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置种子最小买入量
       * @param {*} amount 种子最小买入量
       * @returns
       */
  doSetMinAmountBuy(amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setMinAmountBuy(amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置种子最大买入量
       * @param {*} amount 种子最大买入量
       * @returns
       */
  doSetMaxAmountBuy(amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setMaxAmountBuy(amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置分销返佣等级比率
       * @param {Array} percents 分销返佣等级比率 这是个数组，数组元素未千分制， 如["100", "50", "30", "15", "5"]，表示一级10%、二级5%、 三级3%、四级1.5%、五级0.5%
       * @returns
       */
  doSetSharedPercent(percents) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setSharedPercent(percents)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置重启倒计时长
       * @param {*} s  重启倒计时长，时间单位：秒
       * @returns
       */
  doSetResetCountDownTimeLength(s) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setResetCountDownTimeLength(s)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置农场币合约地址
       * @param {*} tokenAddress 农场币合约地址
       * @returns
       */
  doSetFarmToken(tokenAddress) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setFarmToken(tokenAddress)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取农场币合约地址
       * @returns
       */
  doGetFarmToken() {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.getFarmToken()
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置开单发展下线最小MUT金额
       * @param {*} amount 获取开单发展下线最小MUT金额
       * @returns
       */
  doSetMinDevelopCustomAmount(amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setMinDevelopCustomAmount(amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 设置土地价格
       * @param {*} amount 土地价格
       * @returns
       */
  doSetLandPrice(amount) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemAuth'], this.contractAddr['SystemAuth'], {})
      await contract.methods.setLandPrice(amount)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  /**
       * 获取配置参数
       * @param {*} index 配置编号
       * @returns
       */
  doGetSysSetting(index) {
    return new Promise(async(resolve, reject) => {
      const web3 = new Web3(this.provider)
      var contract = new web3.eth.Contract(this.ABI['SystemSetting'], this.contractAddr['SystemSetting'], {})
      await contract.methods.getSysSetting(index)
        .call()
        .then((result) => {
          resolve({ code: 0, msg: 'success', data: result })
        })
        .catch((error) => {
          reject({ code: -1, msg: 'error', error })
          this.onError(error)
        })
    })
  }

  // 错误处理
  async onError(error) {
    console.log('error: ', error)
    // debugger
    if (error.code === 4001) {
      return
    }
    try {
      const web3 = new Web3(this.provider)
      web3.eth.handleRevert = true
      var jsonError = JSON.parse(error.toString().replace('Error: Transaction has been reverted by the EVM:', ''))
      console.log(await getRevertReason(jsonError.transactionHash))
      // console.log('jsonError: ', jsonError)
      // var message = web3.eth.abi.decodeParameter('uint256', jsonError.logsBloom)
      // web3.eth.getTransactionReceipt(jsonError.transactionHash, (respones) => {
      // web3.eth.getTransactionReceipt('0x361fb33d2315deb8a3cf8e5320624798c5acfec5bb9408841d3b2ca3366ce812', (respones) => {
      //   console.log(respones)
      // })
      // console.log(message)
      Message({
        offset: 180,
        type: 'error',
        message: 'error Hash:' + jsonError.transactionHash
      })

      // web3.eth.getTransaction(jsonError.transactionHash)
      //   .then(async(tx) => {
      //     const reason = web3.utils.toAscii(tx.input)
      //     console.log('Revert reason:', reason)
      //     Message({
      //       offset: 180,
      //       type: 'error',
      //       message: reason
      //     })
      //   })
      // this.getRevertReason(jsonError.transactionHash)
    } catch (error) {
      Message({
        offset: 180,
        type: 'error',
        message: error.message
      })
    }
  }

  // async getRevertReason(txHash) {
  //   const web3 = new Web3(this.provider)
  //   web3.eth.handleRevert = true
  //   const tx = await web3.eth.getTransaction(txHash)
  //   console.log('tx:', tx)
  //   const reason = web3.utils.toAscii(result.substr(138))
  //   console.log('Revert reason:', reason)
  //   var result = await web3.eth.call(tx, tx.blockNumber)
  //   result = result.startsWith('0x') ? result : `0x${result}`
  //   if (result && result.substr(138)) {
  //     const reason = web3.utils.toAscii(result.substr(138))
  //     console.log('Revert reason:', reason)
  //     return reason
  //   } else {
  //     console.log('Cannot get reason - No return value')
  //   }
  // }

  async onTestError() {
    const web3 = new Web3(this.provider)
    web3.eth.handleRevert = true
    const hax = '0x15b902220f152ac0f11a763e36d3e68d91ed78dc622c7086e65978262fbd0ecf'
    // web3.utils.toAscii(result.substr(138))
    // web3.eth.getTransaction(hax, (error, respones) => {
    //   console.log(error)
    //   console.log(respones)
    //   var message = web3.eth.abi.decodeParameter('uint256', respones.input)
    //   console.log(message)
    // })

    web3.eth.getTransactionReceipt(hax, (respones) => {
      console.log(respones)
    })
    // console.log(await getRevertReason('0x15b902220f152ac0f11a763e36d3e68d91ed78dc622c7086e65978262fbd0ecf'))
    // web3.eth.getTransactionFromBlock('0x15b902220f152ac0f11a763e36d3e68d91ed78dc622c7086e65978262fbd0ecf', 0, console.log)
    // var message = web3.eth.abi.decodeParameter('string', '0x0760b7e60000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
    // console.log(message)
    // web3.eth.decodeLog(message)
    // web3.eth.getTransaction('0x361fb33d2315deb8a3cf8e5320624798c5acfec5bb9408841d3b2ca3366ce812')
    //   .then(async(tx) => {
    //     console.log(tx)
    //     web3.eth.call(tx, tx.blockHash)
    //       .then(result => {
    //         console.log(result)
    //       })
    //   })
    // result = result.startsWith('0x') ? result : `0x${result}`

    // if (result && result.substr(138)) {
    //   const reason = web3.utils.toAscii(result.substr(138))
    //   console.log('Revert reason:', reason)
    //   return reason
    // } else {
    //   console.log('Cannot get reason - No return value')
    // }
  }

  // 监听消息回调
  onMessages() {

  }
}

export default new SwarmFarm()
