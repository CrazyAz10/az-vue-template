<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    // 钱包连接状态
    connectStatus: function() {
      return this.$store.getters.connectStatus
    }
  },
  watch: {
    connectStatus: function(now, old) {
      if (this.$route.meta.roles) {
        // 权限路由判断
        if (this.$route.meta.roles.includes('user') && !now) {
          // 不连接不可访问权限
          this.$router.go()
        } else if (this.$route.meta.roles.includes('connectWallet')) {
          // 连接钱包需要刷新权限
          this.reload()
        }
      }
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
