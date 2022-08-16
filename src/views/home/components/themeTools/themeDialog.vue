<template>
  <!-- 二次封装dialog对话框 -->
  <el-dialog
    element-loading-background="elementLoadingBackground"
    :title="title"
    :lock-scroll="lockScroll"
    :custom-class="'theme-dialog '+customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :show-close="!loading"
    :visible.sync="dialogVisible"
    :width="width"
    @open="open"
    @close="close"
  >
    <div
      v-loading="loading"
      :element-loading-text="$t('l.info_39')"
    >
      <slot name="title" />
      <slot />
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    elementLoadingBackground: {
      type: String,
      default: function() {
        return 'rgba(0,0,0,.4)'
      }
    },
    lockScroll: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    center: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    closeOnClickModal: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    closeOnPressEscape: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    destroyOnClose: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    modal: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    customClass: {
      type: String,
      default: function() {
        return ''
      }
    },
    visible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    width: {
      type: String,
      default: function() {
        return '600px'
      }
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
    open() {
      this.$emit('open')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .theme-dialog{
    max-width: 100%;
    border-radius: 32px;
    .el-dialog__header{
        padding: 30px;
    }
    .el-dialog__headerbtn{
        right: 18px;
        top: 18px;
    }
    .el-dialog__close{
        font-weight: bold;
        z-index: 10;
        font-size: 28px;
        color: #999;
        &:hover{
            color: #444;
        }
    }
    .el-dialog__body{
        padding: 0 60px 60px;
    }
}
</style>
