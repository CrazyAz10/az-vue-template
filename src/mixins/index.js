export default {
  data() {
    return {

    }
  },
  methods: {
    linkTo(to) {
      this.$router.push(to)
    },
    // 提示连接钱包
    async noConnect() {
      await this.$store.dispatch('address/connectWallet')
    },
    // 开发中提示
    noDeveloped() {
      this.$alert(this.$t('l.info_1'), this.$t('l.lable_28'), {
        confirmButtonText: this.$t('l.button_5'),
        center: true,
        callback: () => {}
      })
    },
    changeNumber(event) {
      console.log(event)
    }
  }
}
