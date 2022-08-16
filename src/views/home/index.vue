<template>
  <div id="home" class="container-wrap"></div>
</template>

<script>
import commonMixins from '@/mixins'
export default {
  name: 'Home',
  inject: ['reload'],
  components: {
  },
  mixins: [commonMixins],
  data() {
    return {
    }
  },
  computed: {
    connectStatus: function() {
      return this.$store.getters.connectStatus
    },
    // 合约配置
    contractConfig() {
      return this.$store.getters.contractConfig
    }
  },
  created() {},
  methods: {
  }
}
</script>

<style src="./home.scss" lang="scss" scoped></style>
