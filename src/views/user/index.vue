<template>
  <div id="user" class="container-wrap"></div>

</template>

<script>
// import Nft from './components/nft'
export default {
  name: 'User',
  components: {
  },
  data() {
    return {
    }
  },
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
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import url('//fonts.cdnfonts.com/css/geometr415-blk-bt');
</style>
