<template>
  <div v-if="dialogVisible" class="mask">
    <div class="mask-bg" @click="close" />
    <div class="mask-content" :class="{'center-box': centerBox}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    centerBox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.visible
      },
      set: function(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.mask{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
  .mask-bg{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0,0,0,.6);
  }
  .mask-content{
    &.center-box{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 10;
      max-height: 100vh;
      overflow: auto;
    }
  }
}
</style>
